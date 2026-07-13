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
    let queued = false;
    const cleanup = editor.on("selectionchange", () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        if (!mounted) return;
        onSelectionChange(() => {
          const selection = editor.selection;
          return selectionToRange(
            element,
            parser,
            editor.doc,
            selection,
          ).getBoundingClientRect();
        });
      });
    });
    return () => {
      mounted = false;
      cleanup();
    };
  });
}
