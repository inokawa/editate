import type { Editor } from "../editor.js";

export function debugPlugin(this: Editor) {
  const editor = this;
  editor.hook("apply", (op) => {
    console.log("apply", op);
  });
  editor.on("change", () => {
    console.log("change", editor.doc);
  });
  editor.on("selectionchange", () => {
    console.log("selectionchange", editor.selection);
  });
}
