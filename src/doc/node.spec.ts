import { describe, expect, it } from "vitest";
import {
  getBlockAt,
  getChildAt,
  getLeafAt,
  getNodeSize,
  iterChilds,
  iterLeafs,
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
  const fix = (r: ReturnType<typeof getChildAt>): [number, number] | null => {
    return r ? [r[2], r[1]] : r;
  };

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
    it.each<[number, [number, number] | null]>([
      [0, [0, 0]],
      [1, [0, 1]],
      [t0.length, [0, t0.length]],
      [t0.length + 1, [1, 0]],
      [t0.length + 2, [1, 1]],
      [t0.length + 1 + t1.length, [1, t1.length]],
      [t0.length + 1 + t1.length + 1, [2, 0]],
      [t0.length + 1 + t1.length + 2, [2, 1]],
      [t0.length + 1 + t1.length + 1 + t2.length, [2, t2.length]],
      [t0.length + 1 + t1.length + 1 + t2.length + 1, null],
    ])(`$0`, (offset, res) => {
      const n = getChildAt(doc, offset);
      expect(fix(n)).toEqual(res);
    });
  });

  describe("inline", () => {
    const t0 = "abcd";
    const t1 = "efghi";
    const t2 = "jklmno";
    const doc: BlockNode = {
      children: [{ text: t0 }, { text: t1 }, { text: t2 }],
    };
    it.each<[number, [number, number] | null]>([
      [0, [0, 0]],
      [1, [0, 1]],
      [t0.length - 1, [0, t0.length - 1]],
      [t0.length, [1, 0]],
      [t0.length + 1, [1, 1]],
      [t0.length + t1.length - 1, [1, t1.length - 1]],
      [t0.length + t1.length, [2, 0]],
      [t0.length + t1.length + 1, [2, 1]],
      [t0.length + t1.length + t2.length - 1, [2, t2.length - 1]],
      [t0.length + t1.length + t2.length, null],
    ])(`$0`, (offset, res) => {
      const n = getChildAt(doc, offset);
      expect(fix(n)).toEqual(res);
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
    it.each<[number, [number, number] | null]>([
      [t0.length, [0, t0.length]],
      [t0.length + 1, [1, 0]],
      [t0.length + 2, [2, 0]],
    ])(`$0`, (offset, res) => {
      const n = getChildAt(doc, offset);
      expect(fix(n)).toEqual(res);
    });
  });

  describe("empty block", () => {
    const doc = {
      children: [{ text: "" }],
    };
    it.each<[number, [number, number] | null]>([
      [0, [0, 0]],
      [1, null],
    ])(`$0`, (offset, res) => {
      const n = getChildAt(doc, offset);
      expect(fix(n)).toEqual(res);
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
  it.each<[number, [Node, number]]>([
    [0, [n0, 0]],
    [1, [n0, 1]],
    [t0.length - 1, [n0, t0.length - 1]],
    [t0.length, [n0, t0.length]],
    [t0.length + 1, [n1, 0]],
    [t0.length + 2, [n1, 1]],
    [t0.length + 1 + t1.length - 1, [n1, t1.length - 1]],
    [t0.length + 1 + t1.length, [n1, t1.length]],
    [t0.length + 1 + t1.length + 1, [n2, 0]],
    [t0.length + 1 + t1.length + 2, [n2, 1]],
    [t0.length + 1 + t1.length + 1 + t2.length - 1, [n2, t2.length - 1]],
    [t0.length + 1 + t1.length + 1 + t2.length, [n2, t2.length]],
    [
      t0.length + 1 + t1.length + 1 + t2.length + 1,
      [doc, t0.length + 1 + t1.length + 1 + t2.length + 1],
    ],
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
  it.each<[number, ReturnType<typeof getLeafAt>]>([
    [0, [n0, 0]],
    [1, [n0, 1]],
    [t0.length - 1, [n0, t0.length - 1]],
    [t0.length, null],
    [t0.length + 1, [n1, 0]],
    [t0.length + 2, [n1, 1]],
    [t0.length + 1 + t1.length - 1, [n1, t1.length - 1]],
    [t0.length + 1 + t1.length, null],
    [t0.length + 1 + t1.length + 1, [n2, 0]],
    [t0.length + 1 + t1.length + 2, [n2, 1]],
    [t0.length + 1 + t1.length + 1 + t2.length - 1, [n2, t2.length - 1]],
    [t0.length + 1 + t1.length + 1 + t2.length, null],
    [t0.length + 1 + t1.length + 1 + t2.length + 1, null],
  ])(`$0`, (offset, res) => {
    const n = getLeafAt(doc, offset);
    expect(n).toEqual(res);
  });
});

describe(iterChilds.name, () => {
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

  function* iterNodes<T extends Node>(
    node: T,
    start: number,
    end: number,
  ): Generator<[node: Node, offset: number], void, void> {
    for (const n of iterChilds(node, start, end)) {
      yield n;
      for (const r of iterChilds(n[0], 0, getNodeSize(n[0]))) {
        yield [r[0], r[1] + n[1]];
      }
    }
  }

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
      [0, t0.length],
      [
        [n0, 0],
        [n00, 0],
      ],
    ],
    [
      [0, t0.length + 1],
      [
        [n0, 0],
        [n00, 0],
        [n1, t0.length + 1],
        [n10, t0.length + 1],
      ],
    ],
    [
      [0, t0.length + 2],
      [
        [n0, 0],
        [n00, 0],
        [n1, t0.length + 1],
        [n10, t0.length + 1],
      ],
    ],
    [
      [0, t0.length + 1 + t1.length],
      [
        [n0, 0],
        [n00, 0],
        [n1, t0.length + 1],
        [n10, t0.length + 1],
      ],
    ],
    [
      [0, t0.length + 1 + t1.length + 1],
      [
        [n0, 0],
        [n00, 0],
        [n1, t0.length + 1],
        [n10, t0.length + 1],
        [n2, t0.length + 1 + t1.length + 1],
        [n20, t0.length + 1 + t1.length + 1],
      ],
    ],
    [
      [0, t0.length + 1 + t1.length + 2],
      [
        [n0, 0],
        [n00, 0],
        [n1, t0.length + 1],
        [n10, t0.length + 1],
        [n2, t0.length + 1 + t1.length + 1],
        [n20, t0.length + 1 + t1.length + 1],
      ],
    ],
    [
      [0, t0.length + 1 + t1.length + 1 + t2.length],
      [
        [n0, 0],
        [n00, 0],
        [n1, t0.length + 1],
        [n10, t0.length + 1],
        [n2, t0.length + 1 + t1.length + 1],
        [n20, t0.length + 1 + t1.length + 1],
      ],
    ],
    [
      [0, Infinity],
      [
        [n0, 0],
        [n00, 0],
        [n1, t0.length + 1],
        [n10, t0.length + 1],
        [n2, t0.length + 1 + t1.length + 1],
        [n20, t0.length + 1 + t1.length + 1],
      ],
    ],
  ])(`$0`, (range, res) => {
    expect([...iterNodes(doc, ...range)]).toEqual(res);
  });
});

describe(iterLeafs.name, () => {
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

  it.each<[Range, [Node, number][]]>([
    [[1, 0], []],
    [[1, 1], []],
    [[0, 0], []],
    [[0, 1], [[n0, 0]]],
    [[0, t0.length], [[n0, 0]]],
    [
      [0, t0.length + 1],
      [
        [n0, 0],
        [n1, t0.length + 1],
      ],
    ],
    [
      [0, t0.length + 2],
      [
        [n0, 0],
        [n1, t0.length + 1],
      ],
    ],
    [
      [0, t0.length + 1 + t1.length],
      [
        [n0, 0],
        [n1, t0.length + 1],
      ],
    ],
    [
      [0, t0.length + 1 + t1.length + 1],
      [
        [n0, 0],
        [n1, t0.length + 1],
        [n2, t0.length + 1 + t1.length + 1],
      ],
    ],
    [
      [0, t0.length + 1 + t1.length + 2],
      [
        [n0, 0],
        [n1, t0.length + 1],
        [n2, t0.length + 1 + t1.length + 1],
      ],
    ],
    [
      [0, t0.length + 1 + t1.length + 1 + t2.length],
      [
        [n0, 0],
        [n1, t0.length + 1],
        [n2, t0.length + 1 + t1.length + 1],
      ],
    ],
    [
      [0, Infinity],
      [
        [n0, 0],
        [n1, t0.length + 1],
        [n2, t0.length + 1 + t1.length + 1],
      ],
    ],
  ])(`$0`, (range, res) => {
    expect([...iterLeafs(doc, ...range)]).toEqual(res);
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

  describe("slice with range", () => {
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
    it.each<[Range, string]>([
      [[1, 0], ""],
      [[1, 1], ""],
      [[0, 0], ""],
      [[0, 1], t0.slice(0, 1)],
      [[0, t0.length], t0],
      [[0, t0.length + 1], t0 + "\n"],
      [[0, t0.length + 2], t0 + "\n" + t1.slice(0, 1)],
      [[0, t0.length + 1 + t1.length], t0 + "\n" + t1],
      [[0, t0.length + 1 + t1.length + 1], t0 + "\n" + t1 + "\n"],
      [
        [0, t0.length + 1 + t1.length + 2],
        t0 + "\n" + t1 + "\n" + t2.slice(0, 1),
      ],
      [
        [0, t0.length + 1 + t1.length + 1 + t2.length],
        t0 + "\n" + t1 + "\n" + t2,
      ],
      [[0, Infinity], t0 + "\n" + t1 + "\n" + t2],
      [[3, t0.length + 2], t0.slice(3) + "\n" + t1.slice(0, 1)],
      [
        [3, t0.length + 1 + t1.length + 2],
        t0.slice(3) + "\n" + t1 + "\n" + t2.slice(0, 1),
      ],
      [[t0.length, t0.length + 1], "\n"],
    ])(`$0`, (range, str) => {
      expect(sliceText(doc, ...range)).toEqual(str);
    });
  });
});
