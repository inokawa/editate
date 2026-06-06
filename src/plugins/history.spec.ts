import { expect, it } from "vitest";
import type { DocNode, Selection } from "../doc/types.js";
import { createEditor } from "../editor.js";
import { Redo, Undo } from "./history.js";

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
    type: "set_node_attr",
    path: [0],
    key: "foo",
    value: "bar",
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
