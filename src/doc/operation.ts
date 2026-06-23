import { is, keys } from "../utils.js";
import {
  getBlockAt,
  getChildAt,
  getNodeSize,
  isTextNode,
  sliceFragment,
  splitBlock,
} from "./node.js";
import type {
  DocNode,
  Fragment,
  InlineNode,
  Selection,
  TextNode,
  Path,
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
  | FormatOperation
  | SetNodeAttrOperation;

/**
 * @internal
 */
export const isUnsafeOperation = ({ type }: Operation): boolean =>
  type === OP_INSERT_NODE || type === OP_FORMAT || type === OP_SET_NODE_ATTR;

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
        const [block, offset] = getBlockAt(doc, at);
        const res = getChildAt(block, offset - 1);
        let anchorNode: TextNode | undefined;
        if (res) {
          const node = res[0];
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
    case OP_FORMAT: {
      const {
        range: [start, end],
        key,
        value,
      } = op;
      if (
        isValidPosition(doc, start) &&
        isValidPosition(doc, end) &&
        start <= end
      ) {
        if (start === end) {
          const [{ children }, , path] = getBlockAt(doc, start);
          if (children.length === 1) {
            const maybeText = children[0]!;
            if (isTextNode(maybeText) && !maybeText.text) {
              doc = replaceNodeAt(
                doc,
                [...path, 0], // TODO imporve
                { ...maybeText, [key]: value },
              );
            }
          }
        } else {
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
