import type { Editor } from "../../editor.js";

import {
  getDOMSelection,
  getSelectionRangeInEditor,
  domToFragment,
} from "../../dom/index.js";
import { isCommentNode } from "../../dom/parser.js";
import type { DocNode, InferInlineNode, TextNode } from "../../doc/types.js";
import type { PasteHook } from "../../editor.js";

/**
 * @internal
 */
export const htmlPaste = <T extends DocNode>(
  serializeText: (t: string) => Extract<InferInlineNode<T>, TextNode>,
  serializers: ((
    node: HTMLElement,
  ) => Exclude<InferInlineNode<T>, TextNode> | void)[] = [],
): PasteHook => {
  return (dataTransfer, parse) => {
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
      return domToFragment(dom, parse, serializeText, (n) => {
        for (const s of serializers) {
          const node = s(n as HTMLElement);
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
    serializeText: (t: string) => Extract<InferInlineNode<T>, TextNode>;
    serializers?: ((
      node: HTMLElement,
    ) => Exclude<InferInlineNode<T>, TextNode> | void)[];
  },
) {
  let element: HTMLElement | null = null;
  editor.hook("mount", (e) => {
    element = e;
    return () => {
      element = null;
    };
  });
  editor.hook("copy", (dataTransfer) => {
    if (!element) return;
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
  editor.hook("paste", htmlPaste(options.serializeText, options.serializers));
}
