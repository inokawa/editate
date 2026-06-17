import type { Editor } from "../../editor.js";

import {
  getDOMSelection,
  getSelectionRangeInEditor,
  TOKEN_BLOCK,
  TOKEN_TEXT,
  TOKEN_SOFT_BREAK,
  TOKEN_VOID,
} from "../../dom/index.js";
import { isCommentNode } from "../../dom/utils.js";
import type {
  BlockNode,
  DocNode,
  Fragment,
  InferInlineNode,
  InlineNode,
  TextNode,
} from "../../doc/types.js";
import type { Parser, TokenType } from "../../dom/parser.js";

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
  html: string,
  parse: Parser,
  serializers: HtmlSerializers<T>,
): Fragment => {
  const serializeText = serializers["text"];
  const serializeVoid = (n: Element) => {
    const s = serializers[n.tagName.toLowerCase() as keyof typeof serializers];
    if (s) {
      const node = s(n as any);
      if (node) {
        return node;
      }
    }

    return;
  };

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

  return parse(({ _next: next, _domNode: domNode }) => {
    let type: TokenType | void;
    let row: InlineNode[] | null = null;
    let text = "";
    let hasContent = false;

    const rows: BlockNode[] = [];

    const completeText = () => {
      if (text) {
        if (!row) {
          row = [];
        }
        row.push(serializeText(text));
        text = "";
      }
    };
    const completeRow = () => {
      completeText();
      if (!row && hasContent) {
        row = [];
      }
      if (row) {
        rows.push({ children: row });
      }
      row = null;
      hasContent = false;
    };

    while ((type = next())) {
      if (type === TOKEN_BLOCK) {
        completeRow();
      } else {
        hasContent = true;

        if (type === TOKEN_TEXT) {
          text += domNode<typeof type>().data;
        } else if (type === TOKEN_VOID) {
          completeText();
          const docNode = serializeVoid(domNode<typeof type>());
          if (docNode) {
            row!.push(docNode);
          }
        } else if (type === TOKEN_SOFT_BREAK) {
          completeRow();
        }
      }
    }
    completeRow();

    if (!rows.length) {
      rows.push({ children: [] });
    }

    return rows;
  }, dom);
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
    const cleanupPaste = editor.hook("paste", (dataTransfer) => {
      const html = dataTransfer.getData("text/html");
      if (html) {
        return htmlPaste(html, parser, options.serializers);
      }
      return null;
    });
    return () => {
      cleanupCopy();
      cleanupPaste();
    };
  });
}
