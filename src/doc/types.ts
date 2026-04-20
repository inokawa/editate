export interface TextNode {
  readonly text: string;
}

export interface VoidNode {}

export type InlineNode = TextNode | VoidNode;

export interface BlockNode {
  readonly children: readonly InlineNode[];
}

export interface DocNode {
  readonly children: readonly BlockNode[];
}
export type Fragment = DocNode["children"];

type InferChild<T> = T extends { children: readonly (infer N)[] }
  ? InferChild<N>
  : T;
export type InferNode<T extends DocNode> = InferChild<T>;

export type Path = readonly [number?];
export type Position = readonly [path: Path, offset: number];
export type PositionRange = readonly [start: Position, end: Position];

export type SelectionSnapshot = readonly [anchor: Position, focus: Position];
