import type { Editor } from "../editor.js";
import {
  hotkey,
  type HotkeyString,
  type KeyboardHook,
} from "../hooks/keyboard.js";
import { keys } from "../utils.js";

export function hotkeyPlugin<K extends HotkeyString>(
  editor: Editor,
  keymap: Record<K, KeyboardHook>,
) {
  keys(keymap).forEach((k) => {
    editor.hook(
      "keyboard",
      hotkey(k as HotkeyString, keymap[k as keyof typeof keymap]!),
    );
  });
}
