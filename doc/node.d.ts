import { BlockNode, DocNode, Node, DomPosition } from './types.js';
export declare const getNodeSize: (node: Node) => number;
export declare const offsetToPosition: (node: DocNode | BlockNode, offset: number) => DomPosition;
