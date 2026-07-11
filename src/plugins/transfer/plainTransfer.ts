import { sliceFragment } from "../../doc/node.js";
import { toRange } from "../../doc/position.js";
import type { InferInlineNode } from "../../doc/types-infer.js";
import type { DocNode, InlineNode } from "../../doc/types.js";
import { docToString } from "../../doc/node.js";
import type { Editor } from "../../editor.js";

/**
 * A plugin to handle copying / pasting plain text.
 */
export function plainTransferPlugin<T extends DocNode>(
  editor: Editor<T>,
  options?: {
    serializer?: (node: InferInlineNode<T>) => string;
  },
) {
  const serializer = options && options.serializer;
  editor.hook("copy", (dataTransfer) => {
    dataTransfer.setData(
      "text/plain",
      docToString(
        { children: sliceFragment(editor.doc, ...toRange(editor.selection)) },
        serializer as ((node: InlineNode) => string) | undefined,
      ),
    );
  });
  editor.hook("paste", (dataTransfer) => {
    return dataTransfer.getData("text/plain");
  });
}
