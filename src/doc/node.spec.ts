import { describe, expect, it } from "vitest";
import { sliceFragment, getNodeSize } from "./node.js";
import { type DocNode, type Fragment, type Range } from "./types.js";

describe(sliceFragment.name, () => {
  const doc: DocNode = {
    children: [
      { children: [{ text: "Hello" }] },
      { children: [{ text: "world" }] },
    ],
  };
  const size0 = getNodeSize(doc.children[0]!);
  const size1 = getNodeSize(doc.children[1]!);
  it.each<[Range, Fragment]>([
    [[1, 0], []],
    [[0, 0], []],
    [[0, size0], [{ children: [{ text: "Hello" }] }]],
    [
      [0, size0 + 1],
      [{ children: [{ text: "Hello" }] }, { children: [{ text: "" }] }],
    ],
    [
      [0, size0 + 2],
      [{ children: [{ text: "Hello" }] }, { children: [{ text: "w" }] }],
    ],
    [
      [size0, size0 + 1],
      [{ children: [{ text: "" }] }, { children: [{ text: "" }] }],
    ],
    [[size0 + 1, size0 + size1], [{ children: [{ text: "worl" }] }]],
    [[0, size0 + size1 + 1], doc.children],
    [[0, Infinity], doc.children],
  ])(`$0`, (range, res) => {
    expect(sliceFragment(doc, ...range)).toEqual(res);
  });
});
