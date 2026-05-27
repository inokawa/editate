import type { DocNode, InferInlineNode, InlineNode } from "../../doc/types.js";
import { docToString } from "../../doc/utils.js";
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
  editor.hook("copy", (dataTransfer, data) => {
    dataTransfer.setData(
      "text/plain",
      docToString(
        { children: data },
        serializer as ((node: InlineNode) => string) | undefined,
      ),
    );
  });
  editor.hook("paste", (dataTransfer) => {
    return dataTransfer.getData("text/plain");
  });
}
