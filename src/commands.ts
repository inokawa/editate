import { toRange } from "./doc/position.js";
import {
  getBlockAt,
  getNodeSize,
  isTextNode,
  sliceFragment,
} from "./doc/edit.js";
import type { Editor } from "./editor.js";
import type {
  DocNode,
  InferBlockNode,
  InferInlineNode,
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
  editor.apply({ type: "delete", range });
}

/**
 * Insert text at the caret or specified position.
 */
export function InsertText(
  editor: Editor,
  text: string,
  position: number = editor.selection[0],
) {
  editor.apply({ type: "insert_text", at: position, text });
}

/**
 * Insert node at the caret or specified position.
 */
export function InsertNode<T extends DocNode>(
  editor: Editor<T>,
  node: Exclude<InferInlineNode<T>, TextNode>,
  position: number = editor.selection[0],
) {
  editor.apply({
    type: "insert_node",
    at: position,
    fragment: [{ children: [node] }],
  });
}

/**
 * Replace text in the selection or specified range.
 */
export function ReplaceText(editor: Editor, text: string) {
  const range = toRange(editor.selection);
  editor
    .apply({ type: "delete", range })
    .apply({ type: "insert_text", at: range[0], text });
}

/**
 * Replace document in the editor.
 */
export function ReplaceDoc<T extends DocNode>(
  editor: Editor<T>,
  fragment: T["children"],
) {
  // TODO revisit
  editor
    .apply({ type: "delete", range: [0, getNodeSize(editor.doc)] })
    .apply({ type: "insert_node", at: 0, fragment });
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
  editor.apply({ type: "set_attr", range, key, value });
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
    editor.apply({
      type: "set_attr",
      range,
      key,
      value: texts.some((n) => !n[key as keyof typeof n]) ? true : false,
    });
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
  offset: number = editor.selection[0],
) {
  const { _path: path } = getBlockAt(editor.doc, offset);
  editor.apply({ type: "set_node_attr", path, key, value });
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
  offset: number = editor.selection[0],
) {
  const { _node: block, _path: path } = getBlockAt(editor.doc, offset);
  editor.apply({
    type: "set_node_attr",
    path,
    key,
    value: (block as N)[key] === onValue ? offValue : onValue,
  });
}
