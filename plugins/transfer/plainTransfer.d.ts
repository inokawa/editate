import { DocNode, InferInlineNode } from '../../doc/types.js';
import { Editor } from '../../editor.js';
/**
 * A plugin to handle copying / pasting plain text.
 */
export declare function plainTransferPlugin<T extends DocNode>(editor: Editor<T>, options?: {
    serializer?: (node: InferInlineNode<T>) => string;
}): void;
