import { expectTypeOf, it } from "vitest";
import type {
  InferBlockNode,
  InferLeafBlockNode,
  InferInlineNode,
  InferTextNode,
  InferVoidNode,
} from "./types-infer.js";

it("text", () => {
  type Doc = {
    children: { children: { text: string }[] }[];
  };
  expectTypeOf({ children: [{ children: [{ text: "abc" }] }] }).toExtend<
    InferBlockNode<Doc>
  >();
  expectTypeOf({ children: [{ children: [{ text: "abc" }] }] }).not.toExtend<
    InferLeafBlockNode<Doc>
  >();
  expectTypeOf({ children: [{ text: "abc" }] }).toExtend<InferBlockNode<Doc>>();
  expectTypeOf({ children: [{ text: "abc" }] }).toExtend<
    InferLeafBlockNode<Doc>
  >();
  expectTypeOf({ text: "abc" }).toExtend<InferInlineNode<Doc>>();
  expectTypeOf({ text: "abc" }).toExtend<InferTextNode<Doc>>();
  expectTypeOf({ text: "abc" }).not.toExtend<InferVoidNode<Doc>>();
  expectTypeOf({ foo: "bar" }).not.toExtend<InferInlineNode<Doc>>();
  expectTypeOf({ foo: "bar" }).not.toExtend<InferTextNode<Doc>>();
  expectTypeOf({ foo: "bar" }).not.toExtend<InferVoidNode<Doc>>();
});

it("text and void", () => {
  type Doc = {
    children: { children: ({ text: string } | { foo: string })[] }[];
  };
  expectTypeOf({ children: [{ children: [{ text: "abc" }] }] }).toExtend<
    InferBlockNode<Doc>
  >();
  expectTypeOf({ children: [{ children: [{ text: "abc" }] }] }).not.toExtend<
    InferLeafBlockNode<Doc>
  >();
  expectTypeOf({ children: [{ text: "abc" }] }).toExtend<InferBlockNode<Doc>>();
  expectTypeOf({ children: [{ text: "abc" }] }).toExtend<
    InferLeafBlockNode<Doc>
  >();
  expectTypeOf({ text: "abc" }).toExtend<InferInlineNode<Doc>>();
  expectTypeOf({ text: "abc" }).toExtend<InferTextNode<Doc>>();
  expectTypeOf({ text: "abc" }).not.toExtend<InferVoidNode<Doc>>();
  expectTypeOf({ foo: "bar" }).toExtend<InferInlineNode<Doc>>();
  expectTypeOf({ foo: "bar" }).not.toExtend<InferTextNode<Doc>>();
  expectTypeOf({ foo: "bar" }).toExtend<InferVoidNode<Doc>>();
});
