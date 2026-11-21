import { setSelectionToDOM } from "../../dom/index.js";
import type { Editor } from "../../editor.js";

/**
 * A plugin to restore the selection and the scroll position of the editor on focus, except on focus by a click or a tap.
 */
export function restoreSelectionPlugin(editor: Editor) {
  editor.hook("mount", (element, parser) => {
    let isPointing = false;
    let scrollTop = 0;
    let scrollLeft = 0;
    const onMouseDown = () => {
      isPointing = !element.matches(":focus");
    };
    // The scroll event of the reset by focus comes after the focus event
    const onScroll = () => {
      scrollTop = element.scrollTop;
      scrollLeft = element.scrollLeft;
    };
    const onFocus = () => {
      if (!isPointing) {
        setSelectionToDOM(element, parser, editor.doc, editor.selection, true);
        if (!element.scrollTop && !element.scrollLeft) {
          element.scrollTop = scrollTop;
          element.scrollLeft = scrollLeft;
        }
      }
      isPointing = false;
    };
    element.addEventListener("mousedown", onMouseDown, true);
    element.addEventListener("focus", onFocus, true);
    element.addEventListener("scroll", onScroll);
    return () => {
      element.removeEventListener("mousedown", onMouseDown, true);
      element.removeEventListener("focus", onFocus, true);
      element.removeEventListener("scroll", onScroll);
    };
  });
}
