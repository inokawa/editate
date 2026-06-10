import { Editor } from '../editor.js';
/**
 * Undos the last edit.
 */
export declare function Undo(editor: Editor): void;
/**
 * Redos the last undone edit.
 */
export declare function Redo(editor: Editor): void;
/**
 * Check if the history can be undone.
 */
export declare function Undoable(editor: Editor): boolean;
/**
 * Check if the history can be redone.
 */
export declare function Redoable(editor: Editor): boolean;
