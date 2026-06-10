import { Editor } from '../editor.js';
import { KeyString } from '../keyboard.js';
export declare function keymapPlugin<K extends KeyString>(editor: Editor, bindings: Record<K, () => void>): void;
