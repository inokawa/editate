import { DocNode, Node, TextNode } from './types.js';
type Flatten<T> = T extends any ? T : never;
type InferBlock<T> = T extends {
    children: readonly (infer N)[];
} ? T & InferBlock<N> : T;
export type InferBlockNode<T extends DocNode> = InferBlock<T>;
export type InferInlineNode<T extends Node> = Flatten<T extends {
    children: readonly (infer N extends Node)[];
} ? InferInlineNode<N> : T>;
export type InferVoidNode<T extends DocNode> = Exclude<InferInlineNode<T>, TextNode>;
export type InferTextNode<T extends DocNode> = Extract<InferInlineNode<T>, TextNode>;
export {};
