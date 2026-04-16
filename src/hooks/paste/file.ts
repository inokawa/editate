import type { InlineNode } from "../../doc/types.js";
import type { PasteHook } from "./types.js";

/**
 * An extension to handle pasting / dropping from File.
 */
export const filePaste = (
  handlerByMime: Record<string, (file: File) => InlineNode>,
): PasteHook => {
  return (dataTransfer) => {
    for (const item of dataTransfer.items) {
      if (item.kind === "file") {
        const mapper = handlerByMime[item.type];
        if (mapper) {
          const file = item.getAsFile();
          if (file) {
            return [[mapper(file)]];
          }
        }
      }
    }
    return null;
  };
};
