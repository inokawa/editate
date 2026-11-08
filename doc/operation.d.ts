import { Fragment, Range } from './types.js';
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
    /** Must not be `text`, nor `children` unless the depth is 0. */
    key: string;
    /** Omit or pass undefined to remove the attr. */
    value?: unknown;
    /** Depth of nodes to update like array.at() on the path from the root to each leaf in the range: -1 (default) is the leaf, -2 its block and 0 the root. */
    depth?: number;
}>;
export type Operation = DeleteOperation | InsertTextOperation | InsertNodeOperation | FormatOperation;
/**
 * Remap a position through the given operation.
 * @param stickBefore `true` to keep the position in place when content is inserted at it, instead of moving it after the inserted content.
 */
export declare const mapPosition: (position: number, op: Operation, stickBefore?: boolean) => number;
export {};
