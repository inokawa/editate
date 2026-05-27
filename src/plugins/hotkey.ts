import type { Editor } from "../editor.js";
import { hotkey, type KeyboardHook } from "../hooks/keyboard.js";
import { keys } from "../utils.js";

export function hotkeyPlugin(
  editor: Editor,
  keymap: Record<string, [KeyboardHook, Parameters<typeof hotkey>[2]?]>,
) {
  keys(keymap).forEach((k) => {
    editor.hook("keyboard", hotkey(k, ...keymap[k]!));
  });
}
