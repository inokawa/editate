import { Editor } from '../../editor.js';
import { DocNode, InferInlineNode, TextNode } from '../../doc/types.js';
type HtmlSerializers<T extends DocNode> = Partial<{
    [key in keyof HTMLElementTagNameMap]: (node: HTMLElementTagNameMap[key]) => Exclude<InferInlineNode<T>, TextNode> | void;
}> & {
    text: (t: string) => Extract<InferInlineNode<T>, TextNode>;
};
/**
 * A plugin to handle copying / pasting HTML
 */
export declare function htmlTransferPlugin<T extends DocNode>(editor: Editor<T>, options: {
    serializers: HtmlSerializers<T>;
}): void;
export {};
