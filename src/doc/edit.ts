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

const normalize = <T extends InlineNode>(
  array: T[],
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

const concat = <T extends InlineNode>(a: T[], b: readonly T[]): void => {
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
      concat(acc, b.children);
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

const splitBlock = <T extends BlockNode>(block: T, offset: number): [T, T] => {
  const target = getChildAt(block, offset);
  if (target) {
    const { _node: node, _offset: nodeAtOffset, _index: i } = target;
    const nodes = block.children;
    const before = nodes.slice(0, i);
    const after = nodes.slice(i + 1);
    if (isTextNode(node)) {
      const beforeText = node.text.slice(0, nodeAtOffset);
      const afterText = node.text.slice(nodeAtOffset);
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
  return [block, { ...block, children: [] }];
};

/**
 * @internal
 */
export const normalizePath = (path: Path): number => {
  // TODO support nested node
  return path.length ? path[0]! : 0;
};

/**
 * @internal
 */
export const getBlockAt = (doc: DocNode, path: Path): BlockNode => {
  return doc.children[normalizePath(path)]!;
};

const getNodeAt = (doc: DocNode, path: Path): BlockNode | DocNode => {
  return path.length ? doc.children[normalizePath(path)]! : doc;
};

const move = (
  position: Position,
  pathDiff: number,
  offsetDiff: number,
  isSamePath: boolean,
): Position => {
  return [
    [
      // TODO support nested node
      normalizePath(position[0]) + pathDiff,
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
  afterNode: BlockNode,
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
  const [startPath, startOffset] = start;
  const [endPath, endOffset] = end;

  const [before, maybeAfter] = splitBlock(
    getBlockAt(doc, startPath),
    startOffset,
  );
  const after =
    comparePosition(start, end) === -1
      ? splitBlock(getBlockAt(doc, endPath), endOffset)[1]
      : maybeAfter;

  let lines: BlockNode[];
  if (inserted.length) {
    lines = inserted.slice();
    lines[lines.length - 1] = joinBlocks(lines[lines.length - 1]!, after);
    lines[0] = joinBlocks(before, lines[0]!);
  } else {
    lines = [joinBlocks(before, after)];
  }

  return replace(doc, normalizePath(startPath), normalizePath(endPath), lines);
};

/**
 * @internal
 */
export const sliceFragment = (
  doc: DocNode,
  start: Position,
  end: Position,
): Fragment => {
  if (comparePosition(start, end) !== -1) {
    return [];
  }

  const sliced = doc.children.slice(
    normalizePath(start[0]),
    normalizePath(end[0]) + 1,
  );
  const lastIndex = sliced.length - 1;
  sliced[lastIndex] = splitBlock(sliced[lastIndex]!, end[1])[0];
  sliced[0] = splitBlock(sliced[0]!, start[1])[1];
  return sliced;
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
          normalizePath(start[0]) - normalizePath(end[0]),
          start[1] - end[1],
          comparePath(end[0], position[0]) === 0,
        );
      }
      break;
    }
    case TYPE_INSERT_TEXT:
    case TYPE_INSERT_NODE: {
      const at = op.at;
      const lines =
        op.type === TYPE_INSERT_TEXT ? stringToFragment(op.text) : op.fragment;

      const lineLength = lines.length;
      const lineDiff = lineLength - 1;

      if (comparePosition(position, at) !== -1) {
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
