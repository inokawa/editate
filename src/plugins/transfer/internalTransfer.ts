import type { Editor } from "../../editor.js";

const INTERNAL_COPY_KEY = "application/x-editate-editor";

/**
 * A plugin to handle copying / pasting between editor instances
 */
export function internalTranferPlugin(editor: Editor) {
  editor.hook("copy", (dataTransfer, data) => {
    dataTransfer.setData(INTERNAL_COPY_KEY, JSON.stringify(data));
  });
  editor.hook("paste", (dataTransfer) => {
    try {
      return JSON.parse(dataTransfer.getData(INTERNAL_COPY_KEY));
    } catch (e) {
      return null;
    }
  });
}
