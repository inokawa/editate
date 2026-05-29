import { sliceFragment } from "../../doc/edit.js";
import { toRange } from "../../doc/position.js";
import type { Editor } from "../../editor.js";

const INTERNAL_COPY_KEY = "application/x-editate-editor";

/**
 * A plugin to handle copying / pasting between editor instances
 */
export function internalTranferPlugin(editor: Editor) {
  editor.hook("copy", (dataTransfer) => {
    dataTransfer.setData(
      INTERNAL_COPY_KEY,
      JSON.stringify(sliceFragment(editor.doc, ...toRange(editor.selection))),
    );
  });
  editor.hook("paste", (dataTransfer) => {
    try {
      return JSON.parse(dataTransfer.getData(INTERNAL_COPY_KEY));
    } catch (e) {
      return null;
    }
  });
}
