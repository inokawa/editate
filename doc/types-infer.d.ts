import { BlockNode, Node, TextNode } from './types.js';
type Parent = {
    children: readonly Node[];
};
type Same<A, B> = (<G>() => G extends A ? 1 : 2) extends <G>() => G extends B ? 1 : 2 ? true : false;
type Unseen<T, S> = T extends Parent ? true extends (S extends any ? Same<T, S> : never) ? never : T : never;
type Blocks<T, S> = Unseen<T, S> extends infer B extends Parent ? [B] extends [never] ? S : Blocks<B["children"][number], S | B> : never;
type LeafBlocks<B> = B extends Parent ? [Exclude<B["children"][number], BlockNode>] extends [never] ? never : B : never;
export type InferBlockNode<T extends Node> = T extends Parent ? Blocks<T["children"][number], T> : never;
export type InferLeafBlockNode<T extends Node> = T extends Parent ? LeafBlocks<InferBlockNode<T>> : never;
export type InferInlineNode<T extends Node> = T extends Parent ? Exclude<InferBlockNode<T>["children"][number], Parent> : T;
export type InferVoidNode<T extends Node> = Exclude<InferInlineNode<T>, TextNode>;
export type InferTextNode<T extends Node> = Extract<InferInlineNode<T>, TextNode>;
export type ExtractAttrValue<N extends Node, K extends PropertyKey> = N extends any ? K extends keyof N ? N[K] : BlockNode extends N ? any : never : never;
export {};
