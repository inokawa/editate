import { describe, expect, it } from "vitest";
import { sliceFragment } from "./node.js";
import { type DocNode, type Fragment, type Range } from "./types.js";

describe(sliceFragment.name, () => {
  const text0 = "abcde";
  const text1 = "fghij";
  const text2 = "klmno";
  const doc: DocNode = {
    children: [
      { children: [{ text: text0 }] },
      { children: [{ text: text1 }] },
      { children: [{ text: text2 }] },
    ],
  };
  it.each<[Range, Fragment]>([
    [[1, 0], []],
    [[1, 1], []],
    [[0, 0], []],
    [[0, 1], [{ children: [{ text: text0.slice(0, 1) }] }]],
    [[0, text0.length], [{ children: [{ text: text0 }] }]],
    [
      [0, text0.length + 1],
      [{ children: [{ text: text0 }] }, { children: [{ text: "" }] }],
    ],
    [
      [0, text0.length + 2],
      [
        { children: [{ text: text0 }] },
        { children: [{ text: text1.slice(0, 1) }] },
      ],
    ],
    [
      [0, text0.length + 1 + text1.length],
      [{ children: [{ text: text0 }] }, { children: [{ text: text1 }] }],
    ],
    [
      [0, text0.length + 1 + text1.length + 1],
      [
        { children: [{ text: text0 }] },
        { children: [{ text: text1 }] },
        { children: [{ text: "" }] },
      ],
    ],
    [
      [0, text0.length + 1 + text1.length + 2],
      [
        { children: [{ text: text0 }] },
        { children: [{ text: text1 }] },
        { children: [{ text: text2.slice(0, 1) }] },
      ],
    ],
    [[0, text0.length + 1 + text1.length + 1 + text2.length], doc.children],
    [[0, Infinity], doc.children],
    [
      [3, text0.length + 2],
      [
        { children: [{ text: text0.slice(3) }] },
        { children: [{ text: text1.slice(0, 1) }] },
      ],
    ],
    [
      [3, text0.length + 1 + text1.length + 2],
      [
        { children: [{ text: text0.slice(3) }] },
        { children: [{ text: text1 }] },
        { children: [{ text: text2.slice(0, 1) }] },
      ],
    ],
    [
      [text0.length, text0.length + 1],
      [{ children: [{ text: "" }] }, { children: [{ text: "" }] }],
    ],
  ])(`$0`, (range, res) => {
    expect(sliceFragment(doc, ...range)).toEqual(res);
  });
});
