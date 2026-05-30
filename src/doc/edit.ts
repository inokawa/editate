import { is, keys } from "../utils.js";
import type {
  DocNode,
  Fragment,
  InlineNode,
  Selection,
  TextNode,
  Path,
  BlockNode,
  Node,
  DomPosition,
  SelectionSnapshot,
  Range,
} from "./types.js";
import { stringToFragment } from "./utils.js";

const OP_DELETE = "delete";
type DeleteOperation = Readonly<{
  type: typeof OP_DELETE;
  range: Range;
}>;

const OP_INSERT_TEXT = "insert_text";
type InsertTextOperation = Readonly<{
  type: typeof OP_INSERT_TEXT;
  at: number;
  text: string;
}>;

const OP_INSERT_NODE = "insert_node";
type InsertNodeOperation = Readonly<{
  type: typeof OP_INSERT_NODE;
  at: number;
  fragment: Fragment;
}>;

const OP_SET_ATTR = "set_attr";
type SetAttrOperation = Readonly<{
  type: typeof OP_SET_ATTR;
  range: Range;
  key: string;
  value: unknown;
}>;

const OP_SET_NODE_ATTR = "set_node_attr";
type SetNodeAttrOperation = Readonly<{
  type: typeof OP_SET_NODE_ATTR;
  path: Path;
  key: string;
  value: unknown;
}>;

export type Operation =
  | DeleteOperation
  | InsertTextOperation
  | InsertNodeOperation
  | SetAttrOperation
  | SetNodeAttrOperation;

/**
 * @internal
 */
export const isUnsafeOperation = ({ type }: Operation): boolean =>
  type === OP_INSERT_NODE || type === OP_SET_ATTR || type === OP_SET_NODE_ATTR;

/**
 * @internal
 */
export const isTextNode = (node: Node): node is TextNode => "text" in node;

/**
 * @internal
 */
export const isBlockNode = (node: Node): node is BlockNode =>
  "children" in node;

const isSameNode = (a: InlineNode, b: InlineNode): boolean => {
  const aKeys = keys(a);
  if (aKeys.length !== keys(b).length) {
    return false;
  }
  return aKeys.every((k) => {
    if (!(k in b)) {
      return false;
    }
    return k === "text" || is((a as any)[k], (b as any)[k]);
  });
};

const sizeCache = new WeakMap<BlockNode, number>();

const calcBlockSize = (
  { children }: BlockNode,
  start: number = 0,
  end: number = children.length,
): number => {
  let size = 0;
  let count = 0;
  for (let i = start; i < end; i++) {
    const n = children[i]!;
    size += getNodeSize(n);
    if (count !== 0 && isBlockNode(n)) {
      size++;
    }
    count++;
  }
  return size;
};

export const getNodeSize = (node: Node): number => {
  if (isBlockNode(node)) {
    let size = sizeCache.get(node);
    if (size == null) {
      sizeCache.set(node, (size = calcBlockSize(node)));
    }
    return size;
  }
  return isTextNode(node) ? node.text.length : 1;
};

/**
 * @internal
 */
export const positionToOffset = (
  node: DocNode | BlockNode,
  [path, offset]: DomPosition,
): number => {
  let size = 0;
  for (const p of path) {
    size += calcBlockSize(node, 0, p);
    if (p !== 0) {
      size++;
    }
    node = node.children[p]! as BlockNode;
  }
  return size + offset;
};

export const offsetToPosition = (
  node: DocNode | BlockNode,
  offset: number,
): DomPosition => {
  const res = getBlockAt(node, offset);
  return [res._path, res._offset];
};

/**
 * @internal
 */
export const domSelectionToSelection = (
  doc: DocNode,
  [anchor, focus]: SelectionSnapshot,
): Selection => {
  return [positionToOffset(doc, anchor), positionToOffset(doc, focus)];
};

/**
 * @internal
 */
export const selectionToDomSelection = (
  doc: DocNode,
  [anchor, focus]: Selection,
): SelectionSnapshot => {
  return [offsetToPosition(doc, anchor), offsetToPosition(doc, focus)];
};

const normalizeInline = (
  array: InlineNode[],
  start: number = 0,
  end: number = array.length - 1,
): void => {
  let i = start + 1;
  while (i <= end) {
    const prev = array[i - 1]!;
    const curr = array[i]!;
    // merge text nodes with same attrs
    if (isTextNode(prev) && isTextNode(curr) && isSameNode(prev, curr)) {
      array[i - 1] = { ...prev, text: prev.text + curr.text };
      array.splice(i, 1);
      end--;
    } else {
      i++;
    }
  }

  // remove empty text nodes, leaving at least one node per block
  i = start;
  while (i <= end) {
    const node = array[i]!;
    if (isTextNode(node) && !node.text && array.length > 1) {
      array.splice(i, 1);
      end--;
    } else {
      i++;
    }
  }
};

const normalizeBlock = (
  array: BlockNode[],
  start: number = 0,
  end: number = array.length - 1,
): void => {
  let i = start + 1;
  while (i <= end) {
    const prev = array[i - 1]!;
    const curr = array[i]!;
    // merge block nodes
    array[i - 1] = joinBlocks(prev, curr);
    array.splice(i, 1);
    end--;
  }
};

const concat = <T extends Node>(
  a: T[],
  b: readonly T[],
  normalize: (array: T[], start: number, end: number) => void,
): void => {
  if (b.length) {
    const prevLength = a.length;
    a.push(...b);
    if (prevLength) {
      normalize(a, prevLength - 1, prevLength);
    }
  }
};

/**
 * @internal
 */
export const joinBlocks = <T extends BlockNode>(...blocks: T[]): T => {
  return {
    ...blocks[0]!,
    children: blocks.reduce((acc, b) => {
      concat(acc, b.children, normalizeInline);
      return acc;
    }, []),
  };
};

const getChildAt = <T extends BlockNode>(
  { children }: T,
  offset: number,
): { _node: T["children"][number]; _index: number; _offset: number } | null => {
  for (let i = 0; i < children.length; i++) {
    const node = children[i]!;
    let size = getNodeSize(node);
    if (isBlockNode(node)) {
      size++;
    }
    if (size > offset) {
      return { _node: node, _index: i, _offset: offset };
    }
    offset -= size;
  }
  return null;
};

/**
 * @internal
 */
export const getBlockAt = (
  node: DocNode | BlockNode,
  offset: number,
): { _node: BlockNode; _path: Path; _offset: number } => {
  const path: number[] = [];
  while (node) {
    const found = getChildAt(node, offset);
    if (!found) {
      break;
    }
    const nextNode = found._node;
    if (!isBlockNode(nextNode)) {
      break;
    }
    offset = found._offset;
    node = nextNode;
    path.push(found._index);
  }
  return { _node: node, _path: path, _offset: offset };
};

const splitBlock = <T extends DocNode | BlockNode>(
  block: T,
  pos: number,
): [T, T] => {
  const children = block.children;
  const target = getChildAt(block, pos);
  if (target) {
    const { _node: node, _offset: offsetAtNode, _index: i } = target;
    if (isBlockNode(node)) {
      const [childBefore, childAfter] = splitBlock(node, offsetAtNode);
      const before = children.slice(0, i);
      const after = children.slice(i + 1);
      before.push(childBefore);
      after.unshift(childAfter);
      return [
        { ...block, children: before },
        { ...block, children: after },
      ];
    } else {
      const before = children.slice(0, i);
      const after = children.slice(i + 1);
      if (isTextNode(node)) {
        const beforeText = node.text.slice(0, offsetAtNode);
        const afterText = node.text.slice(offsetAtNode);
        if (beforeText || !before.length) {
          before.push({ ...node, text: beforeText });
        }
        if (afterText || !after.length) {
          after.unshift({ ...node, text: afterText });
        }
      } else {
        // node size must be 1
        after.unshift(node);
      }
      return [
        { ...block, children: before },
        { ...block, children: after },
      ];
    }
  }
  return [block, { ...block, children: [] }];
};

const getNodeAtPath = (
  node: DocNode | BlockNode,
  path: Path,
): BlockNode | DocNode => {
  for (let i = 0; i < path.length; i++) {
    node = node.children[path[i]!]! as BlockNode; // TODO improve
  }
  return node;
};

const replace = <
  T extends { readonly children: readonly BlockNode[] | readonly InlineNode[] },
>(
  node: T,
  start: number,
  end: number,
  lines: Fragment,
): T => {
  const sliced = node.children.slice();
  sliced.splice(start, end - start + 1, ...lines);
  return { ...node, children: sliced };
};

const replaceNodeAt = <
  T extends { readonly children: readonly BlockNode[] | readonly InlineNode[] },
>(
  node: T,
  path: Path,
  afterNode: Node,
  i: number = 0,
): T => {
  if (i < path.length) {
    const index = path[i]!;
    return replace(node, index, index, [
      replaceNodeAt(node.children[index]! as T, path, afterNode, i + 1),
    ]);
  }
  // TODO improve type
  return afterNode as T;
};

const replaceRange = <T extends DocNode>(
  doc: T,
  start: number,
  end: number,
  inserted: Fragment,
): T => {
  const [before, maybeAfter] = splitBlock(doc, start);
  const after = start < end ? splitBlock(doc, end)[1] : maybeAfter;

  const array = before.children.slice();
  concat(array, inserted, normalizeBlock);
  concat(array, after.children, normalizeBlock);

  return { ...doc, children: array };
};

/**
 * @internal
 */
export const sliceFragment = <T extends DocNode>(
  doc: T,
  start: number,
  end: number,
): T["children"] => {
  if (start >= end) {
    return [];
  }

  return splitBlock(splitBlock(doc, end)[0], start)[1].children;
};

const isValidPosition = (doc: DocNode, offset: number): boolean => {
  return offset >= 0 && offset <= getNodeSize(doc);
};

export const rebase = (position: number, ops: readonly Operation[]): number => {
  return ops.reduce((acc, op) => rebasePosition(acc, op), position);
};

const rebasePosition = (position: number, op: Operation): number => {
  switch (op.type) {
    case OP_DELETE: {
      const [start, end] = op.range;

      if (position >= start) {
        // start <= position
        if (end >= position) {
          // start <= position <= end
          return start;
        }
        // start <= end < position
        return position + start - end;
      }
      break;
    }
    case OP_INSERT_TEXT: {
      const { at, text } = op;

      if (position >= at) {
        // at <= position
        return position + text.length;
      }
      break;
    }
    case OP_INSERT_NODE: {
      const { at, fragment } = op;

      if (position >= at) {
        // at <= position
        return position + getNodeSize({ children: fragment });
      }
      break;
    }
  }
  return position;
};

const rebaseSelection = (
  [anchor, focus]: Selection,
  op: Operation,
): Selection => {
  return [rebasePosition(anchor, op), rebasePosition(focus, op)];
};

/**
 * @internal
 */
export const isValidSelection = (
  doc: DocNode,
  [anchor, focus]: Selection,
): boolean => {
  return isValidPosition(doc, anchor) && isValidPosition(doc, focus);
};

/**
 * @internal
 */
export const applyOperation = <T extends DocNode>(
  doc: T,
  selection: Selection,
  op: Operation,
): [T, Selection] => {
  switch (op.type) {
    case OP_DELETE: {
      const [start, end] = op.range;
      if (
        isValidPosition(doc, start) &&
        isValidPosition(doc, end) &&
        start < end
      ) {
        doc = replaceRange(doc, start, end, []);
        selection = rebaseSelection(selection, op);
      }
      break;
    }
    case OP_INSERT_TEXT: {
      const { at, text } = op;
      if (isValidPosition(doc, at) && text) {
        // inherit style from previous block/text node
        const { _node: block, _offset: offset } = getBlockAt(doc, at);
        const res = getChildAt(block, offset - 1);
        let anchorNode: TextNode | undefined;
        if (res) {
          const node = res._node;
          if (isTextNode(node)) {
            anchorNode = node;
          }
        }

        doc = replaceRange(
          doc,
          at,
          at,
          stringToFragment(text, anchorNode, block),
        );
        selection = rebaseSelection(selection, op);
      }
      break;
    }
    case OP_INSERT_NODE: {
      const { at, fragment } = op;
      if (isValidPosition(doc, at) && fragment.length) {
        doc = replaceRange(doc, at, at, fragment);
        selection = rebaseSelection(selection, op);
      }
      break;
    }
    case OP_SET_ATTR: {
      const {
        range: [start, end],
        key,
        value,
      } = op;
      if (
        isValidPosition(doc, start) &&
        isValidPosition(doc, end) &&
        start < end
      ) {
        doc = replaceRange(
          doc,
          start,
          end,
          sliceFragment(doc, start, end).map((block) => ({
            ...block,
            children: block.children.map((node) =>
              isTextNode(node) ? { ...node, [key]: value } : node,
            ),
          })),
        );
      }
      break;
    }
    case OP_SET_NODE_ATTR: {
      const { path, key, value } = op;
      const node = getNodeAtPath(doc, path);
      if (node) {
        doc = replaceNodeAt(doc, path, { ...node, [key]: value });
      }
      break;
    }
    default: {
      op satisfies never;
    }
  }

  return [doc, selection];
};
