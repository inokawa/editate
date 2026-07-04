import { Fragment, Path, Range } from './types.js';
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
declare const OP_PATCH_NODE = "patch_node";
type PatchNodeOperation = Readonly<{
    type: typeof OP_PATCH_NODE;
    path: Path;
    key: string;
    value: unknown;
}>;
export type Operation = DeleteOperation | InsertTextOperation | InsertNodeOperation | FormatOperation | PatchNodeOperation;
export declare const rebase: (position: number, ops: readonly Operation[]) => number;
export {};
