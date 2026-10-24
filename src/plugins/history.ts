import { invertOperation, type Operation } from "../doc/operation.js";
import type { DocNode, Selection } from "../doc/types.js";
import type { Editor } from "../editor.js";
import { keymap } from "../keyboard.js";

const MAX_HISTORY_LENGTH = 100;
const BATCH_HISTORY_TIME = 500;

interface HistoryContext {
  undo: () => void;
  redo: () => void;
  stack: (redo?: boolean) => unknown[];
}

/**
 * @internal
 */
export function historyPlugin<T extends DocNode>(editor: Editor<T>) {
  type History = [selection: Selection, ops: Operation[]];
  let prevTime = 0;

  // keyed by the document the operations led to, since a discarded transaction restores the document it started from
  let recorded = new WeakMap<T, History>();

  const now = Date.now;
  const undos: History[] = [];
  const redos: History[] = [];

  const compose = (
    [selection, ops]: History,
    [, nextOps]: History,
  ): History => [selection, nextOps.concat(ops)];

  const take = (): History | undefined => {
    const entry = recorded.get(editor.doc);
    recorded = new WeakMap();
    return entry;
  };

  const commit = () => {
    let entry = take();
    if (entry) {
      const time = now();
      if (undos.length && time - prevTime < BATCH_HISTORY_TIME) {
        entry = compose(undos.pop()!, entry);
      }
      prevTime = time;
      undos.push(entry);
      redos.length = 0;
      if (undos.length > MAX_HISTORY_LENGTH) {
        undos.shift();
      }
    }
  };

  // applies the last entry of a stack and moves what it recorded to the other one
  const restore = (from: History[], to: History[]) => {
    commit();
    if (from.length) {
      const [selection, ops] = from[from.length - 1]!;
      editor.apply(ops);
      const entry = take();
      if (entry) {
        from.pop();
        to.push(entry);
        editor.selection = selection;
      }
    }
  };

  const undo = () => {
    restore(undos, redos);
  };
  const redo = () => {
    restore(redos, undos);
  };

  editor.hook("apply", (op, next) => {
    const doc = editor.doc;
    const selection = editor.selection;
    const applied = next(op);
    const nextDoc = editor.doc;
    if (applied && doc !== nextDoc) {
      const entry: History = [selection, invertOperation(doc, applied)];
      const prev = recorded.get(doc);
      recorded.set(nextDoc, prev ? compose(prev, entry) : entry);
    }
  });
  editor.on("change", commit);

  editor.hook("keyboard", keymap("Mod+Z", undo));
  editor.hook("keyboard", keymap("Shift+Mod+Z", redo));

  editor.set<HistoryContext>(historyPlugin, {
    undo,
    redo,
    stack: (redo) => {
      commit();
      return redo ? redos : undos;
    },
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
  return !!editor.get<HistoryContext>(historyPlugin).stack().length;
}

/**
 * Check if the history can be redone.
 */
export function Redoable(editor: Editor): boolean {
  return !!editor.get<HistoryContext>(historyPlugin).stack(true).length;
}

/**
 * Clears the history and makes the current document its oldest state.
 */
export function ClearHistory(editor: Editor) {
  const { stack } = editor.get<HistoryContext>(historyPlugin);
  stack().length = 0;
  stack(true).length = 0;
}
