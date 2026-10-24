import { expect, it, vi } from "vitest";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { DocNode, Node, Selection } from "../doc/types.js";
import { createEditor } from "../editor.js";
import { ClearHistory, Redo, Redoable, Undo, Undoable } from "./history.js";
import { getNodeSize } from "../doc/node.js";

it("empty history", () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const selection: Selection = [1, 1];
  const editor = createEditor({ doc });
  editor.selection = selection;
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Redo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);
});

it("undo insert text", () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const selection: Selection = [1, 1];
  const editor = createEditor({ doc });
  editor.selection = selection;
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  const text = "xyz";
  editor.apply({ type: "insert_text", at: selection[0], text });
  const updatedDoc: DocNode = {
    children: [
      { children: [{ text: "axyzbcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const updatedSelection: Selection = [
    selection[0] + text.length,
    selection[1] + text.length,
  ];
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);
});

it("undo insert linebreak", () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const selection: Selection = [1, 1];
  const editor = createEditor({ doc });
  editor.selection = selection;
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.apply({ type: "insert_text", at: selection[0], text: "\n" });
  const updatedDoc: DocNode = {
    children: [
      { children: [{ text: "a" }] },
      { children: [{ text: "bcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const updatedSelection: Selection = [selection[0] + 1, selection[1] + 1];
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);
});

it("undo insert lines", () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const selection: Selection = [1, 1];
  const editor = createEditor({ doc });
  editor.selection = selection;
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  const text = "ABC\nDEFG";
  editor.apply({ type: "insert_text", at: selection[0], text: text });
  const updatedDoc: DocNode = {
    children: [
      { children: [{ text: "aABC" }] },
      { children: [{ text: "DEFGbcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const updatedSelection: Selection = [
    selection[0] + text.length,
    selection[1] + text.length,
  ];
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);
});

it("undo delete text", () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const selection: Selection = [1, 2];
  const editor = createEditor({ doc });
  editor.selection = selection;
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.apply({ type: "delete", range: selection });
  const updatedDoc: DocNode = {
    children: [
      { children: [{ text: "acde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const updatedSelection: Selection = [selection[0], selection[0]];
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);
});

it("undo delete linebreak", () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const selection: Selection = [5, 6];
  const editor = createEditor({ doc });
  editor.selection = selection;
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.apply({ type: "delete", range: selection });
  const updatedDoc: DocNode = {
    children: [{ children: [{ text: "abcdefghij" }] }],
  };
  const updatedSelection: Selection = [selection[0], selection[0]];
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);
});

it("undo delete lines", () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const selection: Selection = [4, 7];
  const editor = createEditor({ doc });
  editor.selection = selection;
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.apply({ type: "delete", range: selection });
  const updatedDoc: DocNode = {
    children: [{ children: [{ text: "abcdghij" }] }],
  };
  const updatedSelection: Selection = [selection[0], selection[0]];
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);
});

it("undo replace text", () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const selection: Selection = [1, 2];
  const editor = createEditor({ doc });
  editor.selection = selection;
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  const text = "xyz";
  editor
    .apply({ type: "delete", range: selection })
    .apply({ type: "insert_text", at: selection[0], text });
  const updatedDoc: DocNode = {
    children: [
      { children: [{ text: "axyzcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const updatedSelection: Selection = [
    selection[0] + text.length,
    selection[0] + text.length,
  ];
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);
});

it("undo replace linebreak", () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const selection: Selection = [5, 6];
  const editor = createEditor({ doc });
  editor.selection = selection;
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  const text = "xyz";
  editor
    .apply({ type: "delete", range: selection })
    .apply({ type: "insert_text", at: selection[0], text });
  const updatedDoc: DocNode = {
    children: [{ children: [{ text: "abcdexyzfghij" }] }],
  };
  const updatedSelection: Selection = [
    selection[0] + text.length,
    selection[0] + text.length,
  ];
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);
});

it("undo insert text node", () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const selection: Selection = [1, 1];
  const editor = createEditor({ doc });
  editor.selection = selection;
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  const text = "xyz";
  editor.apply({
    type: "insert_node",
    at: selection[0],
    fragment: [{ children: [{ text }] }],
  });
  const updatedDoc: DocNode = {
    children: [
      { children: [{ text: "axyzbcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const updatedSelection: Selection = [
    selection[0] + text.length,
    selection[1] + text.length,
  ];
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);
});

it("undo insert void node", () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const selection: Selection = [1, 1];
  const editor = createEditor({ doc });
  editor.selection = selection;
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.apply({
    type: "insert_node",
    at: selection[0],
    fragment: [{ children: [{ foo: "bar" }] }],
  });
  const updatedDoc: DocNode = {
    children: [
      { children: [{ text: "a" }, { foo: "bar" }, { text: "bcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const updatedSelection: Selection = [selection[0] + 1, selection[1] + 1];
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);
});

it("undo insert nodes", () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const selection: Selection = [1, 1];
  const editor = createEditor({ doc });
  editor.selection = selection;
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  const fragment = [
    { children: [{ text: "ABC" }] },
    { children: [{ text: "DEFG" }] },
  ];
  editor.apply({
    type: "insert_node",
    at: selection[0],
    fragment: fragment,
  });
  const updatedDoc: DocNode = {
    children: [
      { children: [{ text: "aABC" }] },
      { children: [{ text: "DEFGbcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const updatedSelection: Selection = [
    selection[0] + getNodeSize({ children: fragment }),
    selection[1] + getNodeSize({ children: fragment }),
  ];
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);
});

it("undo format text", () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const selection: Selection = [1, 2];
  const editor = createEditor({ doc });
  editor.selection = selection;
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.apply({
    type: "format",
    range: selection,
    key: "foo",
    value: "bar",
  });
  const updatedDoc: DocNode = {
    children: [
      { children: [{ text: "a" }, { text: "b", foo: "bar" }, { text: "cde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(selection);
});

it("undo format lines", () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const selection: Selection = [1, 7];
  const editor = createEditor({ doc });
  editor.selection = selection;
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.apply({
    type: "format",
    range: selection,
    key: "foo",
    value: "bar",
  });
  const updatedDoc: DocNode = {
    children: [
      { children: [{ text: "a" }, { text: "bcde", foo: "bar" }] },
      { children: [{ text: "f", foo: "bar" }, { text: "ghij" }] },
    ],
  };
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(selection);
});

it("undo set attr", () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const selection: Selection = [1, 1];
  const editor = createEditor({ doc });
  editor.selection = selection;
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.apply({
    type: "format",
    range: [1, 1],
    key: "foo",
    value: "bar",
    depth: -2,
  });
  const updatedDoc = {
    children: [
      { children: [{ text: "abcde" }], foo: "bar" },
      { children: [{ text: "fghij" }] },
    ],
  };
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(selection);
});

it("undo set root attr", () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const selection: Selection = [1, 1];
  const editor = createEditor({ doc });
  editor.selection = selection;
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.apply({
    type: "format",
    range: [1, 1],
    key: "foo",
    value: "bar",
    depth: 0,
  });
  const updatedDoc = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
    foo: "bar",
  };
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(selection);
});

it("undo insert text replaced by a following apply hook", () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const selection: Selection = [1, 1];
  const editor = createEditor({ doc });
  editor.selection = selection;
  editor.hook("apply", (op, next) => {
    next(
      op.type === "insert_text"
        ? { ...op, text: op.text.replaceAll("\n", "") }
        : op,
    );
  });

  editor.apply({ type: "insert_text", at: selection[0], text: "x\ny" });
  const updatedDoc: DocNode = {
    children: [
      { children: [{ text: "axybcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const updatedSelection: Selection = [selection[0] + 2, selection[1] + 2];
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual(updatedSelection);
});

it("redo returns to the selection at the undo", () => {
  const doc: DocNode = { children: [{ children: [{ text: "abcde" }] }] };
  const editor = createEditor({ doc });
  editor.selection = [1, 1];
  editor.apply({ type: "insert_text", at: 1, text: "x" });
  const updatedDoc = editor.doc;
  editor.selection = [4, 4];

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual([1, 1]);

  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.selection).toEqual([4, 4]);
});

it("undo and redo cancelled by an apply hook keep the history where it was", () => {
  const doc: DocNode = { children: [{ children: [{ text: "abcde" }] }] };
  const editor = createEditor({ doc });
  let cancelling = false;
  editor.hook("apply", (op, next) => {
    next(cancelling ? null : op);
  });
  editor.apply({ type: "insert_text", at: 1, text: "x" });
  const updatedDoc: DocNode = {
    children: [{ children: [{ text: "axbcde" }] }],
  };

  cancelling = true;
  editor.exec(Undo);
  expect(editor.doc).toEqual(updatedDoc);
  cancelling = false;
  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);

  cancelling = true;
  editor.exec(Redo);
  expect(editor.doc).toEqual(doc);
  cancelling = false;
  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
});

it("undo skips a transaction cancelled by an apply hook", () => {
  const doc: DocNode = { children: [{ children: [{ text: "abcde" }] }] };
  const editor = createEditor({ doc });
  editor.hook("apply", (op, next) => {
    next(op.type === "insert_text" && op.text === "y" ? null : op);
  });
  editor.apply({ type: "insert_text", at: 1, text: "x" });
  // the first operation is applied before the second one cancels the transaction
  editor.apply([
    { type: "delete", range: [0, 1] },
    { type: "insert_text", at: 0, text: "y" },
  ]);
  expect(editor.doc).toEqual({
    children: [{ children: [{ text: "axbcde" }] }],
  });

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.exec(Undoable)).toBe(false);
});

it("undo skips a transaction rejected by the schema", () => {
  const doc: DocNode = { children: [{ children: [{ text: "abcde" }] }] };
  const schema: StandardSchemaV1<DocNode, DocNode> = {
    "~standard": {
      version: 1,
      vendor: "test",
      validate: (value) =>
        (value as DocNode).children.length === 1
          ? { value: value as DocNode }
          : { issues: [{ message: "one block only" }] },
    },
  };
  const editor = createEditor({ doc, schema, onWarn: () => {} });
  editor.apply({ type: "insert_text", at: 1, text: "x" });
  editor.apply({
    type: "insert_node",
    at: 3,
    fragment: [{ children: [{ text: "" }] }, { children: [{ text: "" }] }],
  });
  expect(editor.doc).toEqual({
    children: [{ children: [{ text: "axbcde" }] }],
  });

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.exec(Undoable)).toBe(false);
});

it("undo synchronously right after an edit", () => {
  const doc: DocNode = { children: [{ children: [{ text: "abcde" }] }] };
  const editor = createEditor({ doc });
  editor.apply({ type: "insert_text", at: 1, text: "x" });
  expect(editor.exec(Undoable)).toBe(true);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
});

it("undo replace text with an out of range deletion", () => {
  const doc: DocNode = { children: [{ children: [{ text: "abcde" }] }] };
  const editor = createEditor({ doc });
  editor.apply([
    { type: "delete", range: [3, 100] },
    { type: "insert_text", at: 3, text: "x" },
  ]);
  expect(editor.doc).toEqual({
    children: [{ children: [{ text: "abcxde" }] }],
  });

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
});

it("undo through a state the schema rejects", () => {
  const doc: DocNode = {
    children: [{ children: [{ text: "abc" }] }, { children: [{ text: "de" }] }],
  };
  const warnings: string[] = [];
  const schema: StandardSchemaV1<DocNode, DocNode> = {
    "~standard": {
      version: 1,
      vendor: "test",
      validate: (value) =>
        (value as DocNode).children.every(
          (b) =>
            "children" in b &&
            b.children.some((n: Node) => "text" in n && n.text),
        )
          ? { value: value as DocNode }
          : { issues: [{ message: "empty block" }] },
    },
  };
  const editor = createEditor({
    doc,
    schema,
    onWarn: (message) => {
      warnings.push(String(message));
    },
  });
  const selection: Selection = [6, 6];
  editor.selection = selection;

  // deletes are not validated, so the state between them has an empty block the schema rejects
  editor
    .apply({ type: "delete", range: [4, 6] })
    .apply({ type: "delete", range: [3, 4] });
  const updatedDoc: DocNode = { children: [{ children: [{ text: "abc" }] }] };
  expect(editor.doc).toEqual(updatedDoc);

  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.selection).toEqual(selection);

  editor.exec(Redo);
  expect(editor.doc).toEqual(updatedDoc);
  expect(warnings).toEqual([]);
});

it("undo edits apart in time one by one", async () => {
  const now = vi.spyOn(Date, "now").mockReturnValue(0);
  const doc: DocNode = { children: [{ children: [{ text: "abcde" }] }] };
  const editor = createEditor({ doc });
  editor.apply({ type: "insert_text", at: 1, text: "x" });
  await Promise.resolve();
  now.mockReturnValue(100);
  editor.apply({ type: "insert_text", at: 2, text: "y" });
  await Promise.resolve();
  now.mockReturnValue(1000);
  editor.apply({ type: "insert_text", at: 3, text: "z" });
  await Promise.resolve();
  now.mockRestore();

  editor.exec(Undo);
  expect(editor.doc).toEqual({
    children: [{ children: [{ text: "axybcde" }] }],
  });
  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
  expect(editor.exec(Undoable)).toBe(false);
});

it("undo an edit made in a change listener together with the edit causing it", async () => {
  const now = vi.spyOn(Date, "now").mockReturnValue(0);
  const doc: DocNode = { children: [{ children: [{ text: "abcde" }] }] };
  const editor = createEditor({ doc });
  let listening = true;
  editor.on("change", () => {
    if (listening) {
      listening = false;
      editor.apply({ type: "insert_text", at: 0, text: "N" });
    }
  });
  editor.apply({ type: "insert_text", at: 1, text: "x" });
  await Promise.resolve();
  await Promise.resolve();
  now.mockReturnValue(1000);
  editor.apply({ type: "insert_text", at: 3, text: "y" });
  await Promise.resolve();
  now.mockRestore();

  editor.exec(Undo);
  expect(editor.doc).toEqual({
    children: [{ children: [{ text: "Naxbcde" }] }],
  });
  editor.exec(Undo);
  expect(editor.doc).toEqual(doc);
});

it("redo is cleared by a new edit", () => {
  const doc: DocNode = { children: [{ children: [{ text: "abcde" }] }] };
  const editor = createEditor({ doc });
  editor.apply({ type: "insert_text", at: 1, text: "x" });
  editor.exec(Undo);
  editor.apply({ type: "insert_text", at: 1, text: "y" });
  expect(editor.exec(Redoable)).toBe(false);

  editor.exec(Redo);
  expect(editor.doc).toEqual({
    children: [{ children: [{ text: "aybcde" }] }],
  });
});

it("clear history", () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "abcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  const selection: Selection = [1, 1];
  const editor = createEditor({ doc });
  editor.selection = selection;

  const text = "xyz";
  editor.apply({ type: "insert_text", at: selection[0], text });
  const updatedDoc: DocNode = {
    children: [
      { children: [{ text: "axyzbcde" }] },
      { children: [{ text: "fghij" }] },
    ],
  };
  expect(editor.doc).toEqual(updatedDoc);
  expect(editor.exec(Undoable)).toBe(true);

  editor.exec(ClearHistory);
  expect(editor.exec(Undoable)).toBe(false);
  expect(editor.exec(Redoable)).toBe(false);

  // Undo no longer restores the state before the clear
  editor.exec(Undo);
  expect(editor.doc).toEqual(updatedDoc);

  // The history restarts from the document at the time of the clear
  editor.apply({ type: "insert_text", at: selection[0], text: "!" });
  expect(editor.exec(Undoable)).toBe(true);
  editor.exec(Undo);
  expect(editor.doc).toEqual(updatedDoc);
});
