import { getDOMSelection, getSelectionRangeInEditor } from "../../dom/index.js";
import type { CopyHook } from "./types.js";

/**
 * An extension to handle copying to HTML.
 */
export const htmlCopy = (): CopyHook => {
  return (dataTransfer, _, element) => {
    const wrapper = document.createElement("div");
    wrapper.appendChild(
      // DOM range must exist here
      getSelectionRangeInEditor(
        getDOMSelection(element),
        element,
      )!.cloneContents(),
    );
    dataTransfer.setData("text/html", wrapper.innerHTML);
  };
};
