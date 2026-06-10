import { Editor } from '../../editor.js';
import { DocNode, InferInlineNode, TextNode } from '../../doc/types.js';
/**
 * A plugin to handle copying / pasting HTML
 */
export declare function htmlTransferPlugin<T extends DocNode>(editor: Editor<T>, options: {
    serializeText: (t: string) => Extract<InferInlineNode<T>, TextNode>;
    serializers?: ((node: HTMLElement) => Exclude<InferInlineNode<T>, TextNode> | void)[];
}): void;
