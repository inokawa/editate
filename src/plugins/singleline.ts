import { joinBlocks } from "../doc/operation.js";
import type { Editor } from "../editor.js";

/**
 * A plugin to restrict input to a single line
 */
export function singlelinePlugin(editor: Editor) {
  editor.hook("mount", (element) => {
    element.ariaMultiLine = null;
  });
  editor.hook("apply", (op, next) => {
    if (op.type === "insert_text") {
      op = {
        ...op,
        text: op.text.replaceAll("\n", ""),
      };
    } else if (op.type === "insert_node") {
      op = {
        ...op,
        fragment: [joinBlocks(...op.fragment)],
      };
    }
    next(op);
  });
}
