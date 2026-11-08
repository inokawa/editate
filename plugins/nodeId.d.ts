import { DocNode, Node } from '../doc/types.js';
import { Editor } from '../editor.js';
/**
 * A plugin to give immutable document nodes stable identifiers suitable for renderer keys.
 *
 * An id belongs to a node object and follows the node across edits.
 * A node recreated by an operation takes over the id of the node it was derived from.
 */
export declare function nodeIdPlugin<T extends DocNode>(editor: Editor<T>): void;
/**
 * Get the stable identifier of the given node, which is assigned on the first call.
 */
export declare function NodeId(editor: Editor, node: Node): string;
