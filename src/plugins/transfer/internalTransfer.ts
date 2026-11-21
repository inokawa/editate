import { sliceFragment } from "../../doc/node.js";
import { toRange } from "../../doc/position.js";
import type { Editor } from "../../editor.js";

/**
 * A plugin to handle copying / pasting between editor instances
 *
 * Any website can write data of `options.mime` type to the clipboard, and it's pasted as is, so validate it with {@link EditorOptions.schema}.
 *
 * @param options.mime A MIME type to store the copied fragment in clipboard. Give an app specific one if the schema is not shared with other editate based apps.
 * @defaultValue `"application/x-editate-editor"`
 */
export function internalTransferPlugin(
  editor: Editor,
  options?: {
    mime?: string;
  },
) {
  const mime = (options && options.mime) || "application/x-editate-editor";
  editor.hook("copy", (dataTransfer) => {
    dataTransfer.setData(
      mime,
      JSON.stringify(sliceFragment(editor.doc, ...toRange(editor.selection))),
    );
  });
  editor.hook("paste", (dataTransfer) => {
    try {
      return JSON.parse(dataTransfer.getData(mime));
    } catch (e) {
      return null;
    }
  });
}
