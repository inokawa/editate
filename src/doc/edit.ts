import { is, isString, keys } from "../utils.js";
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

export type Operation =
  | DeleteOperation
  | InsertTextOperation
  | InsertNodeOperation
  | SetAttrOperation;

/**
 * @internal
 */
export const isUnsafeOperation = ({ type }: Operation): boolean =>
  type === TYPE_INSERT_NODE || type === TYPE_SET_ATTR;

export class Transaction {
  private readonly _ops: Operation[];
  selection?: SelectionSnapshot;

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

  attr(start: Position, end: Position, key: string, value: unknown): this {
    this._ops.push({
      type: TYPE_SET_ATTR,
      start: start,
      end: end,
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
export const isTextNode = (node: InlineNode): node is TextNode =>
  "text" in node;

/**
 * @internal
 */
export const isBlockNode = (node: BlockNode | InlineNode): node is BlockNode =>
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

const getNodeSize = (node: InlineNode): number =>
  isTextNode(node) ? node.text.length : 1;

/**
 * @internal
 */
export const getBlockSize = (block: BlockNode): number =>
  block.children.reduce((acc: number, n) => acc + getNodeSize(n), 0);

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

const splitBlock = <T extends BlockNode>(block: T, offset: number): [T, T] => {
  const nodes = block.children;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]!;
    const size = getNodeSize(node);
    if (size > offset) {
      const before = nodes.slice(0, i);
      const after = nodes.slice(i + 1);
      if (isTextNode(node)) {
        const beforeText = node.text.slice(0, offset);
        const afterText = node.text.slice(offset);
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
    offset -= size;
  }
  return [block, { ...block, children: [] }];
};

const normalizePath = (path: Path): number => {
  // TODO support nested node
  return path.length ? path[0]! : 0;
};

const blockAtPath = (doc: DocNode, path: Path): BlockNode => {
  return doc.children[normalizePath(path)]!;
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

const replaceRange = <T extends DocNode>(
  doc: T,
  start: Position,
  end: Position,
  inserted: Fragment | string,
): T => {
  const [startPath, startOffset] = start;
  const [endPath, endOffset] = end;

  const [before, maybeAfter] = splitBlock(
    blockAtPath(doc, startPath),
    startOffset,
  );
  const after =
    comparePosition(start, end) === -1
      ? splitBlock(blockAtPath(doc, endPath), endOffset)[1]
      : maybeAfter;

  if (isString(inserted)) {
    const beforeNodes = before.children;
    // inherit style from previous text node
    const beforeLength = beforeNodes.length;
    let anchorNode: TextNode | undefined;
    if (beforeLength) {
      const maybeAnchor = beforeNodes[beforeLength - 1]!;
      if (isTextNode(maybeAnchor)) {
        anchorNode = maybeAnchor;
      }
    }
    inserted = stringToFragment(inserted, anchorNode);
  }

  let lines: BlockNode[];
  if (inserted.length) {
    lines = inserted.slice();
    lines[lines.length - 1] = joinBlocks(lines[lines.length - 1]!, after);
  } else {
    lines = [after];
  }
  lines[0] = joinBlocks(before, lines[0]!);

  const sliced = doc.children.slice();
  sliced.splice(
    normalizePath(startPath),
    normalizePath(endPath) - normalizePath(startPath) + 1,
    ...lines,
  );
  return { ...doc, children: sliced };
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
  // TODO improve
  if (!path.length || (path[0]! >= 0 && path[0]! < doc.children.length)) {
    if (offset >= 0 && offset <= getBlockSize(blockAtPath(doc, path))) {
      return true;
    }
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
          getBlockSize(lines[lineLength - 1]!) - (lineDiff === 0 ? 0 : at[1]),
          comparePath(at[0], position[0]) === 0,
        );
      }
      break;
    }
    case TYPE_SET_ATTR: {
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
        doc = replaceRange(doc, at, at, text);
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
    default: {
      op satisfies never;
    }
  }

  return [doc, selection];
};
