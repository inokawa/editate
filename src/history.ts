import { rebasePosition, type Operation } from "./doc/edit.js";
import type { SelectionSnapshot } from "./doc/types.js";

const MAX_HISTORY_LENGTH = 500;
const BATCH_HISTORY_TIME = 500;

const getOperationSelection = (op: Operation): SelectionSnapshot => {
  return "at" in op ? [op.at, op.at] : [op.start, op.end];
};

/**
 * @internal
 */
export const createHistory = <T>(initialDoc: T) => {
  let index = 0;
  let prevTime = 0;
  const now = Date.now;
  const histories: [T, Operation[]][] = [[initialDoc, []]];

  const get = () => histories[index]!;

  const isUndoable = (): boolean => {
    return index > 0;
  };

  const isRedoable = (): boolean => {
    return index < histories.length - 1;
  };

  return {
    change: (doc: T, ops: Operation[]) => {
      const time = now();
      if (index === 0 || time - prevTime >= BATCH_HISTORY_TIME) {
        index++;
        if (index >= histories.length) {
          histories.push([doc, []]);
        } else {
          histories[index]![1].splice(0);
        }
      }
      prevTime = time;
      histories[index]![0] = doc;
      histories[index]![1].push(...ops);
      histories.splice(index + 1);
      if (index > MAX_HISTORY_LENGTH) {
        index--;
        histories.shift();
      }
    },
    undo: (): [T, SelectionSnapshot] | undefined => {
      if (isUndoable()) {
        const ops = get()[1];
        index--;
        const doc = get()[0];
        return [doc, getOperationSelection(ops[0]!)];
      } else {
        return;
      }
    },
    redo: (): [T, SelectionSnapshot] | undefined => {
      if (isRedoable()) {
        index++;
        const [doc, ops] = get();
        const last = ops[ops.length - 1]!;
        const sel = getOperationSelection(last);
        return [
          doc,
          [rebasePosition(sel[0], last), rebasePosition(sel[1], last)],
        ];
      } else {
        return;
      }
    },
  };
};
