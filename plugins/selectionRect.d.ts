import { Editor } from '../editor.js';
/**
 * A plugin to get the bounding rect of selection on selection change
 */
export declare function selectionRectPlugin(editor: Editor, onSelectionChange: (getRect: () => DOMRect) => void): void;
