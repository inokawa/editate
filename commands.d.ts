import { Editor } from './editor.js';
import { DocNode, Range } from './doc/types.js';
import { ExtractAttrValue, InferBlockNode, InferTextNode, InferVoidNode } from './doc/types-infer.js';
/**
 * Delete content in the selection or specified range.
 */
export declare function Delete(editor: Editor, range?: Range): void;
/**
 * Insert text at the caret or specified position.
 */
export declare function InsertText(editor: Editor, text: string, position?: number): void;
/**
 * Insert node at the caret or specified position.
 */
export declare function InsertNode<T extends DocNode>(editor: Editor<T>, node: InferVoidNode<T>, position?: number): void;
/**
 * Replace text in the selection or specified range.
 */
export declare function ReplaceText(editor: Editor, text: string, range?: Range): void;
/**
 * Replace document in the editor.
 */
export declare function ReplaceDoc<T extends DocNode>(editor: Editor<T>, fragment: T["children"]): void;
type ToggleableKey<T> = {
    [K in keyof T]-?: T[K] extends boolean | undefined ? K : never;
}[keyof T];
/**
 * Format content in the selection or specified range.
 */
export declare function Format<T extends DocNode, N extends Omit<InferTextNode<T>, "text">, K extends Extract<keyof N, string>>(editor: Editor<T>, key: K, value: N[K], range?: Range): void;
/**
 * Toggle formatting in the selection or specified range.
 */
export declare function ToggleFormat<T extends DocNode>(editor: Editor<T>, key: Extract<ToggleableKey<Omit<InferTextNode<T>, "text">>, string>, range?: Range): void;
/**
 * Set attr to a block node at the caret or specified position.
 */
export declare function SetBlockAttr<T extends DocNode, N extends InferBlockNode<T>, K extends string>(editor: Editor<T>, key: K, value: ExtractAttrValue<N, K>, offset?: number): void;
/**
 * Toggle attr of block node at the caret or specified position.
 */
export declare function ToggleBlockAttr<T extends DocNode, N extends InferBlockNode<T>, K extends string>(editor: Editor<T>, key: K, onValue: ExtractAttrValue<N, K>, offValue: ExtractAttrValue<N, K>, offset?: number): void;
export {};
