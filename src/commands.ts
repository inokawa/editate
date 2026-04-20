import { toRange } from "./doc/position.js";
import {
  getBlockSize,
  isTextNode,
  sliceFragment,
  Transaction,
} from "./doc/edit.js";
import type { Editor } from "./editor.js";
import type {
  DocNode,
  InferNode,
  Position,
  PositionRange,
  TextNode,
} from "./doc/types.js";

export type EditorCommand<A extends unknown[], T extends DocNode> = (
  this: Editor<T>,
  ...args: A
) => void;

/**
 * Delete content in the selection or specified range.
 */
export function Delete(
  this: Editor,
  range: PositionRange = toRange(this.selection),
) {
  this.apply(new Transaction().delete(...range));
}

/**
 * Insert text at the caret or specified position.
 */
export function InsertText(
  this: Editor,
  text: string,
  position: Position = this.selection[0],
) {
  this.apply(new Transaction().insertText(position, text));
}

/**
 * Insert node at the caret or specified position.
 */
export function InsertNode<T extends DocNode>(
  this: Editor<T>,
  node: Exclude<InferNode<T>, TextNode>,
  position: Position = this.selection[0],
) {
  this.apply(
    new Transaction().insertFragment(position, [{ children: [node] }]),
  );
}

/**
 * Replace text in the selection or specified range.
 */
export function ReplaceText(this: Editor, text: string) {
  const [start, end] = toRange(this.selection);
  this.apply(new Transaction().delete(start, end).insertText(start, text));
}

/**
 * Replace all content in the editor.
 */
export function ReplaceAll(this: Editor, text: string) {
  const doc = this.doc;
  this.apply(
    new Transaction()
      // TODO improve
      .delete(
        [[], 0],
        [
          [doc.children.length - 1],
          getBlockSize(doc.children[doc.children.length - 1]!),
        ],
      )
      .insertText([[], 0], text),
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
  N extends Omit<InferNode<T>, "text">,
  K extends Extract<keyof N, string>,
>(
  this: Editor<T>,
  key: K,
  value: N[K],
  range: PositionRange = toRange(this.selection),
) {
  this.apply(new Transaction().attr(...range, key, value));
}

/**
 * Toggle formatting in the selection or specified range.
 */
export function ToggleFormat<T extends DocNode>(
  this: Editor<T>,
  key: Extract<ToggleableKey<Omit<InferNode<T>, "text">>, string>,
  range: PositionRange = toRange(this.selection),
) {
  const texts = sliceFragment(this.doc, ...range).flatMap((n) =>
    n.children.filter(isTextNode),
  );
  if (texts.length) {
    this.apply(
      new Transaction().attr(
        ...range,
        key,
        texts.some((n) => !n[key as keyof typeof n]) ? true : false,
      ),
    );
  }
}
