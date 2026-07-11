import { type BlockNode, type TextNode } from "./types.js";

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
