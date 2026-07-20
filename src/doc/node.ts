import { max, min } from "../utils.js";
import type { InferInlineNode, InferVoidNode } from "./types-infer.js";
import type {
  BlockNode,
  DocNode,
  InlineNode,
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

export const getChildAt = <T extends BlockNode>(
  { children }: T,
  offset: number,
): [node: T["children"][number], offset: number, index: number] | null => {
  // TODO optimize
  const length = children.length;
  for (let i = 0; i < length; i++) {
    const node = children[i]!;
    let size = getNodeSize(node);
    if (isBlockNode(node)) {
      size++;
    }
    if (size > offset || (size === offset && isTextNode(node) && !node.text)) {
      return [node, offset, i];
    }
    offset -= size;
  }
  return null;
};

export const getBlockAt = (
  node: DocNode | BlockNode,
  offset: number,
): [node: BlockNode, offset: number, path: Path] => {
  const path: number[] = [];
  while (node) {
    const found = getChildAt(node, offset);
    if (!found) {
      break;
    }
    const nextNode = found[0];
    if (!isBlockNode(nextNode)) {
      break;
    }
    offset = found[1];
    node = nextNode;
    path.push(found[2]);
  }
  return [node, offset, path];
};

export const getLeafAt = (
  node: DocNode | BlockNode,
  offset: number,
): [node: InlineNode, offset: number] | null => {
  const [blockNode, blockOffset] = getBlockAt(node, offset);
  const inline = getChildAt(blockNode, blockOffset);
  if (inline) {
    return [inline[0], inline[1]];
  }
  return null;
};

/**
 * @internal
 */
export const splitBlock = <T extends DocNode | BlockNode>(
  block: T,
  pos: number,
): [T, T] => {
  const children = block.children;
  const target = getChildAt(block, pos);
  if (target) {
    const [node, offsetAtNode, i] = target;
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
  const last = children[children.length - 1]!;
  return [
    block,
    { ...block, children: isTextNode(last) ? [{ ...last, text: "" }] : [] },
  ];
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
  const [, blockOffset, path] = getBlockAt(node, offset);
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

function* iterChilds<T extends Node>(
  node: T,
  [start, end]: Range,
): Generator<[node: Node, offset: number], void, void> {
  if (start >= end) {
    return;
  }
  if (!isBlockNode(node)) {
    return;
  }
  const res = getChildAt(node, start);
  if (res) {
    let offset = start - res[1];
    let i = res[2];
    const children = node.children;
    const length = children.length;
    while (offset <= end && i < length) {
      const targetNode = children[i]!;
      yield [targetNode, offset];

      i++;
      offset += getNodeSize(targetNode);
      if (isBlockNode(targetNode)) {
        offset++;
      }
    }
  }
}

export function* iterNodes<T extends Node>(
  node: T,
  range: Range,
): Generator<[node: Node, offset: number], void, void> {
  for (const n of iterChilds(node, range)) {
    yield n;
    for (const r of iterChilds(n[0], [0, getNodeSize(n[0])])) {
      yield [r[0], r[1] + n[1]];
    }
  }
}

export function* iterLeafs<T extends Node>(
  node: T,
  range: Range,
): Generator<[node: InferInlineNode<T>, offset: number], void, void> {
  if (!isBlockNode(node)) {
    yield [node as InferInlineNode<T>, 0];
    return;
  }
  for (const [c, cOffset] of iterChilds(node, range)) {
    for (const [l, lOffset] of iterLeafs(c, [0, getNodeSize(c)])) {
      yield [l as InferInlineNode<T>, lOffset + cOffset];
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
  for (const [leaf, leafStart] of iterLeafs(node, [start, end])) {
    for (let i = leafStart - offset; i > 0; i--) {
      str += "\n";
    }

    const size = getNodeSize(leaf);
    const leafEnd = leafStart + size;
    if (isTextNode(leaf)) {
      const textStart = max(leafStart, start) - leafStart;
      const textEnd = min(leafEnd, end) - leafStart;
      str +=
        textStart === 0 && textEnd === size
          ? leaf.text
          : leaf.text.slice(textStart, textEnd);
    } else {
      if (voidToString) {
        str += voidToString(leaf as InferVoidNode<T>);
      }
    }
    offset = leafEnd;
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
