import { InferInlineNode } from './doc/types-infer.js';
import { DocNode, Range } from './doc/types.js';
import { Editor } from './editor.js';
/**
 * TODO
 */
export declare function LeafsInRange<T extends DocNode>(editor: Editor<T>, range?: Range): Generator<InferInlineNode<T>, void, void>;
