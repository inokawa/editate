import { InferVoidNode } from '../../doc/types-infer.js';
import { DocNode } from '../../doc/types.js';
import { Editor } from '../../editor.js';
/**
 * A plugin to handle copying / pasting plain text.
 */
export declare function plainTransferPlugin<T extends DocNode>(editor: Editor<T>, options?: {
    voidToString?: (node: InferVoidNode<T>) => string;
}): void;
