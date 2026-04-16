import type { PasteHook } from "./types.js";

/**
 * An extension to handle pasting / dropping from plain text.
 */
export const plainPaste = (): PasteHook => {
  return (dataTransfer) => {
    return dataTransfer.getData("text/plain");
  };
};
