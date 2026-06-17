import { StandardSchemaV1 } from '@standard-schema/spec';
import { DocNode, Fragment, Selection } from './doc/types.js';
import { Operation } from './doc/edit.js';
import { Parser } from './dom/parser.js';
type EditorCommandOrPlugin<A extends unknown[], T extends DocNode = DocNode> = (editor: Editor<T>, ...args: A) => void | undefined;
type EditorQuery<A extends unknown[], V, T extends DocNode = DocNode> = (editor: Editor<T>, ...args: A) => V;
/**
 * Options of {@link createEditor}.
 */
export interface EditorOptions<T extends DocNode, S extends StandardSchemaV1<T, T> | void = void> {
    /**
     * Optional [Standard Schema](https://github.com/standard-schema/standard-schema) to validate unsafe edits.
     */
    schema?: S;
    /**
     * Initial document.
     */
    doc: T;
    /**
     * The state editable or not.
     */
    readonly?: boolean;
    /**
     * TODO
     */
    isBlock?: (node: HTMLElement) => boolean;
    /**
     * Callback invoked when errors happen.
     *
     * @default console.warn
     */
    onWarn?: (message: string) => void;
    /**
     * Callback invoked when errors happen.
     *
     * @default `throw new Error(message)`
     */
    onError?: (message: string) => never;
}
export type EditorContext<_> = {};
type EditorEventMap = {
    change: () => void;
    selectionchange: () => void;
    readonly: () => void;
};
/**
 * Functions to handle keyboard events.
 *
 * Return `true` if you want to stop propagation.
 */
export type KeyboardHook = (keyboard: KeyboardEvent) => boolean | void;
/**
 * Functions to handle copy events
 */
export type CopyHook = (dataTransfer: DataTransfer) => void;
/**
 * Functions to handle paste / drop events
 */
export type PasteHook = (dataTransfer: DataTransfer) => string | Fragment | null;
type EditorHookMap = {
    apply: (op: Operation, next: (op?: Operation) => void) => void;
    mount: (element: HTMLElement, parser: Parser) => void | (() => void);
    keyboard: KeyboardHook;
    copy: CopyHook;
    paste: PasteHook;
};
/**
 * The editor instance.
 */
export interface Editor<T extends DocNode = DocNode> {
    readonly doc: T;
    selection: Selection;
    /**
     * The getter/setter for the editor's read-only state.
     * `true` to read-only. `false` to editable.
     */
    readonly: boolean;
    /**
     * Dispatches editing operations.
     * @param op {@link Operation}
     */
    apply(op: Operation | Operation[]): this;
    /**
     * Executes a function with editor bound as context.
     * @param fn {@link EditorCommandOrPlugin} or {@link EditorQuery}
     * @param args arguments of the function
     */
    exec<A extends unknown[]>(fn: EditorCommandOrPlugin<A, T>, ...args: A): this;
    exec<A extends unknown[], V>(fn: EditorQuery<A, V, T>, ...args: A): V;
    /**
     * A function to subscribe editor events.
     * @returns cleanup function
     */
    on<K extends keyof EditorEventMap>(key: K, callback: EditorEventMap[K]): () => void;
    /**
     * A function to register editor hooks.
     * @returns cleanup function
     */
    hook<K extends keyof EditorHookMap>(key: K, callback: EditorHookMap[K]): () => void;
    /**
     * Get a value from the context.
     */
    get<V>(key: EditorContext<V>): V;
    /**
     * Set a value for the context.
     */
    set<V>(key: EditorContext<V>, value: V): this;
    /**
     * A function to make DOM editable.
     * @returns A function to stop subscribing DOM changes and restores previous DOM state.
     */
    input: (element: HTMLElement) => () => void;
}
/**
 * A function to initialize {@link Editor}.
 */
export declare const createEditor: <T extends DocNode, S extends StandardSchemaV1<T, T> | void = void>({ doc, readonly, schema, isBlock, onWarn, onError, }: EditorOptions<T, S>) => Editor<T>;
export {};
