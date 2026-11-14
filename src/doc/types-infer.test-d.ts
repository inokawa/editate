import { expectTypeOf, it } from "vitest";
import type {
  ExtractAttrValue,
  InferBlockNode,
  InferLeafBlockNode,
  InferInlineNode,
  InferTextNode,
  InferVoidNode,
} from "./types-infer.js";
import type { BlockNode, DocNode, TextNode, VoidNode } from "./types.js";

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

it("block of text and void", () => {
  type Paragraph = {
    type: "paragraph";
    children: ({ text: string } | { foo: string })[];
  };
  type Heading = { type: "heading"; children: { text: string }[] };
  type Doc = { children: (Paragraph | Heading)[] };
  expectTypeOf<InferLeafBlockNode<Doc>>().toEqualTypeOf<Paragraph | Heading>();
  expectTypeOf<InferBlockNode<Doc>>().toEqualTypeOf<
    Paragraph | Heading | Doc
  >();
});

it("nested", () => {
  type Paragraph = { type: "paragraph"; children: { text: string }[] };
  type Cell = { type: "cell"; children: Paragraph[] };
  type Row = { type: "row"; children: Cell[] };
  type Table = { type: "table"; children: Row[] };
  type Doc = { children: (Paragraph | Table)[] };
  expectTypeOf<InferLeafBlockNode<Doc>>().toEqualTypeOf<Paragraph>();
  expectTypeOf<InferBlockNode<Doc>>().toEqualTypeOf<
    Paragraph | Cell | Row | Table | Doc
  >();
  expectTypeOf<InferInlineNode<Doc>>().toEqualTypeOf<{ text: string }>();
});

it("recursive", () => {
  type Text = { text: string };
  type Paragraph = { type: "paragraph"; children: Text[] };
  type Item = { type: "item"; children: (Text | { foo: string })[] };
  type List = { type: "list"; children: (Item | List)[] };
  type Quote = { type: "quote"; children: (Paragraph | Quote)[] };
  type Doc = { children: (Paragraph | List | Quote)[] };
  expectTypeOf<InferBlockNode<Doc>>().toEqualTypeOf<
    Paragraph | Item | List | Quote | Doc
  >();
  expectTypeOf<InferLeafBlockNode<Doc>>().toEqualTypeOf<Paragraph | Item>();
  expectTypeOf<InferInlineNode<Doc>>().toEqualTypeOf<Text | { foo: string }>();
  expectTypeOf<InferVoidNode<Doc>>().toEqualTypeOf<{ foo: string }>();
});

it("blocks containing each other", () => {
  type Text = { text: string };
  type Paragraph = { type: "paragraph"; children: Text[] };
  type Block = Paragraph | Quote | Toggle | Callout;
  type Quote = { type: "quote"; children: Block[] };
  type Toggle = { type: "toggle"; children: Block[] };
  type Callout = { type: "callout"; children: Block[] };
  type Doc = { children: Block[] };
  expectTypeOf<InferBlockNode<Doc>>().toEqualTypeOf<Block | Doc>();
  expectTypeOf<InferLeafBlockNode<Doc>>().toEqualTypeOf<Paragraph>();
  expectTypeOf<InferInlineNode<Doc>>().toEqualTypeOf<Text>();
});

it("block or inline", () => {
  type Text = { text: string };
  type Block = { children: Text[] };
  type Doc = { children: Block[] | Text[] };
  expectTypeOf<InferBlockNode<Doc>>().toEqualTypeOf<Block | Doc>();
  expectTypeOf<InferLeafBlockNode<Doc>>().toEqualTypeOf<Block | Doc>();
  expectTypeOf<InferInlineNode<Doc>>().toEqualTypeOf<Text>();
});

it("inline only", () => {
  type Doc = { children: ({ text: string } | { foo: string })[] };
  expectTypeOf<InferLeafBlockNode<Doc>>().toEqualTypeOf<Doc>();
  expectTypeOf<InferVoidNode<Doc>>().toEqualTypeOf<{ foo: string }>();
});

it("default", () => {
  expectTypeOf<InferLeafBlockNode<DocNode>>().toEqualTypeOf<
    BlockNode | DocNode
  >();
  expectTypeOf<InferBlockNode<DocNode>>().toEqualTypeOf<BlockNode | DocNode>();
  expectTypeOf<InferInlineNode<DocNode>>().toEqualTypeOf<TextNode | VoidNode>();
  expectTypeOf<InferTextNode<DocNode>>().toEqualTypeOf<TextNode>();
  expectTypeOf<InferVoidNode<DocNode>>().toEqualTypeOf<VoidNode>();
});

it("attr value", () => {
  type Text = { text: string; bold?: boolean };
  type Image = { type: "image"; src: string };
  type Paragraph = {
    type: "paragraph";
    align?: "left" | "right";
    children: (Text | Image)[];
  };
  type Heading = { type: "heading"; level: 1 | 2; children: Text[] };
  type Doc = { children: (Paragraph | Heading)[] };
  type Block = InferLeafBlockNode<Doc>;
  expectTypeOf<ExtractAttrValue<Block, "type">>().toEqualTypeOf<
    "paragraph" | "heading"
  >();
  expectTypeOf<ExtractAttrValue<Block, "align">>().toEqualTypeOf<
    "left" | "right" | undefined
  >();
  expectTypeOf<ExtractAttrValue<Block, "level">>().toEqualTypeOf<1 | 2>();
  expectTypeOf<ExtractAttrValue<Block, "bold">>().toBeNever();
  expectTypeOf<ExtractAttrValue<Block, "src">>().toBeNever();
  expectTypeOf<
    ExtractAttrValue<InferVoidNode<Doc>, "src">
  >().toEqualTypeOf<string>();
  expectTypeOf<ExtractAttrValue<InferVoidNode<Doc>, "bold">>().toBeNever();
  expectTypeOf<
    ExtractAttrValue<InferLeafBlockNode<DocNode>, "align">
  >().toBeAny();
  expectTypeOf<ExtractAttrValue<InferVoidNode<DocNode>, "src">>().toBeAny();
});
