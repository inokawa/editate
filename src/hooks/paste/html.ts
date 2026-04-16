import type { DocNode, InferNode, TextNode } from "../../doc/types.js";
import { domToFragment } from "../../dom/index.js";
import { isCommentNode } from "../../dom/parser.js";
import type { PasteHook } from "./types.js";

/**
 * An extension to handle pasting / dropping from HTML.
 */
export const htmlPaste = <T extends DocNode>(
  serializeText: (t: string) => Extract<InferNode<T>, TextNode>,
  serializers: ((
    node: HTMLElement,
  ) => Exclude<InferNode<T>, TextNode> | void)[] = [],
): PasteHook => {
  return (dataTransfer, config) => {
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
      return domToFragment(dom, config, serializeText, (n) => {
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
