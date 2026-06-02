import type { KeyboardHook } from "./editor.js";

type Modifier = "Ctrl" | "Meta" | "Alt" | "Shift" | "Mod";

// TODO support more keys
type BaseKey =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z"
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | ","
  | "."
  | "/"
  | "["
  | "]"
  | "-"
  | "="
  | "\\"
  | "`"
  | "Enter"
  | "Escape"
  | "Space"
  | "Backspace"
  | "Tab"
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "Delete"
  | "Home"
  | "End"
  | "PageUp"
  | "PageDown"
  | "F1"
  | "F2"
  | "F3"
  | "F4"
  | "F5"
  | "F6"
  | "F7"
  | "F8"
  | "F9"
  | "F10"
  | "F11"
  | "F12";

export type KeyString =
  | BaseKey
  | `${Modifier}+${BaseKey}`
  | `${Modifier}+${Modifier}+${BaseKey}`
  | `${Modifier}+${Modifier}+${Modifier}+${BaseKey}`;

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iP(hone|od|ad)/.test(navigator.platform);

export const keymap = (
  key: KeyString,
  cb: (e: KeyboardEvent) => void,
): KeyboardHook => {
  const isPlusKey = key.endsWith("+");
  const splitted = (isPlusKey ? key.slice(0, -2) : key).split("+");
  const rawTargetKey = isPlusKey ? "+" : splitted.pop()!;
  const targetKey = rawTargetKey === "Space" ? " " : rawTargetKey.toLowerCase();
  let shift = false;
  let ctrl = false;
  let meta = false;
  let alt = false;
  splitted.forEach((k) => {
    switch (k as Modifier) {
      case "Ctrl": {
        ctrl = true;
        break;
      }
      case "Meta": {
        meta = true;
        break;
      }
      case "Mod": {
        if (isMac) {
          meta = true;
        } else {
          ctrl = true;
        }
        break;
      }
      case "Alt": {
        alt = true;
        break;
      }
      case "Shift": {
        shift = true;
        break;
      }
    }
  });

  return (e): boolean | void => {
    // TODO should we handle it e.code?
    if (
      e.key.toLowerCase() === targetKey &&
      ctrl === e.ctrlKey &&
      meta === e.metaKey &&
      shift === e.shiftKey &&
      alt === e.altKey
    ) {
      cb(e);
      return true;
    }
  };
};
