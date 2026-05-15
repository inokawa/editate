import { ReplaceDoc } from "../commands.js";
import { rebaseSelection, type Operation } from "../doc/edit.js";
import type { DocNode, SelectionSnapshot } from "../doc/types.js";
import type { Editor } from "../editor.js";
import { hotkey } from "../hooks/keyboard.js";
import { is } from "../utils.js";

const MAX_HISTORY_LENGTH = 500;
const BATCH_HISTORY_TIME = 500;

/**
 * @internal
 */
export function historyPlugin<T extends DocNode>(this: Editor<T>) {
  type History = [T, SelectionSnapshot, Operation[]];
  let index = 0;
  let prevTime = 0;
  let undoOrRedoing = false;
  const editor = this;
  const now = Date.now;
  const histories: History[] = [[editor.doc, editor.selection, []]];

  const get = () => histories[index]!;

  const isUndoable = (): boolean => {
    return index > 0;
  };

  const isRedoable = (): boolean => {
    return index < histories.length - 1;
  };

  const undo = () => {
    if (isUndoable()) {
      const sel = get()[1];
      index--;
      const doc = get()[0];
      undoOrRedoing = true;
      editor.apply(ReplaceDoc, doc.children);
      undoOrRedoing = false;
      if (!is(doc, editor.doc)) {
        editor.selection = sel;
      }
    }
  };
  const redo = () => {
    if (isRedoable()) {
      index++;
      const doc = get()[0];
      const sel = get()[1];
      const ops = get()[2];
      undoOrRedoing = true;
      editor.apply(ReplaceDoc, doc.children);
      undoOrRedoing = false;
      if (!is(doc, editor.doc)) {
        editor.selection = ops.reduce(
          (acc, op) => rebaseSelection(acc, op),
          sel,
        );
      }
    }
  };

  editor.hook("apply", (op, next) => {
    if (undoOrRedoing) return;
    const doc = editor.doc;
    const selection = editor.selection;
    next(op);
    const newDoc = editor.doc;

    if (!is(doc, newDoc)) {
      const time = now();
      if (index === 0 || time - prevTime >= BATCH_HISTORY_TIME) {
        index++;
        const history: History = [doc, selection, []];
        if (index >= histories.length) {
          histories.push(history);
        } else {
          histories[index] = history;
        }
      }
      prevTime = time;
      histories[index]![0] = newDoc;
      histories[index]![2].push(op);
      histories.splice(index + 1);
      if (index > MAX_HISTORY_LENGTH) {
        index--;
        histories.shift();
      }
    }
  });

  editor.hook("keyboard", hotkey("z", undo, { mod: true }));
  editor.hook("keyboard", hotkey("z", redo, { mod: true, shift: true }));
}
