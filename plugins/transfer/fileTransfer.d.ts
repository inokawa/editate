import { InlineNode } from '../../doc/types.js';
import { Editor } from '../../editor.js';
/**
 * A plugin to handle pasting / dropping from File.
 */
export declare const fileTransferPlugin: (editor: Editor, handlerByMime: Record<string, (file: File) => InlineNode>) => void;
