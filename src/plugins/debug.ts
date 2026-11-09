import type { Operation } from "../doc/operation.js";
import type { Editor } from "../editor.js";

export function debugPlugin(editor: Editor) {
  // keyed by the document the operations led to, since a discarded transaction restores the document it started from
  let applied = new WeakMap<Editor["doc"], Operation[]>();

  editor.hook("apply", (op, next) => {
    const doc = editor.doc;
    const o = next(op);
    if (o && doc !== editor.doc) {
      applied.set(editor.doc, (applied.get(doc) || []).concat(o));
    }
  });
  editor.on("change", () => {
    console.log("apply", applied.get(editor.doc));
    applied = new WeakMap();
    console.log("change", editor.doc);
  });
  editor.on("selectionchange", () => {
    console.log("selectionchange", editor.selection);
  });
}
