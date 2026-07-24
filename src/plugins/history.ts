import { invertOperation, rebase, type Operation } from "../doc/operation.js";
import type { Selection } from "../doc/types.js";
import type { Editor } from "../editor.js";
import { keymap } from "../keyboard.js";

const MAX_HISTORY_LENGTH = 100;
const BATCH_HISTORY_TIME = 500;

interface HistoryContext {
  undo: () => void;
  redo: () => void;
  undoable: () => boolean;
  redoable: () => boolean;
}

/**
 * @internal
 */
export function historyPlugin(editor: Editor) {
  type History = [Selection, ops: Operation[], invertedOps: Operation[]];
  let index = 0;
  let prevTime = 0;
  let undoOrRedoing = false;
  const now = Date.now;
  const histories: History[] = [[editor.selection, [], []]];

  const isUndoable = (): boolean => {
    return index > 0;
  };

  const isRedoable = (): boolean => {
    return index < histories.length - 1;
  };

  const undo = () => {
    if (isUndoable()) {
      const [selection, , invertedOps] = histories[index]!;
      index--;
      const currentDoc = editor.doc;
      undoOrRedoing = true;
      editor.apply(invertedOps.slice().reverse());
      undoOrRedoing = false;
      if (currentDoc !== editor.doc) {
        editor.selection = selection;
      }
    }
  };
  const redo = () => {
    if (isRedoable()) {
      index++;
      const [selection, ops] = histories[index]!;
      const currentDoc = editor.doc;
      undoOrRedoing = true;
      editor.apply(ops);
      undoOrRedoing = false;
      if (currentDoc !== editor.doc) {
        editor.selection = [
          rebase(selection[0], ops),
          rebase(selection[1], ops),
        ];
      }
    }
  };

  editor.hook("apply", (op, next) => {
    if (undoOrRedoing) return;
    const doc = editor.doc;
    const selection = editor.selection;
    next(op);

    if (doc !== editor.doc) {
      const time = now();
      if (index === 0 || time - prevTime >= BATCH_HISTORY_TIME) {
        index++;
        const history: History = [selection, [], []];
        if (index >= histories.length) {
          histories.push(history);
        } else {
          histories[index] = history;
        }
      }
      prevTime = time;
      histories[index]![1].push(op);
      histories[index]![2].push(...invertOperation(op, doc));
      if (histories.length > index + 1) {
        histories.length = index + 1;
      }
      if (index > MAX_HISTORY_LENGTH) {
        index--;
        histories.shift();
      }
    }
  });

  editor.hook("keyboard", keymap("Mod+Z", undo));
  editor.hook("keyboard", keymap("Shift+Mod+Z", redo));

  editor.set<HistoryContext>(historyPlugin, {
    undo,
    redo,
    undoable: isUndoable,
    redoable: isRedoable,
  });
}

/**
 * Undos the last edit.
 */
export function Undo(editor: Editor) {
  editor.get<HistoryContext>(historyPlugin).undo();
}

/**
 * Redos the last undone edit.
 */
export function Redo(editor: Editor) {
  editor.get<HistoryContext>(historyPlugin).redo();
}

/**
 * Check if the history can be undone.
 */
export function Undoable(editor: Editor): boolean {
  return editor.get<HistoryContext>(historyPlugin).undoable();
}

/**
 * Check if the history can be redone.
 */
export function Redoable(editor: Editor): boolean {
  return editor.get<HistoryContext>(historyPlugin).redoable();
}
