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
  readonly children: readonly BlockNode[] | readonly InlineNode[];
}

// TODO improve type
export type Fragment = DocNode["children"];

export type Path = readonly number[];
export type Range = readonly [start: number, end: number];
export type Selection = readonly [anchor: number, focus: number];

export type DomPosition = readonly [path: Path, offset: number];
export type DomSelection = readonly [anchor: DomPosition, focus: DomPosition];
