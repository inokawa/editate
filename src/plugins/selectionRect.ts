import { selectionToDomSelection } from "../doc/edit.js";
import { selectionToRange } from "../dom/index.js";
import type { Editor } from "../editor.js";

/**
 * A plugin to get the bounding rect of selection on selection change
 */
export function selectionRectPlugin(
  editor: Editor,
  onSelectionChange: (getRect: () => DOMRectReadOnly) => void,
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
          const range = selectionToRange(
            element,
            parser,
            selectionToDomSelection(editor.doc, selection),
            selection[0] - selection[1],
          );
          return range.getBoundingClientRect();
        });
      });
    });
    return () => {
      mounted = false;
      cleanup();
    };
  });
}
