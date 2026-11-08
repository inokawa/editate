import { is, keys } from "../utils.js";
import {
  getLeafBlockAt,
  getChildAt,
  getNodeSize,
  hasBlockChildren,
  isBlockNode,
  isTextNode,
  splitBlock,
  iterChildren,
} from "./node.js";
import { isCollapsed, isCovered } from "./position.js";
import type {
  DocNode,
  Fragment,
  InlineNode,
  Selection,
  BlockNode,
  Node,
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

const OP_FORMAT = "format";
type FormatOperation = Readonly<{
  type: typeof OP_FORMAT;
  range: Range;
  key: string;
  /** Omit or pass undefined to remove the attr. */
  value?: unknown;
  /** Depth of nodes to update like array.at() on the path from the root to each leaf in the range: -1 (default) is the leaf, -2 its block and 0 the root. */
  depth?: number;
}>;

export type Operation =
  DeleteOperation | InsertTextOperation | InsertNodeOperation | FormatOperation;

/**
 * @internal
 */
export const isUnsafeOperation = ({ type }: Operation): boolean =>
  type !== OP_INSERT_TEXT && type !== OP_DELETE;

const isSameNode = (a: InlineNode, b: InlineNode): boolean => {
  const aKeys = keys(a);
  if (aKeys.length !== keys(b).length) {
    return false;
  }
  return aKeys.every(
    (k) => k in b && (k === "text" || is((a as any)[k], (b as any)[k])),
  );
};

const normalizeInline = (nodes: readonly InlineNode[]): InlineNode[] => {
  const array: InlineNode[] = [];
  let prev: InlineNode | undefined;
  for (let n of nodes) {
    // remove empty text nodes, leaving at least one node per block
    if (isTextNode(n) && !n.text) {
      continue;
    }
    // merge text nodes with same attrs
    if (prev && isTextNode(prev) && isTextNode(n) && isSameNode(prev, n)) {
      n = { ...prev, text: prev.text + n.text };
      array.pop();
    }
    array.push((prev = n));
  }
  return array.length ? array : nodes.slice(-1);
};

const concat = <T extends Node>(a: readonly T[], b: readonly T[]): T[] => {
  const i = a.length - 1;
  const array = a.concat(b);
  if (i >= 0 && b.length) {
    const isBlock = isBlockNode(array[i]!);
    if (isBlock === isBlockNode(array[i + 1]!)) {
      if (isBlock) {
        array.splice(
          i,
          2,
          joinBlocks(array.slice(i, i + 2) as BlockNode[]) as T,
        );
      } else {
        array.splice(
          i,
          2,
          ...(normalizeInline(array.slice(i, i + 2) as InlineNode[]) as T[]),
        );
      }
    }
  }
  if (!array.length) {
    array.push({ text: "" } as T);
  }
  return array;
};

/**
 * @internal
 */
export const joinBlocks = <T extends BlockNode>(blocks: readonly T[]): T => {
  return {
    ...blocks[0]!,
    children: blocks.reduce<Node[]>((acc, b) => concat(acc, b.children), []),
  };
};

const LEAF = 1;

const updateRange = <T extends DocNode | BlockNode>(
  node: T,
  range: Range,
  mapNode: (node: Node) => Node,
  isTarget: (mask: number, level: number) => boolean,
  level: number,
  collapsed: boolean,
): [node: T, mask: number] => {
  let mask = 0;
  let changed = false;
  let endIndex = 0;
  let nodes: Node[] | undefined;
  for (const [n, , i, childRange] of iterChildren(node, range)) {
    if (!nodes) {
      nodes = node.children.slice(0, i);
    }
    const covered = isCovered(childRange, getNodeSize(n));
    let next = n;
    if (isBlockNode(n)) {
      let m: number;
      [next, m] = updateRange(
        n,
        childRange,
        mapNode,
        isTarget,
        level + 1,
        collapsed,
      );
      mask |= m << 1;
    } else {
      if (covered || collapsed) {
        mask |= LEAF << 1;
      }
      if (covered && isTarget(LEAF, level + 1)) {
        if (isTextNode(n)) {
          const [start, end] = childRange;
          if (start > 0) {
            nodes.push({ ...n, text: n.text.slice(0, start) });
          }
          next = mapNode({ ...n, text: n.text.slice(start, end) });
          if (end < n.text.length) {
            nodes.push(next);
            next = { ...n, text: n.text.slice(end) };
          }
        } else {
          next = mapNode(n);
        }
      }
    }
    if (next !== n) {
      changed = true;
    }
    nodes.push(next);
    endIndex = i;
  }
  let next = node;
  if (changed) {
    const array = normalizeInline(
      nodes!.concat(node.children.slice(endIndex + 1)) as InlineNode[],
    );
    next = { ...node, children: array as T["children"] };
  }
  if (isTarget(mask, level)) {
    next = mapNode(next) as T;
  }
  return [next, mask];
};

const replaceRange = <T extends DocNode>(
  doc: T,
  start: number,
  end: number,
  inserted: Fragment,
): T => {
  const [before, maybeAfter] = splitBlock(doc, start);
  const after = start < end ? splitBlock(doc, end)[1] : maybeAfter;

  const isBlock = hasBlockChildren(inserted);
  if (isBlock !== hasBlockChildren(doc.children)) {
    inserted = isBlock
      ? joinBlocks(inserted as BlockNode[]).children
      : [{ children: inserted }];
  }
  return {
    ...doc,
    children: concat(concat(before.children, inserted), after.children),
  };
};

const isValidPosition = (doc: DocNode, offset: number): boolean => {
  return offset >= 0 && offset <= getNodeSize(doc);
};

/**
 * @internal
 */
export const mapPositionWithOps = (
  position: number,
  ops: readonly Operation[],
): number => {
  return ops.reduce((acc, op) => mapPosition(acc, op), position);
};

/**
 * Remap a position through the given operation.
 * @param stickBefore `true` to keep the position in place when content is inserted at it, instead of moving it after the inserted content.
 */
export const mapPosition = (
  position: number,
  op: Operation,
  stickBefore?: boolean,
): number => {
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
    case OP_INSERT_TEXT:
    case OP_INSERT_NODE: {
      const { at } = op;

      if (stickBefore ? position > at : position >= at) {
        // at <= position
        return (
          position +
          (op.type === OP_INSERT_TEXT
            ? op.text.length
            : getNodeSize({ children: op.fragment }))
        );
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
  return [mapPosition(anchor, op), mapPosition(focus, op)];
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
      if (isValidSelection(doc, op.range) && start < end) {
        doc = replaceRange(doc, start, end, []);
        selection = rebaseSelection(selection, op);
      }
      break;
    }
    case OP_INSERT_TEXT: {
      const { at, text } = op;
      if (isValidPosition(doc, at) && text) {
        // inherit style from previous block/text node
        const [block, offset] = getLeafBlockAt(doc, at);
        const res = getChildAt(block, offset, true);
        doc = replaceRange(
          doc,
          at,
          at,
          stringToFragment(
            text,
            res && isTextNode(res[0]) ? res[0] : undefined,
            block,
          ),
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
    case OP_FORMAT: {
      const { range, key, value, depth = -1 } = op;
      if (isValidSelection(doc, range) && range[0] <= range[1]) {
        const isTarget = (mask: number, level: number): boolean =>
          depth < 0 ? !!(mask & (1 << (-depth - 1))) : depth === level;
        const patch = <N extends Node | DocNode>(n: N): N => {
          if (value !== undefined) {
            return { ...n, [key]: value };
          }
          const { [key]: removed, ...rest } = n as N & Record<string, unknown>;
          return rest as N;
        };
        doc = updateRange(
          doc,
          range,
          patch,
          isTarget,
          0,
          isCollapsed(range),
        )[0];
      }
      break;
    }
    default: {
      op satisfies never;
    }
  }

  return [doc, selection];
};
