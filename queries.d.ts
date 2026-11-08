import { InferInlineNode, InferLeafBlockNode } from './doc/types-infer.js';
import { DocNode, Range } from './doc/types.js';
import { Editor } from './editor.js';
/**
 * Get leaf nodes that intersect with the selection or specified range. An empty leaf is included wherever the range reaches it.
 */
export declare function LeavesInRange<T extends DocNode>(editor: Editor<T>, range?: Range): Generator<InferInlineNode<T>, void, void>;
/**
 * Get leaf block nodes that intersect with the selection or specified range, with their offsets. An empty block is included wherever the range reaches it.
 */
export declare function BlocksInRange<T extends DocNode>(editor: Editor<T>, range?: Range): Generator<[
    node: InferLeafBlockNode<T>,
    offset: number,
    range: Range
], void, void>;
