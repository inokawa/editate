import { invertOperation, type Operation, Transaction } from "./doc/edit.js";
import type { SelectionSnapshot } from "./doc/types.js";
import type { Editor } from "./editor.js";
import type { EditorPlugin } from "./plugins/types.js";
import { is, microtask } from "./utils.js";

const MAX_HISTORY_LENGTH = 100;
const BATCH_HISTORY_TIME = 500;

const getOperationSelection = (op: Operation): SelectionSnapshot => {
  return "at" in op ? [op.at, op.at] : [op.start, op.end];
};

type History = [ops: Operation[], invertedOps: Operation[]];

/**
 * @internal
 */
export const createHistory = (editor: Editor) => {
  let index = -1;
  let prevTime = 0;
  let undoOrRedoing = false;
  let history: History | undefined;

  const now = Date.now;
  const histories: History[] = [];

  const isUndoable = (): boolean => {
    return index >= 0;
  };

  const isRedoable = (): boolean => {
    return index < histories.length;
  };

  const flush = () => {
    if (!history) return;

    const time = now();
    if (index === -1 || time - prevTime >= BATCH_HISTORY_TIME) {
      index++;
      if (index >= histories.length) {
        histories.push([[], []]);
      } else {
        histories[index]![0].splice(0);
        histories[index]![1].splice(0);
      }
    }
    prevTime = time;
    histories[index]![0].push(...history[0]);
    histories[index]![1].push(...history[1]);
    histories.splice(index + 1);
    if (index > MAX_HISTORY_LENGTH) {
      index--;
      histories.shift();
    }

    history = undefined;
  };

  return {
    undo: (): void => {
      if (isUndoable()) {
        const [ops, inverted] = histories[index]!;
        index--;
        undoOrRedoing = true;
        editor.apply(new Transaction(inverted.slice().reverse()), true);
        editor.selection = getOperationSelection(ops[0]!);
        undoOrRedoing = false;
      }
    },
    redo: (): void => {
      if (isRedoable()) {
        index++;
        const [ops] = histories[index]!;
        undoOrRedoing = true;
        editor.selection = getOperationSelection(ops[ops.length - 1]!);
        editor.apply(new Transaction(ops), true);
        undoOrRedoing = false;
      }
    },
    apply: ((op, next) => {
      if (undoOrRedoing) return;

      const doc = editor.doc;
      next(op);

      if (!is(doc, editor.doc)) {
        if (!history) {
          history = [[], []];
          microtask(flush);
        }

        history[0].push(op);
        history[1].push(...invertOperation(op, doc));
      }
    }) as Exclude<EditorPlugin["apply"], undefined>,
  };
};
