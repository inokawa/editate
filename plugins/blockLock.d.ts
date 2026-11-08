import { InferLeafBlockNode } from '../doc/types-infer.js';
import { DocNode, Range } from '../doc/types.js';
import { Editor } from '../editor.js';
/**
 * A plugin to make specific blocks read-only.
 *
 * Locked blocks can still be selected and copied, but operations editing them are cancelled with their transaction, except ones that unlock the block.
 */
export declare function blockLockPlugin<T extends DocNode>(editor: Editor<T>, options: {
    /**
     * A function to check if the block is locked or not.
     */
    isLocked: (node: InferLeafBlockNode<T>) => boolean;
}): void;
/**
 * Check if the selection or specified range touches a locked block, which means editing operations on it will be cancelled.
 */
export declare function LockedInRange(editor: Editor, range?: Range): boolean;
