import { describe, expect, it } from "vitest";
import {
  getBlockAt,
  getChildAt,
  getLeafAt,
  getNodeSize,
  iterNodes,
  iterLeaves,
  sliceFragment,
  sliceText,
} from "./node.js";
import {
  type BlockNode,
  type DocNode,
  type Fragment,
  type Node,
  type Path,
  type Range,
} from "./types.js";

const nodeAtPath = (node: DocNode | BlockNode, path: Path): Node => {
  for (let i = 0; i < path.length; i++) {
    node = node.children[path[i]!]! as BlockNode; // TODO improve
  }
  return node;
};

describe(getNodeSize.name, () => {
  it.each<[Node, number]>([
    [{ text: "" }, 0],
    [{ text: "abc" }, 3],
    [{ foo: "bar" }, 1],
    [{ children: [{ text: "abc" }] }, 3],
    [{ children: [{ text: "abc" }, { text: "de" }] }, 5],
    [
      {
        children: [
          { children: [{ text: "abc" }] },
          { children: [{ text: "de" }] },
        ],
      },
      6,
    ],
  ])(`$0`, (node, res) => {
    expect(getNodeSize(node)).toEqual(res);
  });
});

describe(getChildAt.name, () => {
  describe("block", () => {
    const t0 = "abcd";
    const t1 = "efghi";
    const t2 = "jklmno";
    const doc: DocNode = {
      children: [
        { children: [{ text: t0 }] },
        { children: [{ text: t1 }] },
        { children: [{ text: t2 }] },
      ],
    };
    const b0 = doc.children[0]!;
    const b1 = doc.children[1]!;
    const b2 = doc.children[2]!;
    const t0s = t0.length;
    const t1s = t1.length;
    const t2s = t2.length;
    it.each<[number, [Node, number] | null]>([
      [0, [b0, 0]],
      [1, [b0, 1]],
      [t0s, [b0, t0s]],
      [t0s + 1, [b1, 0]],
      [t0s + 2, [b1, 1]],
      [t0s + 1 + t1s, [b1, t1s]],
      [t0s + 1 + t1s + 1, [b2, 0]],
      [t0s + 1 + t1s + 2, [b2, 1]],
      [t0s + 1 + t1s + 1 + t2s, [b2, t2s]],
      [t0s + 1 + t1s + 1 + t2s + 1, null],
    ])(`$0`, (offset, res) => {
      const n = getChildAt(doc, offset);
      expect(n && [n[0], n[1]]).toEqual(res);
    });
  });

  describe("block backward", () => {
    const t0 = "abcd";
    const t1 = "efghi";
    const t2 = "jklmno";
    const doc: DocNode = {
      children: [
        { children: [{ text: t0 }] },
        { children: [{ text: t1 }] },
        { children: [{ text: t2 }] },
      ],
    };
    const b0 = doc.children[0]!;
    const b1 = doc.children[1]!;
    const b2 = doc.children[2]!;
    const t0s = t0.length;
    const t1s = t1.length;
    const t2s = t2.length;
    it.each<[number, [Node, number] | null]>([
      [0, [b0, 0]],
      [1, [b0, 1]],
      [t0s, [b0, t0s]],
      [t0s + 1, [b1, 0]],
      [t0s + 2, [b1, 1]],
      [t0s + 1 + t1s, [b1, t1s]],
      [t0s + 1 + t1s + 1, [b2, 0]],
      [t0s + 1 + t1s + 2, [b2, 1]],
      [t0s + 1 + t1s + 1 + t2s, [b2, t2s]],
      [t0s + 1 + t1s + 1 + t2s + 1, null],
    ])(`$0`, (offset, res) => {
      const n = getChildAt(doc, offset, true);
      expect(n && [n[0], n[1]]).toEqual(res);
    });
  });

  describe("inline", () => {
    const t0 = "abcd";
    const t1 = "efghi";
    const t2 = "jklmno";
    const doc: BlockNode = {
      children: [{ text: t0 }, { text: t1 }, { text: t2 }],
    };
    const i0 = doc.children[0]!;
    const i1 = doc.children[1]!;
    const i2 = doc.children[2]!;
    const t0s = t0.length;
    const t1s = t1.length;
    const t2s = t2.length;
    it.each<[number, [Node, number] | null]>([
      [0, [i0, 0]],
      [1, [i0, 1]],
      [t0s - 1, [i0, t0s - 1]],
      [t0s, [i1, 0]],
      [t0s + 1, [i1, 1]],
      [t0s + t1s - 1, [i1, t1s - 1]],
      [t0s + t1s, [i2, 0]],
      [t0s + t1s + 1, [i2, 1]],
      [t0s + t1s + t2s - 1, [i2, t2s - 1]],
      [t0s + t1s + t2s, null],
    ])(`$0`, (offset, res) => {
      const n = getChildAt(doc, offset);
      expect(n && [n[0], n[1]]).toEqual(res);
    });
  });

  describe("inline backward", () => {
    const t0 = "abcd";
    const t1 = "efghi";
    const t2 = "jklmno";
    const doc: BlockNode = {
      children: [{ text: t0 }, { text: t1 }, { text: t2 }],
    };
    const i0 = doc.children[0]!;
    const i1 = doc.children[1]!;
    const i2 = doc.children[2]!;
    const t0s = t0.length;
    const t1s = t1.length;
    const t2s = t2.length;
    it.each<[number, [Node, number] | null]>([
      [0, [i0, 0]],
      [1, [i0, 1]],
      [t0s - 1, [i0, t0s - 1]],
      [t0s, [i0, t0s]],
      [t0s + 1, [i1, 1]],
      [t0s + t1s - 1, [i1, t1s - 1]],
      [t0s + t1s, [i1, t1s]],
      [t0s + t1s + 1, [i2, 1]],
      [t0s + t1s + t2s - 1, [i2, t2s - 1]],
      [t0s + t1s + t2s, [i2, t2s]],
      [t0s + t1s + t2s + 1, null],
    ])(`$0`, (offset, res) => {
      const n = getChildAt(doc, offset, true);
      expect(n && [n[0], n[1]]).toEqual(res);
    });
  });

  describe("inline void", () => {
    const t0 = "abcd";
    const t1 = "efghi";
    const doc: BlockNode = {
      children: [
        { foo: "bar" },
        { text: t0 },
        { foo: "bar" },
        { text: t1 },
        { foo: "bar" },
      ],
    };
    const i0 = doc.children[0]!;
    const i1 = doc.children[1]!;
    const i2 = doc.children[2]!;
    const i3 = doc.children[3]!;
    const i4 = doc.children[4]!;
    const t0s = t0.length;
    const t1s = t1.length;
    it.each<[number, [Node, number] | null]>([
      [0, [i0, 0]],
      [1, [i1, 0]],
      [1 + 1, [i1, 1]],
      [1 + t0s - 1, [i1, t0s - 1]],
      [1 + t0s, [i2, 0]],
      [1 + t0s + 1, [i3, 0]],
      [1 + t0s + 1 + t1s - 1, [i3, t1s - 1]],
      [1 + t0s + 1 + t1s, [i4, 0]],
      [1 + t0s + 1 + t1s + 1, null],
    ])(`$0`, (offset, res) => {
      const n = getChildAt(doc, offset);
      expect(n && [n[0], n[1]]).toEqual(res);
    });
  });

  describe("inline void backward", () => {
    const t0 = "abcd";
    const t1 = "efghi";
    const doc: BlockNode = {
      children: [
        { foo: "bar" },
        { text: t0 },
        { foo: "bar" },
        { text: t1 },
        { foo: "bar" },
      ],
    };
    const i0 = doc.children[0]!;
    const i1 = doc.children[1]!;
    const i2 = doc.children[2]!;
    const i3 = doc.children[3]!;
    const i4 = doc.children[4]!;
    const t0s = t0.length;
    const t1s = t1.length;
    it.each<[number, [Node, number] | null]>([
      [0, [i0, 0]],
      [1, [i0, 1]],
      [1 + 1, [i1, 1]],
      [1 + t0s - 1, [i1, t0s - 1]],
      [1 + t0s, [i1, t0s]],
      [1 + t0s + 1, [i2, 1]],
      [1 + t0s + 1 + t1s - 1, [i3, t1s - 1]],
      [1 + t0s + 1 + t1s, [i3, t1s]],
      [1 + t0s + 1 + t1s + 1, [i4, 1]],
      [1 + t0s + 1 + t1s + 1 + 1, null],
    ])(`$0`, (offset, res) => {
      const n = getChildAt(doc, offset, true);
      expect(n && [n[0], n[1]]).toEqual(res);
    });
  });

  describe("empty block in children", () => {
    const t0 = "abcd";
    const t1 = "";
    const t2 = "jklmno";
    const doc: DocNode = {
      children: [
        { children: [{ text: t0 }] },
        { children: [{ text: t1 }] },
        { children: [{ text: t2 }] },
      ],
    };
    const b0 = doc.children[0]!;
    const b1 = doc.children[1]!;
    const b2 = doc.children[2]!;
    const t0s = t0.length;
    it.each<[number, [Node, number] | null]>([
      [t0s, [b0, t0s]],
      [t0s + 1, [b1, 0]],
      [t0s + 2, [b2, 0]],
    ])(`$0`, (offset, res) => {
      const n = getChildAt(doc, offset);
      expect(n && [n[0], n[1]]).toEqual(res);
    });
  });

  describe("empty block", () => {
    const doc = {
      children: [{ text: "" }],
    };
    const i0 = doc.children[0]!;
    it.each<[number, [Node, number] | null]>([
      [0, [i0, 0]],
      [1, null],
    ])(`$0`, (offset, res) => {
      const n = getChildAt(doc, offset);
      expect(n && [n[0], n[1]]).toEqual(res);
    });
  });
});

describe(getBlockAt.name, () => {
  const t0 = "abcd";
  const t1 = "efghi";
  const t2 = "jklmno";
  const doc: DocNode = {
    children: [
      { children: [{ text: t0 }] },
      { children: [{ text: t1 }] },
      { children: [{ text: t2 }] },
    ],
  };
  const n0 = nodeAtPath(doc, [0]);
  const n1 = nodeAtPath(doc, [1]);
  const n2 = nodeAtPath(doc, [2]);
  const t0s = t0.length;
  const t1s = t1.length;
  const t2s = t2.length;
  it.each<[number, [Node, number]]>([
    [0, [n0, 0]],
    [1, [n0, 1]],
    [t0s - 1, [n0, t0s - 1]],
    [t0s, [n0, t0s]],
    [t0s + 1, [n1, 0]],
    [t0s + 2, [n1, 1]],
    [t0s + 1 + t1s - 1, [n1, t1s - 1]],
    [t0s + 1 + t1s, [n1, t1s]],
    [t0s + 1 + t1s + 1, [n2, 0]],
    [t0s + 1 + t1s + 2, [n2, 1]],
    [t0s + 1 + t1s + 1 + t2s - 1, [n2, t2s - 1]],
    [t0s + 1 + t1s + 1 + t2s, [n2, t2s]],
    [t0s + 1 + t1s + 1 + t2s + 1, [doc, t0s + 1 + t1s + 1 + t2s + 1]],
  ])(`$0`, (offset, res) => {
    const n = getBlockAt(doc, offset);
    expect([n[0], n[1]]).toEqual(res);
  });
});

describe(getLeafAt.name, () => {
  const t0 = "abcd";
  const t1 = "efghi";
  const t2 = "jklmno";
  const doc: DocNode = {
    children: [
      { children: [{ text: t0 }] },
      { children: [{ text: t1 }] },
      { children: [{ text: t2 }] },
    ],
  };
  const n0 = nodeAtPath(doc, [0, 0]);
  const n1 = nodeAtPath(doc, [1, 0]);
  const n2 = nodeAtPath(doc, [2, 0]);
  const t0s = t0.length;
  const t1s = t1.length;
  const t2s = t2.length;
  it.each<[number, [Node, number] | null]>([
    [0, [n0, 0]],
    [1, [n0, 1]],
    [t0s - 1, [n0, t0s - 1]],
    [t0s, null],
    [t0s + 1, [n1, 0]],
    [t0s + 2, [n1, 1]],
    [t0s + 1 + t1s - 1, [n1, t1s - 1]],
    [t0s + 1 + t1s, null],
    [t0s + 1 + t1s + 1, [n2, 0]],
    [t0s + 1 + t1s + 2, [n2, 1]],
    [t0s + 1 + t1s + 1 + t2s - 1, [n2, t2s - 1]],
    [t0s + 1 + t1s + 1 + t2s, null],
    [t0s + 1 + t1s + 1 + t2s + 1, null],
  ])(`$0`, (offset, res) => {
    const n = getLeafAt(doc, offset);
    expect(n && [n[0], n[1]]).toEqual(res);
  });
});

describe(iterNodes.name, () => {
  const t0 = "abcd";
  const t1 = "efghi";
  const t2 = "jklmno";
  const doc: DocNode = {
    children: [
      { children: [{ text: t0 }] },
      { children: [{ text: t1 }] },
      { children: [{ text: t2 }] },
    ],
  };
  const n0 = nodeAtPath(doc, [0]);
  const n00 = nodeAtPath(doc, [0, 0]);
  const n1 = nodeAtPath(doc, [1]);
  const n10 = nodeAtPath(doc, [1, 0]);
  const n2 = nodeAtPath(doc, [2]);
  const n20 = nodeAtPath(doc, [2, 0]);
  const t0s = t0.length;
  const t1s = t1.length;
  const t2s = t2.length;

  it.each<[Range, [Node, number][]]>([
    [[1, 0], []],
    [[1, 1], []],
    [[0, 0], []],
    [
      [0, 1],
      [
        [n0, 0],
        [n00, 0],
      ],
    ],
    [
      [0, t0s],
      [
        [n0, 0],
        [n00, 0],
      ],
    ],
    [
      [0, t0s + 1],
      [
        [n0, 0],
        [n00, 0],
        [n1, t0s + 1],
        [n10, t0s + 1],
      ],
    ],
    [
      [0, t0s + 2],
      [
        [n0, 0],
        [n00, 0],
        [n1, t0s + 1],
        [n10, t0s + 1],
      ],
    ],
    [
      [0, t0s + 1 + t1s],
      [
        [n0, 0],
        [n00, 0],
        [n1, t0s + 1],
        [n10, t0s + 1],
      ],
    ],
    [
      [0, t0s + 1 + t1s + 1],
      [
        [n0, 0],
        [n00, 0],
        [n1, t0s + 1],
        [n10, t0s + 1],
        [n2, t0s + 1 + t1s + 1],
        [n20, t0s + 1 + t1s + 1],
      ],
    ],
    [
      [0, t0s + 1 + t1s + 2],
      [
        [n0, 0],
        [n00, 0],
        [n1, t0s + 1],
        [n10, t0s + 1],
        [n2, t0s + 1 + t1s + 1],
        [n20, t0s + 1 + t1s + 1],
      ],
    ],
    [
      [0, t0s + 1 + t1s + 1 + t2s],
      [
        [n0, 0],
        [n00, 0],
        [n1, t0s + 1],
        [n10, t0s + 1],
        [n2, t0s + 1 + t1s + 1],
        [n20, t0s + 1 + t1s + 1],
      ],
    ],
    [
      [0, Infinity],
      [
        [n0, 0],
        [n00, 0],
        [n1, t0s + 1],
        [n10, t0s + 1],
        [n2, t0s + 1 + t1s + 1],
        [n20, t0s + 1 + t1s + 1],
      ],
    ],
  ])(`$0`, (range, res) => {
    expect([...iterNodes(doc, range)]).toEqual(res);
  });
});

describe(iterLeaves.name, () => {
  const t0 = "abcd";
  const t1 = "efghi";
  const t2 = "jklmno";
  const doc: DocNode = {
    children: [
      { children: [{ text: t0 }] },
      { children: [{ text: t1 }] },
      { children: [{ text: t2 }] },
    ],
  };
  const n0 = nodeAtPath(doc, [0, 0]);
  const n1 = nodeAtPath(doc, [1, 0]);
  const n2 = nodeAtPath(doc, [2, 0]);
  const t0s = t0.length;
  const t1s = t1.length;
  const t2s = t2.length;

  it.each<[Range, [Node, number][]]>([
    [[1, 0], []],
    [[1, 1], []],
    [[0, 0], []],
    [[0, 1], [[n0, 0]]],
    [[0, t0s], [[n0, 0]]],
    [
      [0, t0s + 1],
      [
        [n0, 0],
        [n1, t0s + 1],
      ],
    ],
    [
      [0, t0s + 2],
      [
        [n0, 0],
        [n1, t0s + 1],
      ],
    ],
    [
      [0, t0s + 1 + t1s],
      [
        [n0, 0],
        [n1, t0s + 1],
      ],
    ],
    [
      [0, t0s + 1 + t1s + 1],
      [
        [n0, 0],
        [n1, t0s + 1],
        [n2, t0s + 1 + t1s + 1],
      ],
    ],
    [
      [0, t0s + 1 + t1s + 2],
      [
        [n0, 0],
        [n1, t0s + 1],
        [n2, t0s + 1 + t1s + 1],
      ],
    ],
    [
      [0, t0s + 1 + t1s + 1 + t2s],
      [
        [n0, 0],
        [n1, t0s + 1],
        [n2, t0s + 1 + t1s + 1],
      ],
    ],
    [
      [0, Infinity],
      [
        [n0, 0],
        [n1, t0s + 1],
        [n2, t0s + 1 + t1s + 1],
      ],
    ],
    [
      [3, t0s + 2],
      [
        [n0, 0],
        [n1, t0s + 1],
      ],
    ],
    [
      [3, t0s + 1 + t1s + 2],
      [
        [n0, 0],
        [n1, t0s + 1],
        [n2, t0s + 1 + t1s + 1],
      ],
    ],
    [
      [t0s, t0s + 1],
      [
        [n0, 0],
        [n1, t0s + 1],
      ],
    ],
  ])(`$0`, (range, res) => {
    expect([...iterLeaves(doc, range)]).toEqual(res);
  });
});

describe(sliceFragment.name, () => {
  const t0 = "abcd";
  const t1 = "efghi";
  const t2 = "jklmno";
  const doc: DocNode = {
    children: [
      { children: [{ text: t0 }] },
      { children: [{ text: t1 }] },
      { children: [{ text: t2 }] },
    ],
  };
  const t0s = t0.length;
  const t1s = t1.length;
  const t2s = t2.length;
  it.each<[Range, Fragment]>([
    [[1, 0], []],
    [[1, 1], []],
    [[0, 0], []],
    [[0, 1], [{ children: [{ text: t0.slice(0, 1) }] }]],
    [[0, t0s], [{ children: [{ text: t0 }] }]],
    [
      [0, t0s + 1],
      [{ children: [{ text: t0 }] }, { children: [{ text: "" }] }],
    ],
    [
      [0, t0s + 2],
      [{ children: [{ text: t0 }] }, { children: [{ text: t1.slice(0, 1) }] }],
    ],
    [
      [0, t0s + 1 + t1s],
      [{ children: [{ text: t0 }] }, { children: [{ text: t1 }] }],
    ],
    [
      [0, t0s + 1 + t1s + 1],
      [
        { children: [{ text: t0 }] },
        { children: [{ text: t1 }] },
        { children: [{ text: "" }] },
      ],
    ],
    [
      [0, t0s + 1 + t1s + 2],
      [
        { children: [{ text: t0 }] },
        { children: [{ text: t1 }] },
        { children: [{ text: t2.slice(0, 1) }] },
      ],
    ],
    [[0, t0s + 1 + t1s + 1 + t2s], doc.children],
    [[0, Infinity], doc.children],
    [
      [3, t0s + 2],
      [
        { children: [{ text: t0.slice(3) }] },
        { children: [{ text: t1.slice(0, 1) }] },
      ],
    ],
    [
      [3, t0s + 1 + t1s + 2],
      [
        { children: [{ text: t0.slice(3) }] },
        { children: [{ text: t1 }] },
        { children: [{ text: t2.slice(0, 1) }] },
      ],
    ],
    [
      [t0s, t0s + 1],
      [{ children: [{ text: "" }] }, { children: [{ text: "" }] }],
    ],
  ])(`$0`, (range, res) => {
    expect(sliceFragment(doc, ...range)).toEqual(res);
  });
});

describe(sliceText.name, () => {
  describe("serialize node", () => {
    it.each<[Node, string]>([
      [{ text: "" }, ""],
      [{ text: "Hello world" }, "Hello world"],
      [{ foo: "bar" }, ""],
      [{ children: [{ text: "" }] }, ""],
      [{ children: [{ text: "Hello world" }] }, "Hello world"],
      [{ children: [{ children: [{ text: "" }] }] }, ""],
      [{ children: [{ children: [{ text: "Hello world" }] }] }, "Hello world"],
      [
        {
          children: [
            {
              children: [
                { text: "Hello" },
                { text: " ", bold: true },
                { text: "world", bold: false },
              ],
            },
          ],
        },
        "Hello world",
      ],
      [
        {
          children: [
            { children: [{ text: "" }] },
            { children: [{ text: "" }] },
          ],
        },
        "\n",
      ],
      [
        {
          children: [
            { children: [{ text: "Hello" }] },
            { children: [{ text: " world" }] },
          ],
        },
        "Hello\n world",
      ],
      [
        {
          children: [
            { children: [{ text: "Hello" }] },
            { children: [{ text: " " }] },
            { children: [{ text: "world" }] },
          ],
        },
        "Hello\n \nworld",
      ],
      [
        {
          children: [
            { children: [{ text: "" }] },
            { children: [{ text: "Hello" }] },
            { children: [{ text: "" }] },
            { children: [{ text: "" }] },
            { children: [{ text: " world" }] },
            { children: [{ text: "" }] },
          ],
        },
        "\nHello\n\n\n world\n",
      ],
    ])(`$1`, (doc, str) => {
      expect(sliceText(doc)).toEqual(str);
    });
  });

  describe("slice texts", () => {
    const t0 = "abcd";
    const t1 = "efghi";
    const t2 = "jklmno";
    const doc: DocNode = {
      children: [
        { children: [{ text: t0 }] },
        { children: [{ text: t1 }] },
        { children: [{ text: t2 }] },
      ],
    };
    const t0s = t0.length;
    const t1s = t1.length;
    const t2s = t2.length;
    it.each<[Range, string]>([
      [[1, 0], ""],
      [[1, 1], ""],
      [[0, 0], ""],
      [[0, 1], t0.slice(0, 1)],
      [[0, t0s], t0],
      [[0, t0s + 1], t0 + "\n"],
      [[0, t0s + 2], t0 + "\n" + t1.slice(0, 1)],
      [[0, t0s + 1 + t1s], t0 + "\n" + t1],
      [[0, t0s + 1 + t1s + 1], t0 + "\n" + t1 + "\n"],
      [[0, t0s + 1 + t1s + 2], t0 + "\n" + t1 + "\n" + t2.slice(0, 1)],
      [[0, t0s + 1 + t1s + 1 + t2s], t0 + "\n" + t1 + "\n" + t2],
      [[0, Infinity], t0 + "\n" + t1 + "\n" + t2],
      [[3, t0s + 2], t0.slice(3) + "\n" + t1.slice(0, 1)],
      [[3, t0s + 1 + t1s + 2], t0.slice(3) + "\n" + t1 + "\n" + t2.slice(0, 1)],
      [[t0s, t0s + 1], "\n"],
    ])(`$0`, (range, str) => {
      expect(sliceText(doc, ...range)).toEqual(str);
    });
  });

  it("slice texts including void", () => {
    const t0 = "abcd";
    const t1 = "efghi";
    const doc = {
      children: [
        { children: [{ text: t0 }] },
        { children: [{ foo: "bar" }] },
        { children: [{ text: t1 }] },
      ],
    };
    const t0s = t0.length;
    const t1s = t1.length;
    expect(sliceText(doc, 1, t0s + 1 + 1 + 1 + t1s - 1, (n) => n.foo)).toEqual(
      t0.slice(1) + "\n" + "bar" + "\n" + t1.slice(0, -1),
    );
  });
});
