import { KeyboardHook } from './editor.js';
type Modifier = "Ctrl" | "Meta" | "Alt" | "Shift" | "Mod";
type BaseKey = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "," | "." | "/" | "[" | "]" | "-" | "=" | "\\" | "`" | "Enter" | "Escape" | "Space" | "Backspace" | "Tab" | "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "Delete" | "Home" | "End" | "PageUp" | "PageDown" | "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" | "F11" | "F12";
export type KeyString = BaseKey | `${Modifier}+${BaseKey}` | `${Modifier}+${Modifier}+${BaseKey}` | `${Modifier}+${Modifier}+${Modifier}+${BaseKey}`;
export declare const keymap: (key: KeyString, cb: (e: KeyboardEvent) => void) => KeyboardHook;
export {};
