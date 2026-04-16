import { joinBlocks } from "../doc/edit.js";
import type { Editor } from "../editor.js";

export function singlelinePlugin(this: Editor) {
  this.hook("mount", (element) => {
    element.ariaMultiLine = null;
  });
  this.hook("apply", (op, next) => {
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
