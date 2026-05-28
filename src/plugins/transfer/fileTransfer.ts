import type { InlineNode } from "../../doc/types.js";
import type { Editor } from "../../editor.js";

/**
 * A plugin to handle pasting / dropping from File.
 */
export const fileTransferPlugin = (
  editor: Editor,
  handlerByMime: Record<string, (file: File) => InlineNode>,
) => {
  editor.hook("paste", (dataTransfer) => {
    for (const item of dataTransfer.items) {
      if (item.kind === "file") {
        const mapper = handlerByMime[item.type];
        if (mapper) {
          const file = item.getAsFile();
          if (file) {
            return [{ children: [mapper(file)] }];
          }
        }
      }
    }
    return null;
  });
};
