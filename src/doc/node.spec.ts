import { describe, expect, it } from "vitest";
import { getChildAt, sliceFragment } from "./node.js";
import {
  type BlockNode,
  type DocNode,
  type Fragment,
  type Range,
} from "./types.js";

describe(getChildAt.name, () => {
  describe("block", () => {
    const t0 = "abcde";
    const t1 = "fghij";
    const t2 = "klmno";
    const doc: DocNode = {
      children: [
        { children: [{ text: t0 }] },
        { children: [{ text: t1 }] },
        { children: [{ text: t2 }] },
      ],
    };
    it.each<[number, ReturnType<typeof getChildAt>]>([
      [0, [doc.children[0]!, 0, 0]],
      [1, [doc.children[0]!, 1, 0]],
      [t0.length, [doc.children[0]!, t0.length, 0]],
      [t0.length + 1, [doc.children[1]!, 0, 1]],
      [t0.length + 2, [doc.children[1]!, 1, 1]],
      [t0.length + 1 + t1.length, [doc.children[1]!, t1.length, 1]],
      [t0.length + 1 + t1.length + 1, [doc.children[2]!, 0, 2]],
      [t0.length + 1 + t1.length + 2, [doc.children[2]!, 1, 2]],
      [
        t0.length + 1 + t1.length + 1 + t2.length,
        [doc.children[2]!, t2.length, 2],
      ],
      [t0.length + 1 + t1.length + 1 + t2.length + 1, null],
    ])(`$0`, (offset, res) => {
      expect(getChildAt(doc, offset)).toEqual(res);
    });
  });

  describe("inline", () => {
    const t0 = "abcde";
    const t1 = "fghij";
    const t2 = "klmno";
    const doc: BlockNode = {
      children: [{ text: t0 }, { text: t1 }, { text: t2 }],
    };
    it.each<[number, ReturnType<typeof getChildAt>]>([
      [0, [doc.children[0]!, 0, 0]],
      [1, [doc.children[0]!, 1, 0]],
      [t0.length - 1, [doc.children[0]!, t0.length - 1, 0]],
      [t0.length, [doc.children[1]!, 0, 1]],
      [t0.length + 1, [doc.children[1]!, 1, 1]],
      [t0.length + t1.length - 1, [doc.children[1]!, t1.length - 1, 1]],
      [t0.length + t1.length, [doc.children[2]!, 0, 2]],
      [t0.length + t1.length + 1, [doc.children[2]!, 1, 2]],
      [
        t0.length + t1.length + t2.length - 1,
        [doc.children[2]!, t2.length - 1, 2],
      ],
      [t0.length + t1.length + t2.length, null],
    ])(`$0`, (offset, res) => {
      expect(getChildAt(doc, offset)).toEqual(res);
    });
  });
});

describe(sliceFragment.name, () => {
  const t0 = "abcde";
  const t1 = "fghij";
  const t2 = "klmno";
  const doc: DocNode = {
    children: [
      { children: [{ text: t0 }] },
      { children: [{ text: t1 }] },
      { children: [{ text: t2 }] },
    ],
  };
  it.each<[Range, Fragment]>([
    [[1, 0], []],
    [[1, 1], []],
    [[0, 0], []],
    [[0, 1], [{ children: [{ text: t0.slice(0, 1) }] }]],
    [[0, t0.length], [{ children: [{ text: t0 }] }]],
    [
      [0, t0.length + 1],
      [{ children: [{ text: t0 }] }, { children: [{ text: "" }] }],
    ],
    [
      [0, t0.length + 2],
      [{ children: [{ text: t0 }] }, { children: [{ text: t1.slice(0, 1) }] }],
    ],
    [
      [0, t0.length + 1 + t1.length],
      [{ children: [{ text: t0 }] }, { children: [{ text: t1 }] }],
    ],
    [
      [0, t0.length + 1 + t1.length + 1],
      [
        { children: [{ text: t0 }] },
        { children: [{ text: t1 }] },
        { children: [{ text: "" }] },
      ],
    ],
    [
      [0, t0.length + 1 + t1.length + 2],
      [
        { children: [{ text: t0 }] },
        { children: [{ text: t1 }] },
        { children: [{ text: t2.slice(0, 1) }] },
      ],
    ],
    [[0, t0.length + 1 + t1.length + 1 + t2.length], doc.children],
    [[0, Infinity], doc.children],
    [
      [3, t0.length + 2],
      [
        { children: [{ text: t0.slice(3) }] },
        { children: [{ text: t1.slice(0, 1) }] },
      ],
    ],
    [
      [3, t0.length + 1 + t1.length + 2],
      [
        { children: [{ text: t0.slice(3) }] },
        { children: [{ text: t1 }] },
        { children: [{ text: t2.slice(0, 1) }] },
      ],
    ],
    [
      [t0.length, t0.length + 1],
      [{ children: [{ text: "" }] }, { children: [{ text: "" }] }],
    ],
  ])(`$0`, (range, res) => {
    expect(sliceFragment(doc, ...range)).toEqual(res);
  });
});
