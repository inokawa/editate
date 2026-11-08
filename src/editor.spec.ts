import { expect, it } from "vitest";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { DocNode } from "./doc/types.js";
import { createEditor } from "./editor.js";

const createDoc = (): DocNode => ({
  children: [{ children: [{ text: "abcde" }] }],
});

it("apply hook not calling next passes operation through", () => {
  const editor = createEditor({ doc: createDoc() });
  editor.hook("apply", () => {});
  editor.apply({ type: "insert_text", at: 1, text: "x" });
  expect(editor.doc).toEqual({
    children: [{ children: [{ text: "axbcde" }] }],
  });
});

it("apply hook replaces operation with next(op)", () => {
  const editor = createEditor({ doc: createDoc() });
  editor.hook("apply", (op, next) => {
    next(
      op.type === "insert_text" ? { ...op, text: op.text.toUpperCase() } : op,
    );
  });
  editor.apply({ type: "insert_text", at: 1, text: "x" });
  expect(editor.doc).toEqual({
    children: [{ children: [{ text: "aXbcde" }] }],
  });
});

it.each([null, undefined])(
  "apply hook cancels operation with next(%s)",
  async (value) => {
    const doc = createDoc();
    const editor = createEditor({ doc });
    const calls: string[] = [];
    editor.hook("apply", (_op, next) => {
      calls.push("first");
      next(value);
    });
    editor.hook("apply", () => {
      calls.push("second");
    });
    let changed = false;
    editor.on("change", () => {
      changed = true;
    });
    editor.apply({ type: "insert_text", at: 1, text: "x" });
    expect(calls).toEqual(["first"]);
    expect(editor.doc).toEqual(doc);
    await new Promise((r) => setTimeout(r));
    expect(changed).toBe(false);
  },
);

it("next returns operation applied after the following hooks", () => {
  const editor = createEditor({ doc: createDoc() });
  let applied;
  editor.hook("apply", (op, next) => {
    applied = next(op);
  });
  editor.hook("apply", (op, next) => {
    next(
      op.type === "insert_text" ? { ...op, text: op.text.toUpperCase() } : op,
    );
  });
  editor.apply({ type: "insert_text", at: 1, text: "x" });
  expect(applied).toEqual({ type: "insert_text", at: 1, text: "X" });
});

it("next returns null if a following hook cancels operation", () => {
  const editor = createEditor({ doc: createDoc() });
  let applied;
  editor.hook("apply", (op, next) => {
    applied = next(op);
  });
  editor.hook("apply", (_op, next) => {
    next(null);
  });
  editor.apply({ type: "insert_text", at: 1, text: "x" });
  expect(applied).toBe(null);
});

it("transaction rejected by the schema is discarded", () => {
  const doc = createDoc();
  const schema: StandardSchemaV1<DocNode, DocNode> = {
    "~standard": {
      version: 1,
      vendor: "test",
      validate: (value) =>
        value === doc ? { value: doc } : { issues: [{ message: "rejected" }] },
    },
  };
  const editor = createEditor({ doc, schema, onWarn: () => {} });
  let applied;
  editor.hook("apply", (op, next) => {
    applied = next(op);
  });
  const op = {
    type: "insert_node",
    at: 1,
    fragment: [{ children: [{ text: "x" }] }],
  } as const;
  editor.apply(op);
  expect(applied).toEqual(op);
  expect(editor.doc).toBe(doc);
});

it("transaction cancelled by a hook applies none of its operations", () => {
  const doc = createDoc();
  const editor = createEditor({ doc });
  editor.hook("apply", (op, next) => {
    next(op.type === "insert_text" ? null : op);
  });
  editor.apply([
    { type: "delete", range: [0, 2] },
    { type: "insert_text", at: 0, text: "x" },
  ]);
  expect(editor.doc).toBe(doc);
});

it("transaction is validated as a whole, not between its operations", () => {
  const doc: DocNode = { children: [{ children: [{ text: "abc" }] }] };
  const schema: StandardSchemaV1<DocNode, DocNode> = {
    "~standard": {
      version: 1,
      vendor: "test",
      validate: (value) =>
        (value as DocNode).children.every(
          (b) => !("foo" in b) || b["foo"] !== "invalid",
        )
          ? { value: value as DocNode }
          : { issues: [{ message: "invalid block" }] },
    },
  };
  const warnings: string[] = [];
  const editor = createEditor({
    doc,
    schema,
    onWarn: (message) => {
      warnings.push(message);
    },
  });
  editor.apply([
    { type: "format", range: [0, 0], key: "foo", value: "invalid", depth: -2 },
    { type: "format", range: [0, 0], key: "foo", value: "valid", depth: -2 },
  ]);
  expect(editor.doc).toEqual({
    children: [{ foo: "valid", children: [{ text: "abc" }] }],
  });
  expect(warnings).toEqual([]);
});

it("transaction is discarded when a hook throws", async () => {
  const doc = createDoc();
  const editor = createEditor({ doc });
  let changed = false;
  editor.on("change", () => {
    changed = true;
  });
  editor.hook("apply", (op, next) => {
    if (op.type === "delete") {
      throw new Error("hook bug");
    }
    next(op);
  });
  expect(() =>
    editor.apply([
      { type: "insert_text", at: 1, text: "x" },
      { type: "delete", range: [0, 1] },
    ]),
  ).toThrow("hook bug");
  expect(editor.doc).toBe(doc);
  await Promise.resolve();
  expect(changed).toBe(false);
});

it("change made in a change listener is published again", async () => {
  const editor = createEditor({ doc: createDoc() });
  const docs: DocNode[] = [];
  editor.on("change", () => {
    docs.push(editor.doc);
    if (docs.length === 1) {
      editor.apply({ type: "insert_text", at: 0, text: "x" });
    }
  });
  editor.apply({ type: "insert_text", at: 0, text: "y" });
  await Promise.resolve();
  await Promise.resolve();
  expect(docs).toEqual([
    { children: [{ children: [{ text: "yabcde" }] }] },
    { children: [{ children: [{ text: "xyabcde" }] }] },
  ]);
});
