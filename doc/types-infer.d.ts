import { Node, TextNode } from './types.js';
export type InferBlockNode<T extends Node> = T extends {
    children: readonly (infer N extends Node)[];
} ? T | InferBlockNode<N> : never;
export type InferInlineNode<T extends Node> = T extends {
    children: readonly (infer N extends Node)[];
} ? InferInlineNode<N> : T;
export type InferVoidNode<T extends Node> = Exclude<InferInlineNode<T>, TextNode>;
export type InferTextNode<T extends Node> = Extract<InferInlineNode<T>, TextNode>;
type FlattenAllNodes<T extends Node> = T extends any ? T | (T extends {
    children: readonly (infer N extends Node)[];
} ? FlattenAllNodes<N> : never) : never;
export type ExtractAttrValue<N extends Node, K extends PropertyKey> = FlattenAllNodes<N> extends infer AllNodes extends Node ? AllNodes extends any ? K extends keyof AllNodes ? AllNodes[K] : never : never : never;
export {};
