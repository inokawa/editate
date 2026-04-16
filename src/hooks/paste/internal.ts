import { INTERNAL_COPY_KEY } from "../utils.js";
import type { PasteHook } from "./types.js";

/**
 * An extension to handle pasting / dropping from edix editor instance.
 */
export const internalPaste = ({
  key = INTERNAL_COPY_KEY,
}: { key?: string } = {}): PasteHook => {
  return (dataTransfer) => {
    try {
      return JSON.parse(dataTransfer.getData(key));
    } catch (e) {
      return null;
    }
  };
};
