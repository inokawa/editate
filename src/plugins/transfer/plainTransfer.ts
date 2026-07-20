import { sliceText } from "../../doc/node.js";
import { toRange } from "../../doc/position.js";
import type { InferVoidNode } from "../../doc/types-infer.js";
import type { DocNode } from "../../doc/types.js";
import type { Editor } from "../../editor.js";

/**
 * A plugin to handle copying / pasting plain text.
 */
export function plainTransferPlugin<T extends DocNode>(
  editor: Editor<T>,
  options?: {
    voidToString?: (node: InferVoidNode<T>) => string;
  },
) {
  const voidToString = options && options.voidToString;
  editor.hook("copy", (dataTransfer) => {
    dataTransfer.setData(
      "text/plain",
      sliceText(editor.doc, ...toRange(editor.selection), voidToString),
    );
  });
  editor.hook("paste", (dataTransfer) => {
    return dataTransfer.getData("text/plain");
  });
}
