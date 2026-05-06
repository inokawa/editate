import { is, keys } from "../utils.js";
import { comparePath, comparePosition } from "./position.js";
import type {
  DocNode,
  Fragment,
  InlineNode,
  Position,
  SelectionSnapshot,
  TextNode,
  Path,
  BlockNode,
  Node,
} from "./types.js";
import { stringToFragment } from "./utils.js";

const TYPE_DELETE = "delete";
type DeleteOperation = Readonly<{
  type: typeof TYPE_DELETE;
  start: Position;
  end: Position;
}>;

const TYPE_INSERT_TEXT = "insert_text";
type InsertTextOperation = Readonly<{
  type: typeof TYPE_INSERT_TEXT;
  at: Position;
  text: string;
}>;

const TYPE_INSERT_NODE = "insert_node";
type InsertNodeOperation = Readonly<{
  type: typeof TYPE_INSERT_NODE;
  at: Position;
  fragment: Fragment;
}>;

const TYPE_SET_ATTR = "set_attr";
type SetAttrOperation = Readonly<{
  type: typeof TYPE_SET_ATTR;
  start: Position;
  end: Position;
  key: string;
  value: unknown;
}>;

const TYPE_SET_NODE_ATTR = "set_node_attr";
type SetNodeAttrOperation = Readonly<{
  type: typeof TYPE_SET_NODE_ATTR;
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
  type === TYPE_INSERT_NODE ||
  type === TYPE_SET_ATTR ||
  type === TYPE_SET_NODE_ATTR;

export class Transaction {
  private readonly _ops: Operation[];

  constructor(ops?: readonly Operation[]) {
    this._ops = ops ? ops.slice() : [];
  }

  get ops(): readonly Operation[] {
    return this._ops;
  }

  insertText(start: Position, text: string): this {
    this._ops.push({
      type: TYPE_INSERT_TEXT,
      at: start,
      text: text,
    });
    return this;
  }

  insertFragment(start: Position, fragment: Fragment): this {
    this._ops.push({
      type: TYPE_INSERT_NODE,
      at: start,
      fragment: fragment,
    });
    return this;
  }

  delete(start: Position, end: Position): this {
    this._ops.push({
      type: TYPE_DELETE,
      start: start,
      end: end,
    });
    return this;
  }

  format(start: Position, end: Position, key: string, value: unknown): this {
    this._ops.push({
      type: TYPE_SET_ATTR,
      start: start,
      end: end,
      key: key,
      value: value,
    });
    return this;
  }

  attr(at: Path, key: string, value: unknown): this {
    this._ops.push({
      type: TYPE_SET_NODE_ATTR,
      path: at,
      key: key,
      value: value,
    });
    return this;
  }

  transform(position: Position): Position {
    return this._ops.reduce((acc, op) => rebasePosition(acc, op), position);
  }
}

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

export const getNodeSize = (node: Node): number =>
  isBlockNode(node)
    ? node.children.reduce((acc: number, n) => acc + getNodeSize(n), 0)
    : isTextNode(node)
      ? node.text.length
      : 1;

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
    const size = getNodeSize(node);
    if (size > offset) {
      return { _node: node, _index: i, _offset: offset };
    }
    offset -= size;
  }
  return null;
};

const splitBlock = <T extends DocNode | BlockNode>(
  block: T,
  pos: Position,
  i: number = 0,
): [T, T] => {
  const children = block.children;
  const path = pos[0];
  if (i < path.length) {
    const p = path[i]!;
    const [childBefore, childAfter] = splitBlock(
      children[p]! as BlockNode, // TODO imporove
      pos,
      i + 1,
    );
    const before = children.slice(0, p);
    const after = children.slice(p + 1);
    before.push(childBefore);
    after.unshift(childAfter);
    return [
      { ...block, children: before },
      { ...block, children: after },
    ];
  } else {
    const target = getChildAt(block, pos[1]);
    if (target) {
      const { _node: inline, _offset: nodeAtOffset, _index: i } = target;
      const before = children.slice(0, i);
      const after = children.slice(i + 1);
      if (isTextNode(inline)) {
        const beforeText = inline.text.slice(0, nodeAtOffset);
        const afterText = inline.text.slice(nodeAtOffset);
        if (beforeText || !before.length) {
          before.push({ ...inline, text: beforeText });
        }
        if (afterText || !after.length) {
          after.unshift({ ...inline, text: afterText });
        }
      } else {
        // node size must be 1
        after.unshift(inline);
      }
      return [
        { ...block, children: before },
        { ...block, children: after },
      ];
    }
    return [block, { ...block, children: [] }];
  }
};

const flatPath = (path: Path): number => {
  // TODO support nested node
  return path.length ? path[0]! : 0;
};

const getNodeAt = (
  node: DocNode | BlockNode,
  path: Path,
): BlockNode | DocNode => {
  for (let i = 0; i < path.length; i++) {
    node = node.children[path[i]!]! as BlockNode; // TODO improve
  }
  return node;
};

/**
 * @internal
 */
export const getBlockAt: (doc: DocNode, path: Path) => BlockNode = getNodeAt;

const move = (
  position: Position,
  pathDiff: number,
  offsetDiff: number,
  isSamePath: boolean,
): Position => {
  return [
    [
      // TODO support nested node
      flatPath(position[0]) + pathDiff,
    ],
    position[1] + (isSamePath ? offsetDiff : 0),
  ];
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
  start: Position,
  end: Position,
  inserted: Fragment,
): T => {
  const [before, maybeAfter] = splitBlock(doc, start);
  const after =
    comparePosition(start, end) === -1 ? splitBlock(doc, end)[1] : maybeAfter;

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
  start: Position,
  end: Position,
): T["children"] => {
  if (comparePosition(start, end) !== -1) {
    return [];
  }

  return splitBlock(splitBlock(doc, end)[0], start)[1].children;
};

const isValidPosition = (doc: DocNode, [path, offset]: Position): boolean => {
  const block = getBlockAt(doc, path);
  if (block && offset >= 0 && offset <= getNodeSize(block)) {
    return true;
  }
  return false;
};

const rebasePosition = (position: Position, op: Operation): Position => {
  switch (op.type) {
    case TYPE_DELETE: {
      const { start, end } = op;

      if (comparePosition(position, start) !== -1) {
        // start <= position
        if (comparePosition(end, position) !== -1) {
          // start <= position <= end
          return start;
        }
        // start <= end < position
        return move(
          position,
          flatPath(start[0]) - flatPath(end[0]),
          start[1] - end[1],
          comparePath(end[0], position[0]) === 0,
        );
      }
      break;
    }
    case TYPE_INSERT_TEXT:
    case TYPE_INSERT_NODE: {
      const at = op.at;

      if (comparePosition(position, at) !== -1) {
        const lines =
          op.type === TYPE_INSERT_TEXT
            ? stringToFragment(op.text)
            : op.fragment;

        const lineLength = lines.length;
        const lineDiff = lineLength - 1;

        // at <= position
        return move(
          position,
          lineDiff,
          getNodeSize(lines[lineLength - 1]!) - (lineDiff === 0 ? 0 : at[1]),
          comparePath(at[0], position[0]) === 0,
        );
      }
      break;
    }
    case TYPE_SET_ATTR:
    case TYPE_SET_NODE_ATTR: {
      break;
    }
    default: {
      op satisfies never;
    }
  }
  return position;
};

/**
 * @internal
 */
export const rebaseSelection = (
  selection: SelectionSnapshot,
  op: Operation,
): SelectionSnapshot => {
  return [rebasePosition(selection[0], op), rebasePosition(selection[1], op)];
};

/**
 * @internal
 */
export const isValidSelection = (
  doc: DocNode,
  [anchor, focus]: SelectionSnapshot,
): boolean => {
  return isValidPosition(doc, anchor) && isValidPosition(doc, focus);
};

/**
 * @internal
 */
export const applyOperation = <T extends DocNode>(
  doc: T,
  selection: SelectionSnapshot,
  op: Operation,
): [T, SelectionSnapshot] => {
  switch (op.type) {
    case TYPE_DELETE: {
      const { start, end } = op;
      if (
        isValidPosition(doc, start) &&
        isValidPosition(doc, end) &&
        comparePosition(start, end) === -1
      ) {
        doc = replaceRange(doc, start, end, []);
        selection = rebaseSelection(selection, op);
      }
      break;
    }
    case TYPE_INSERT_TEXT: {
      const { at, text } = op;
      if (isValidPosition(doc, at) && text) {
        // inherit style from previous block/text node
        const block = getBlockAt(doc, at[0]);
        const res = getChildAt(block, at[1] - 1);
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
    case TYPE_INSERT_NODE: {
      const { at, fragment } = op;
      if (isValidPosition(doc, at) && fragment.length) {
        doc = replaceRange(doc, at, at, fragment);
        selection = rebaseSelection(selection, op);
      }
      break;
    }
    case TYPE_SET_ATTR: {
      const { start, end, key, value } = op;
      if (
        isValidPosition(doc, start) &&
        isValidPosition(doc, end) &&
        comparePosition(start, end) === -1
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
    case TYPE_SET_NODE_ATTR: {
      const { path, key, value } = op;
      const node = getNodeAt(doc, path);
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
