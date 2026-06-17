import type { Editor } from "../../editor.js";

import {
  getDOMSelection,
  getSelectionRangeInEditor,
  domToFragment,
} from "../../dom/index.js";
import { isCommentNode } from "../../dom/utils.js";
import type { DocNode, InferInlineNode, TextNode } from "../../doc/types.js";
import type { PasteHook } from "../../editor.js";
import type { Parser } from "../../dom/parser.js";

type HtmlSerializers<T extends DocNode> = Partial<{
  [key in keyof HTMLElementTagNameMap]: (
    node: HTMLElementTagNameMap[key],
  ) => Exclude<InferInlineNode<T>, TextNode> | void;
}> & {
  text: (t: string) => Extract<InferInlineNode<T>, TextNode>;
};

/**
 * @internal
 */
export const htmlPaste = <T extends DocNode>(
  parse: Parser,
  serializers: HtmlSerializers<T>,
): PasteHook => {
  return (dataTransfer) => {
    const html = dataTransfer.getData("text/html");
    if (html) {
      let dom: Node = new DOMParser().parseFromString(html, "text/html").body;
      let isWindowsCopy = false;
      // https://github.com/w3c/clipboard-apis/issues/193
      for (const n of [...dom.childNodes]) {
        if (isCommentNode(n)) {
          if (n.data === "StartFragment") {
            isWindowsCopy = true;
            dom = new DocumentFragment();
          } else if (n.data === "EndFragment") {
            isWindowsCopy = false;
          }
        } else if (isWindowsCopy) {
          dom.appendChild(n);
        }
      }

      // TODO customizable dom to standard schema and validate
      return domToFragment(dom, parse, serializers["text"], (n) => {
        const s =
          serializers[n.tagName.toLowerCase() as keyof typeof serializers];
        if (s) {
          const node = s(n as any);
          if (node) {
            return node;
          }
        }

        return;
      });
    }
    return null;
  };
};

/**
 * A plugin to handle copying / pasting HTML
 */
export function htmlTransferPlugin<T extends DocNode>(
  editor: Editor<T>,
  options: {
    serializers: HtmlSerializers<T>;
  },
) {
  editor.hook("mount", (element, parser) => {
    const cleanupCopy = editor.hook("copy", (dataTransfer) => {
      const wrapper = document.createElement("div");
      wrapper.appendChild(
        // DOM range must exist here
        getSelectionRangeInEditor(
          getDOMSelection(element),
          element,
        )!.cloneContents(),
      );
      dataTransfer.setData("text/html", wrapper.innerHTML);
    });
    const cleanupPaste = editor.hook(
      "paste",
      htmlPaste(parser, options.serializers),
    );
    return () => {
      cleanupCopy();
      cleanupPaste();
    };
  });
}
