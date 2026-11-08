import { max, min } from "../utils.js";
import type {
  InferInlineNode,
  InferLeafBlockNode,
  InferVoidNode,
} from "./types-infer.js";
import type {
  BlockNode,
  DocNode,
  Node,
  Path,
  TextNode,
  DomPosition,
  DomSelection,
  Selection,
  Fragment,
  Range,
} from "./types.js";

/**
 * @internal
 */
export const isTextNode = (node: Node): node is TextNode => "text" in node;

/**
 * @internal
 */
export const isBlockNode = (node: Node): node is BlockNode =>
  "children" in node;

/**
 * @internal
 */
export const hasBlockChildren = (
  children: Fragment,
): children is Extract<typeof children, readonly BlockNode[]> => {
  return children.some(isBlockNode);
};

const sizeCache = new WeakMap<BlockNode, number>();

const calcBlockSize = ({ children }: BlockNode): number => {
  let size = 0;
  for (let i = 0; i < children.length; i++) {
    const n = children[i]!;
    size += getNodeSize(n);
    if (i !== 0 && isBlockNode(n)) {
      size++;
    }
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

export const getChildAt = <T extends BlockNode>(
  { children }: T,
  offset: number,
  isBackwardAffinity?: boolean,
): [node: T["children"][number], offset: number, index: number] | null => {
  // TODO optimize
  const length = children.length;
  for (let i = 0; i < length; i++) {
    const node = children[i]!;
    const isBlock = isBlockNode(node);
    let size = getNodeSize(node);
    const isEmptyNode = size === 0;
    if (isBlock) {
      size++;
    }
    if (
      size > offset ||
      (size === offset && !isBlock && (isBackwardAffinity || isEmptyNode))
    ) {
      return [node, offset, i];
    }
    offset -= size;
  }
  return null;
};

export const getLeafBlockAt = <T extends DocNode | BlockNode>(
  node: T,
  offset: number,
): [node: InferLeafBlockNode<T>, offset: number, path: Path] => {
  const path: number[] = [];
  let found;
  while ((found = getChildAt(node, offset)) && isBlockNode(found[0])) {
    offset = found[1];
    node = found[0] as T;
    path.push(found[2]);
  }
  return [node as InferLeafBlockNode<T>, offset, path];
};

export const getLeafAt = <T extends DocNode | BlockNode>(
  node: T,
  offset: number,
  isBackwardAffinity?: boolean,
): [node: InferInlineNode<T>, offset: number, path: Path] | null => {
  const [blockNode, blockOffset, path] = getLeafBlockAt(node, offset);
  const inline = getChildAt(blockNode, blockOffset, isBackwardAffinity);
  if (inline) {
    (path as number[]).push(inline[2]);
    return [inline[0] as InferInlineNode<T>, inline[1], path];
  }
  return null;
};

export const getNodeOffset = (
  root: DocNode | BlockNode,
  target: Node,
): number | null => {
  // TODO optimize
  let offset = 0;
  for (const child of root.children) {
    if (child === target) {
      return offset;
    }
    if (isBlockNode(child)) {
      const found = getNodeOffset(child, target);
      if (found != null) {
        return offset + found;
      }
      offset++;
    }
    offset += getNodeSize(child);
  }
  return null;
};

/**
 * @internal
 */
export const splitBlock = <T extends DocNode | BlockNode>(
  node: T,
  pos: number,
  placeholder: boolean = true,
): [T, T] => {
  const children = node.children;
  const target = getChildAt(node, pos);
  if (!target) {
    const last = children[children.length - 1]!;
    return [
      node,
      {
        ...node,
        children:
          placeholder && isTextNode(last) ? [{ ...last, text: "" }] : [],
      },
    ];
  }
  const [child, offsetAtChild, i] = target;
  const before: Node[] = children.slice(0, i);
  const after: Node[] = children.slice(i + 1);
  if (isBlockNode(child)) {
    const [childBefore, childAfter] = splitBlock(
      child,
      offsetAtChild,
      placeholder,
    );
    before.push(childBefore);
    after.unshift(childAfter);
  } else if (isTextNode(child)) {
    const beforeText = child.text.slice(0, offsetAtChild);
    const afterText = child.text.slice(offsetAtChild);
    if (beforeText || !before.length) {
      before.push({ ...child, text: beforeText });
    }
    if (afterText || (placeholder && !after.length)) {
      after.unshift({ ...child, text: afterText });
    }
  } else {
    // node size must be 1
    after.unshift(child);
  }
  return [
    { ...node, children: before },
    { ...node, children: after },
  ];
};

/**
 * @internal
 */
export const positionToOffset = (
  node: DocNode | BlockNode,
  [path, offset]: DomPosition,
): number => {
  for (const p of path) {
    for (let i = 0; i < p; i++) {
      offset += getNodeSize(node.children[i]!) + 1;
    }
    node = node.children[p]! as BlockNode;
  }
  return offset;
};

export const offsetToPosition = (
  node: DocNode | BlockNode,
  offset: number,
): DomPosition => {
  const [, blockOffset, path] = getLeafBlockAt(node, offset);
  return [path, blockOffset];
};

/**
 * @internal
 */
export const domSelectionToSelection = (
  doc: DocNode,
  [anchor, focus]: DomSelection,
): Selection => {
  return [positionToOffset(doc, anchor), positionToOffset(doc, focus)];
};

/**
 * @internal
 */
export const selectionToDomSelection = (
  doc: DocNode,
  [anchor, focus]: Selection,
): DomSelection => {
  return [offsetToPosition(doc, anchor), offsetToPosition(doc, focus)];
};

/**
 * @internal
 */
export function* iterChildren<T extends Node>(
  node: T,
  [start, end]: Range,
): Generator<
  [node: Node, offset: number, index: number, range: Range],
  void,
  void
> {
  if (start > end || !isBlockNode(node)) {
    return;
  }
  const res = getChildAt(node, start) || getChildAt(node, start, true);
  if (res) {
    let offset = start - res[1];
    let i = res[2];
    const children = node.children;
    const length = children.length;
    while (offset <= end && i < length) {
      const targetNode = children[i]!;
      const size = getNodeSize(targetNode);
      yield [
        targetNode,
        offset,
        i,
        [max(start, offset) - offset, min(end, offset + size) - offset],
      ];

      i++;
      offset += size;
      if (isBlockNode(targetNode)) {
        offset++;
      }
    }
  }
}

export function* iterLeafBlocks<T extends Node>(
  node: T,
  range: Range,
): Generator<
  [node: InferLeafBlockNode<T>, offset: number, range: Range],
  void,
  void
> {
  if (isBlockNode(node) && !hasBlockChildren(node.children)) {
    yield [node as InferLeafBlockNode<T>, 0, range];
    return;
  }
  for (const [child, offset, , childRange] of iterChildren(node, range)) {
    for (const r of iterLeafBlocks(child, childRange)) {
      r[1] += offset;
      yield r as [InferLeafBlockNode<T>, number, Range];
    }
  }
}

export function* iterLeaves<T extends Node>(
  node: T,
  range: Range,
): Generator<
  [node: InferInlineNode<T>, offset: number, range: Range],
  void,
  void
> {
  if (!isBlockNode(node)) {
    yield [node as InferInlineNode<T>, 0, range];
    return;
  }
  for (const [child, offset, , childRange] of iterChildren(node, range)) {
    for (const leaf of iterLeaves(child, childRange)) {
      leaf[1] += offset;
      yield leaf as [InferInlineNode<T>, number, Range];
    }
  }
}

export const sliceText = <T extends Node>(
  node: T,
  start: number = 0,
  end: number = Infinity,
  voidToString?: (node: InferVoidNode<T>) => string,
): string => {
  let str = "";
  let offset = start;
  for (const [leaf, leafStart, [textStart, textEnd]] of iterLeaves(node, [
    start,
    end,
  ])) {
    for (let i = leafStart - offset; i > 0; i--) {
      str += "\n";
    }

    if (isTextNode(leaf)) {
      str += leaf.text.slice(textStart, textEnd);
    } else if (voidToString && textStart < textEnd) {
      str += voidToString(leaf as InferVoidNode<T>);
    }
    offset = leafStart + getNodeSize(leaf);
  }

  for (let i = min(end, getNodeSize(node)) - offset; i > 0; i--) {
    str += "\n";
  }
  return str;
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
