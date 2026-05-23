import { toRange } from "./doc/position.js";
import {
  getNodeAt,
  getNodeSize,
  isTextNode,
  offsetToPosition,
  sliceFragment,
  Transaction,
} from "./doc/edit.js";
import type { Editor } from "./editor.js";
import type {
  DocNode,
  InferBlockNode,
  InferInlineNode,
  Path,
  Range,
  TextNode,
} from "./doc/types.js";

/**
 * Delete content in the selection or specified range.
 */
export function Delete(
  editor: Editor,
  range: Range = toRange(editor.selection),
) {
  editor.apply(new Transaction().delete(...range));
}

/**
 * Insert text at the caret or specified position.
 */
export function InsertText(
  editor: Editor,
  text: string,
  position: number = editor.selection[0],
) {
  editor.apply(new Transaction().insertText(position, text));
}

/**
 * Insert node at the caret or specified position.
 */
export function InsertNode<T extends DocNode>(
  editor: Editor<T>,
  node: Exclude<InferInlineNode<T>, TextNode>,
  position: number = editor.selection[0],
) {
  editor.apply(
    new Transaction().insertFragment(position, [{ children: [node] }]),
  );
}

/**
 * Replace text in the selection or specified range.
 */
export function ReplaceText(editor: Editor, text: string) {
  const [start, end] = toRange(editor.selection);
  editor.apply(new Transaction().delete(start, end).insertText(start, text));
}

/**
 * Replace document in the editor.
 */
export function ReplaceDoc<T extends DocNode>(
  editor: Editor<T>,
  fragment: T["children"],
) {
  // TODO revisit
  editor.apply(
    new Transaction()
      .delete(0, getNodeSize(editor.doc))
      .insertFragment(0, fragment),
  );
}

type ToggleableKey<T> = {
  [K in keyof T]-?: T[K] extends boolean | undefined ? K : never;
}[keyof T];

/**
 * Format content in the selection or specified range.
 */
export function Format<
  T extends DocNode,
  N extends Omit<InferInlineNode<T>, "text">,
  K extends Extract<keyof N, string>,
>(
  editor: Editor<T>,
  key: K,
  value: N[K],
  range: Range = toRange(editor.selection),
) {
  editor.apply(new Transaction().format(...range, key, value));
}

/**
 * Toggle formatting in the selection or specified range.
 */
export function ToggleFormat<T extends DocNode>(
  editor: Editor<T>,
  key: Extract<ToggleableKey<Omit<InferInlineNode<T>, "text">>, string>,
  range: Range = toRange(editor.selection),
) {
  const texts = sliceFragment(editor.doc, ...range).flatMap((n) =>
    n.children.filter(isTextNode),
  );
  if (texts.length) {
    editor.apply(
      new Transaction().format(
        ...range,
        key,
        texts.some((n) => !n[key as keyof typeof n]) ? true : false,
      ),
    );
  }
}

/**
 * Set attr to a block node at the caret or specified position.
 */
export function SetBlockAttr<
  T extends DocNode,
  N extends InferBlockNode<T>,
  K extends Extract<keyof N, string>,
>(
  editor: Editor<T>,
  key: K,
  value: N[K],
  path: Path = offsetToPosition(editor.doc, editor.selection[0])[0],
) {
  editor.apply(new Transaction().attr(path, key, value));
}

/**
 * Toggle attr of block node at the caret or specified position.
 */
export function ToggleBlockAttr<
  T extends DocNode,
  N extends InferBlockNode<T>,
  K extends Extract<keyof N, string>,
>(
  editor: Editor<T>,
  key: K,
  onValue: N[K],
  offValue: N[K],
  path: Path = offsetToPosition(editor.doc, editor.selection[0])[0],
) {
  const block = getNodeAt(editor.doc, path) as N;
  editor.apply(
    new Transaction().attr(
      path,
      key,
      block[key] === onValue ? offValue : onValue,
    ),
  );
}
