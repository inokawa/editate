import { isBlockNode, isTextNode } from "./edit.js";
import {
  type BlockNode,
  type DocNode,
  type InlineNode,
  type TextNode,
} from "./types.js";

/**
 * @internal
 */
export const docToString = <T extends DocNode>(
  doc: T,
  serializer: (node: InlineNode) => string = (n) =>
    isTextNode(n) ? n.text : "",
): string => {
  return doc.children.reduce((acc: string, r, i) => {
    const isBlock = isBlockNode(r);
    if (i !== 0 && isBlock) {
      acc += "\n";
    }
    return (
      acc +
      (isBlock
        ? r.children.reduce((acc: string, n) => acc + serializer(n), "")
        : "")
    );
  }, "");
};

/**
 * @internal
 */
export const stringToFragment = <T extends TextNode, B extends BlockNode>(
  text: string,
  node?: T,
  block?: B,
) => {
  return text
    .split("\n")
    .map((l) => ({ ...block, children: [{ ...node, text: l } as T] }));
};
