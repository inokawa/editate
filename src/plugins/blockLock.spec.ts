import { expect, it } from "vitest";
import { createEditor } from "../editor.js";
import { blockLockPlugin, LockedInRange } from "./blockLock.js";

type LockDoc = {
  children: {
    locked?: boolean;
    align?: string;
    children: { text: string; bold?: boolean }[];
  }[];
};

it("insert_text inside unlocked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({ type: "insert_text", at: 2, text: "x" });
  expect(editor.doc.children[0]).toEqual({ children: [{ text: "abxcde" }] });
});

it("insert_text inside locked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({ type: "insert_text", at: 8, text: "x" });
  expect(editor.doc).toEqual(doc);
});

it("insert_text at edges of locked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({ type: "insert_text", at: 6, text: "x" });
  expect(editor.doc).toEqual(doc);
  editor.apply({ type: "insert_text", at: 11, text: "x" });
  expect(editor.doc).toEqual(doc);
});

it("insert_text at edges of neighbor blocks", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({ type: "insert_text", at: 5, text: "x" });
  expect(editor.doc.children[0]).toEqual({ children: [{ text: "abcdex" }] });
  editor.apply({ type: "insert_text", at: 13, text: "y" });
  expect(editor.doc.children[2]).toEqual({ children: [{ text: "yklmno" }] });
});

it("insert_text linebreak before locked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({ type: "insert_text", at: 5, text: "\n" });
  expect(editor.doc).toEqual({
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  });
});

it("insert_text linebreak at start of locked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({ type: "insert_text", at: 6, text: "\n" });
  expect(editor.doc).toEqual(doc);
});

it("delete inside unlocked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({ type: "delete", range: [1, 3] });
  expect(editor.doc.children[0]).toEqual({ children: [{ text: "ade" }] });
});

it("delete inside locked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({ type: "delete", range: [7, 9] });
  expect(editor.doc).toEqual(doc);
});

it("delete block boundaries of locked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  // merge with previous block
  editor.apply({ type: "delete", range: [5, 6] });
  expect(editor.doc).toEqual(doc);
  // merge with next block
  editor.apply({ type: "delete", range: [11, 12] });
  expect(editor.doc).toEqual(doc);
});

it("delete until end of previous block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({ type: "delete", range: [3, 5] });
  expect(editor.doc.children[0]).toEqual({ children: [{ text: "abc" }] });
});

it("delete across locked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({ type: "delete", range: [3, 14] });
  expect(editor.doc).toEqual(doc);
});

it("insert_node inside locked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({ type: "insert_node", at: 8, fragment: [{ text: "x" }] });
  expect(editor.doc).toEqual(doc);
});

it("insert_node with blocks inside unlocked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({
    type: "insert_node",
    at: 2,
    fragment: [{ children: [{ text: "X" }] }, { children: [{ text: "Y" }] }],
  });
  expect(editor.doc).toEqual({
    children: [
      { children: [{ text: "abX" }] },
      { children: [{ text: "Ycde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  });
});

it("format inside locked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({ type: "format", range: [7, 10], key: "bold", value: true });
  expect(editor.doc).toEqual(doc);
});

it("format collapsed inside locked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({ type: "format", range: [8, 8], key: "bold", value: true });
  expect(editor.doc).toEqual(doc);
});

it("format inside unlocked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({ type: "format", range: [1, 4], key: "bold", value: true });
  expect(editor.doc.children[0]).toEqual({
    children: [{ text: "a" }, { text: "bcd", bold: true }, { text: "e" }],
  });
});

it("format range touching edge of locked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({ type: "format", range: [1, 6], key: "bold", value: true });
  expect(editor.doc.children[0]).toEqual({
    children: [{ text: "a" }, { text: "bcde", bold: true }],
  });
  expect(editor.doc.children[1]).toEqual(doc.children[1]);
});

it("format block attr on locked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({
    type: "format",
    range: [7, 7],
    key: "align",
    value: "right",
    depth: -2,
  });
  expect(editor.doc).toEqual(doc);
});

it("format block attr on range including locked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({
    type: "format",
    range: [1, 13],
    key: "align",
    value: "right",
    depth: -2,
  });
  expect(editor.doc).toEqual(doc);
});

it("format inside locked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({ type: "format", range: [7, 9], key: "bold", value: true });
  expect(editor.doc).toEqual(doc);
});

it("format unlocking locked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({
    type: "format",
    range: [7, 7],
    key: "locked",
    value: false,
    depth: -2,
  });
  expect(editor.doc.children[1]).toEqual({
    locked: false,
    children: [{ text: "fghij" }],
  });
  editor.apply({ type: "insert_text", at: 8, text: "x" });
  expect(editor.doc.children[1]).toEqual({
    locked: false,
    children: [{ text: "fgxhij" }],
  });
});

it("format locking unlocked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({
    type: "format",
    range: [2, 2],
    key: "locked",
    value: true,
    depth: -2,
  });
  expect(editor.doc.children[0]).toEqual({
    locked: true,
    children: [{ text: "abcde" }],
  });
  editor.apply({ type: "insert_text", at: 2, text: "x" });
  expect(editor.doc.children[0]).toEqual({
    locked: true,
    children: [{ text: "abcde" }],
  });
});

it("format block attr on range ending at an empty locked block", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({
    type: "format",
    range: [1, 6],
    key: "align",
    value: "right",
    depth: -2,
  });
  expect(editor.doc).toEqual(doc);
});

it("format block attr on the table containing a locked cell", () => {
  type TableDoc = {
    children: {
      width?: number;
      children: {
        children: { locked?: boolean; children: { text: string }[] }[];
      }[];
    }[];
  };
  const doc: TableDoc = {
    children: [
      {
        children: [
          {
            children: [
              { locked: true, children: [{ text: "abcde" }] },
              { children: [{ text: "fghij" }] },
            ],
          },
        ],
      },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({
    type: "format",
    range: [2, 2],
    key: "width",
    value: 100,
    depth: -4,
  });
  expect(editor.doc).toEqual({
    children: [{ ...doc.children[0], width: 100 }],
  });
  expect(editor.doc.children[0]!.children[0]!.children[0]).toBe(
    doc.children[0]!.children[0]!.children[0],
  );
});

it("format on root", () => {
  const doc: LockDoc = {
    children: [
      { locked: true, children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({
    type: "format",
    range: [0, 0],
    key: "foo",
    value: 1,
    depth: 0,
  });
  expect(editor.doc).toEqual({ ...doc, foo: 1 });
});

it("replacing the children of the root changing a locked block is rejected", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply({
    type: "format",
    range: [0, 0],
    key: "children",
    value: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "xyz" }] },
    ],
    depth: 0,
  });
  expect(editor.doc).toBe(doc);
});

it("paste at a caret inside locked block is rejected as a whole", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  // a paste dispatches a delete of the selection, even a collapsed one, and an insert
  editor.apply([
    { type: "delete", range: [8, 8] },
    { type: "insert_text", at: 8, text: "x" },
  ]);
  expect(editor.doc).toEqual(doc);
});

it("rejected delete also cancels paired insert", async () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  editor.apply([
    { type: "delete", range: [3, 9] },
    { type: "insert_text", at: 3, text: "x" },
  ]);
  expect(editor.doc).toEqual(doc);

  // suppression must not leak to unrelated inserts
  await Promise.resolve();
  editor.apply({ type: "insert_text", at: 3, text: "x" });
  expect(editor.doc.children[0]).toEqual({ children: [{ text: "abcxde" }] });
});

it("LockedInRange", () => {
  const doc: LockDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { locked: true, children: [{ text: "fghij" }] },
      { children: [{ text: "klmno" }] },
    ],
  };
  const editor = createEditor({ doc }).exec(blockLockPlugin, {
    isLocked: (b) => !!b.locked,
  });
  expect(editor.exec(LockedInRange, [7, 9])).toBe(true);
  expect(editor.exec(LockedInRange, [1, 4])).toBe(false);
  expect(editor.exec(LockedInRange, [3, 14])).toBe(true);
  expect(editor.exec(LockedInRange, [8, 8])).toBe(true);
  expect(editor.exec(LockedInRange, [2, 2])).toBe(false);
  editor.selection = [7, 9];
  expect(editor.exec(LockedInRange)).toBe(true);
});
