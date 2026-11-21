import { Editor } from '../../editor.js';
import { DocNode, TextNode } from '../../doc/types.js';
import { InferInlineNode } from '../../doc/types-infer.js';
type HtmlSerializers<T extends DocNode> = Partial<{
    [key in keyof HTMLElementTagNameMap]: (node: HTMLElementTagNameMap[key]) => Exclude<InferInlineNode<T>, TextNode> | void;
}> & {
    text: (t: string) => Extract<InferInlineNode<T>, TextNode>;
};
/**
 * A plugin to handle copying / pasting HTML
 *
 * Under [Trusted Types](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API), pasted HTML is parsed through a policy named `editate`. Allow the name in the `trusted-types` directive, with `'allow-duplicates'` if multiple copies of this library are loaded in a page.
 * Otherwise HTML may not be parsed, and the data is left to the paste hooks registered after this plugin.
 */
export declare function htmlTransferPlugin<T extends DocNode>(editor: Editor<T>, options: {
    serializers: HtmlSerializers<T>;
}): void;
export {};
