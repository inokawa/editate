import type { DocNode, Node, TextNode } from "./types.js";

type Flatten<T> = T extends any ? T : never;

export type InferBlockNode<T extends Node> = Flatten<
  T extends { children: readonly (infer N extends Node)[] }
    ? T | InferBlockNode<N>
    : never
>;
export type InferInlineNode<T extends Node> = Flatten<
  T extends { children: readonly (infer N extends Node)[] }
    ? InferInlineNode<N>
    : T
>;
export type InferVoidNode<T extends DocNode> = Exclude<
  InferInlineNode<T>,
  TextNode
>;
export type InferTextNode<T extends DocNode> = Extract<
  InferInlineNode<T>,
  TextNode
>;
