import { selectionToRange } from "../dom/index.js";
import type { Editor } from "../editor.js";

/**
 * A plugin to get the bounding rect of selection on selection change
 */
export function selectionRectPlugin(
  editor: Editor,
  onSelectionChange: (getRect: () => DOMRect) => void,
) {
  editor.hook("mount", (element, parser) => {
    let mounted = true;
    let scheduling = false;
    const cleanup = editor.on("selectionchange", () => {
      if (scheduling) return;
      scheduling = true;
      requestAnimationFrame(() => {
        scheduling = false;
        if (!mounted) return;
        onSelectionChange(() =>
          selectionToRange(
            element,
            parser,
            editor.doc,
            editor.selection,
          ).getBoundingClientRect(),
        );
      });
    });
    return () => {
      mounted = false;
      cleanup();
    };
  });
}
