import type { Editor } from "../editor.js";
import {
  keymap,
  type KeyString,
  type KeyboardHook,
} from "../hooks/keyboard.js";
import { keys } from "../utils.js";

export function keymapPlugin<K extends KeyString>(
  editor: Editor,
  bindings: Record<K, KeyboardHook>,
) {
  keys(bindings).forEach((k) => {
    editor.hook(
      "keyboard",
      keymap(k as KeyString, bindings[k as keyof typeof bindings]!),
    );
  });
}
