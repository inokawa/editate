export interface TextNode {
  readonly text: string;
}

export interface VoidNode {}

export type InlineNode = TextNode | VoidNode;

export interface BlockNode {
  readonly children: readonly InlineNode[];
}

export type Node = BlockNode | InlineNode;

export interface DocNode {
  readonly children: readonly BlockNode[];
}

export type Fragment = DocNode["children"];

type InferChild<T> = T extends { children: readonly (infer N)[] }
  ? InferChild<N>
  : T;
type InferBlock<T> = T extends { children: readonly (infer N)[] }
  ? T & InferBlock<N>
  : T;
export type InferInlineNode<T extends DocNode> = InferChild<T>;
export type InferBlockNode<T extends DocNode> = InferBlock<T>;

export type Path = readonly [number?];
export type Position = readonly [path: Path, offset: number];
export type PositionRange = readonly [start: Position, end: Position];

export type SelectionSnapshot = readonly [anchor: Position, focus: Position];
