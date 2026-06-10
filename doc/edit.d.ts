import { DocNode, Fragment, Path, BlockNode, Node, DomPosition, Range } from './types.js';
declare const OP_DELETE = "delete";
type DeleteOperation = Readonly<{
    type: typeof OP_DELETE;
    range: Range;
}>;
declare const OP_INSERT_TEXT = "insert_text";
type InsertTextOperation = Readonly<{
    type: typeof OP_INSERT_TEXT;
    at: number;
    text: string;
}>;
declare const OP_INSERT_NODE = "insert_node";
type InsertNodeOperation = Readonly<{
    type: typeof OP_INSERT_NODE;
    at: number;
    fragment: Fragment;
}>;
declare const OP_FORMAT = "format";
type FormatOperation = Readonly<{
    type: typeof OP_FORMAT;
    range: Range;
    key: string;
    value: unknown;
}>;
declare const OP_SET_NODE_ATTR = "set_node_attr";
type SetNodeAttrOperation = Readonly<{
    type: typeof OP_SET_NODE_ATTR;
    path: Path;
    key: string;
    value: unknown;
}>;
export type Operation = DeleteOperation | InsertTextOperation | InsertNodeOperation | FormatOperation | SetNodeAttrOperation;
export declare const getNodeSize: (node: Node) => number;
export declare const offsetToPosition: (node: DocNode | BlockNode, offset: number) => DomPosition;
export declare const rebase: (position: number, ops: readonly Operation[]) => number;
export {};
