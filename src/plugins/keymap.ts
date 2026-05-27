import type { Editor } from "../editor.js";
import { keymap, type KeyString } from "../keyboard.js";
import { keys } from "../utils.js";

export function keymapPlugin<K extends KeyString>(
  editor: Editor,
  bindings: Record<K, () => void>,
) {
  keys(bindings).forEach((k) => {
    const fn = bindings[k as keyof typeof bindings]!;
    editor.hook(
      "keyboard",
      keymap(k as KeyString, () => {
        fn();
      }),
    );
  });
}
