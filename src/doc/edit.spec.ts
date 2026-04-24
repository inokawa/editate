import { afterEach, describe, expect, it, vi } from "vitest";
import { applyOperation, isValidSelection } from "./edit.js";
import { type SelectionSnapshot } from "./types.js";
import { is } from "../utils.js";

type Doc = {
  children: { attr: number; children: { attr: number; text: string }[] }[];
};

const splitAt = (targetStr: string, index: number): [string, string] => {
  return [targetStr.slice(0, index), targetStr.slice(index)];
};

const insertAt = (targetStr: string, index: number, text: string): string => {
  const splitted = splitAt(targetStr, index);
  return splitted[0] + text + splitted[1];
};

const deleteAt = (targetStr: string, index: number, length: number): string => {
  return targetStr.slice(0, index) + targetStr.slice(index + length);
};

const moveOffset = (
  selection: SelectionSnapshot,
  offset: number | { anchor?: number; focus?: number },
): SelectionSnapshot => {
  const anchorOffset =
    typeof offset === "number" ? offset : (offset.anchor ?? 0);
  const focusOffset = typeof offset === "number" ? offset : (offset.focus ?? 0);
  return [
    [selection[0][0], selection[0][1] + anchorOffset],
    [selection[1][0], selection[1][1] + focusOffset],
  ];
};

const moveLine = (
  [anchor, focus]: SelectionSnapshot,
  line: number | { anchor?: number; focus?: number },
): SelectionSnapshot => {
  const anchorLine = typeof line === "number" ? line : (line.anchor ?? 0);
  const focusLine = typeof line === "number" ? line : (line.focus ?? 0);
  return [
    [[(anchor[0].length ? anchor[0][0]! : 0) + anchorLine], anchor[1]],
    [[(focus[0].length ? focus[0][0]! : 0) + focusLine], focus[1]],
  ];
};

afterEach(() => {
  vi.restoreAllMocks();
});

it("discard if error", () => {
  const docText = "abcde";
  const docText2 = "fghij";
  const doc: Doc = {
    children: [
      { attr: 0, children: [{ attr: 0, text: docText }] },
      { attr: 1, children: [{ attr: 0, text: docText2 }] },
    ],
  };
  const sel: SelectionSnapshot = [
    [[1], 2],
    [[1], 2],
  ];

  expect(() =>
    applyOperation(doc, sel, { type: "insert_node" } as any),
  ).toThrow();
});

describe("insert text", () => {
  describe("validation", () => {
    it("path less than min", () => {
      const docText = "abcde";
      const docText2 = "fghij";
      const doc: Doc = {
        children: [
          { attr: 0, children: [{ attr: 0, text: docText }] },
          { attr: 1, children: [{ attr: 0, text: docText2 }] },
        ],
      };
      const sel: SelectionSnapshot = [
        [[1], 2],
        [[1], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "insert_text",
        at: [[-1], 0],
        text: "test",
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("path more than max", () => {
      const docText = "abcde";
      const docText2 = "fghij";
      const doc: Doc = {
        children: [
          { attr: 0, children: [{ attr: 0, text: docText }] },
          { attr: 1, children: [{ attr: 0, text: docText2 }] },
        ],
      };
      const sel: SelectionSnapshot = [
        [[1], 2],
        [[1], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "insert_text",
        at: [[100], 0],
        text: "test",
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("offset less than min", () => {
      const docText = "abcde";
      const docText2 = "fghij";
      const doc: Doc = {
        children: [
          { attr: 0, children: [{ attr: 0, text: docText }] },
          { attr: 1, children: [{ attr: 0, text: docText2 }] },
        ],
      };
      const sel: SelectionSnapshot = [
        [[1], 2],
        [[1], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "insert_text",
        at: [[0], -1],
        text: "test",
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("offset more than max", () => {
      const docText = "abcde";
      const docText2 = "fghij";
      const doc: Doc = {
        children: [
          { attr: 0, children: [{ attr: 0, text: docText }] },
          { attr: 1, children: [{ attr: 0, text: docText2 }] },
        ],
      };
      const sel: SelectionSnapshot = [
        [[1], 2],
        [[1], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "insert_text",
        at: [[0], 100],
        text: "test",
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("empty text", () => {
      const docText = "abcde";
      const docText2 = "fghij";
      const doc: Doc = {
        children: [
          { attr: 0, children: [{ attr: 0, text: docText }] },
          { attr: 1, children: [{ attr: 0, text: docText2 }] },
        ],
      };
      const sel: SelectionSnapshot = [
        [[1], 2],
        [[1], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "insert_text",
        at: [[0], 1],
        text: "",
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });
  });

  describe("expanded", () => {
    it("insert text inside selection", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 1],
        [[0], 3],
      ];
      const text = "ABC";
      const res = applyOperation(doc, sel, {
        type: "insert_text",
        at: [[0], 2],
        text: text,
      });

      expect(res[0]).toEqual({
        children: [
          {
            attr: 0,
            children: [{ attr: 0, text: insertAt(docText, 2, text) }],
          },
        ],
      });
      expect(res[1]).toEqual(moveOffset(sel, { focus: text.length }));
    });

    it("insert line break inside selection", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 1],
        [[0], 3],
      ];
      const res = applyOperation(doc, sel, {
        type: "insert_text",
        at: [[0], 2],
        text: "\n",
      });

      const [before, after] = splitAt(docText, 2);
      expect(res[0]).toEqual({
        children: [
          { attr: 0, children: [{ attr: 0, text: before }] },
          { attr: 0, children: [{ attr: 0, text: after }] },
        ],
      });
      expect(res[1]).toEqual(
        moveLine(moveOffset(sel, { focus: -before.length }), {
          focus: 1,
        }),
      );
    });

    it("insert lines inside selection", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 1],
        [[0], 3],
      ];
      const text = "ABC";
      const text2 = "DEFG";
      const res = applyOperation(doc, sel, {
        type: "insert_text",
        at: [[0], 2],
        text: text + "\n" + text2,
      });

      const [before, after] = splitAt(docText, 2);
      expect(res[0]).toEqual({
        children: [
          { attr: 0, children: [{ attr: 0, text: before + text }] },
          { attr: 0, children: [{ attr: 0, text: text2 + after }] },
        ],
      });
      expect(res[1]).toEqual(
        moveLine(moveOffset(sel, { focus: -before.length + text2.length }), {
          focus: 1,
        }),
      );
    });
  });

  it("insert text at previous line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[1], 2],
      [[1], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[0], 1],
      text: text,
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: insertAt(docText, 1, text) }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert line break at previous line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[1], 2],
      [[1], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[0], 1],
      text: "\n",
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before }] },
        { attr: 0, children: [{ attr: 0, text: after }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(moveLine(sel, 1));
  });

  it("insert lines at previous line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[1], 2],
      [[1], 2],
    ];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[0], 1],
      text: text + "\n" + text2,
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before + text }] },
        { attr: 0, children: [{ attr: 0, text: text2 + after }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(moveLine(sel, 1));
  });

  it("insert text before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[0], 1],
      text: text,
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: insertAt(docText, 1, text) }] },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, text.length));
  });

  it("insert line break before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[0], 1],
      text: "\n",
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before }] },
        { attr: 0, children: [{ attr: 0, text: after }] },
      ],
    });
    expect(res[1]).toEqual(moveLine(moveOffset(sel, -before.length), 1));
  });

  it("insert lines before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[0], 1],
      text: text + "\n" + text2,
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before + text }] },
        { attr: 0, children: [{ attr: 0, text: text2 + after }] },
      ],
    });
    expect(res[1]).toEqual(
      moveLine(moveOffset(sel, -before.length + text2.length), 1),
    );
  });

  it("insert text on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[0], 2],
      text: text,
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: insertAt(docText, 2, text) }] },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, text.length));
  });

  it("insert line break on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[0], 2],
      text: "\n",
    });

    const [before, after] = splitAt(docText, 2);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before }] },
        { attr: 0, children: [{ attr: 0, text: after }] },
      ],
    });
    expect(res[1]).toEqual(moveLine(moveOffset(sel, -before.length), 1));
  });

  it("insert lines on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[0], 2],
      text: text + "\n" + text2,
    });

    const [before, after] = splitAt(docText, 2);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before + text }] },
        { attr: 0, children: [{ attr: 0, text: text2 + after }] },
      ],
    });
    expect(res[1]).toEqual(
      moveLine(moveOffset(sel, -before.length + text2.length), 1),
    );
  });

  it("insert text after caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[0], 3],
      text: text,
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: insertAt(docText, 3, text) }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert line break after caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[0], 3],
      text: "\n",
    });

    const [before, after] = splitAt(docText, 3);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before }] },
        { attr: 0, children: [{ attr: 0, text: after }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert lines after caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[0], 3],
      text: text + "\n" + text2,
    });

    const [before, after] = splitAt(docText, 3);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before + text }] },
        { attr: 0, children: [{ attr: 0, text: text2 + after }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert text at next line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[1], 1],
      text: text,
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: insertAt(docText2, 1, text) }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert line break at next line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[1], 1],
      text: "\n",
    });

    const [before, after] = splitAt(docText2, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: before }] },
        { attr: 1, children: [{ attr: 0, text: after }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert lines at next line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[1], 1],
      text: text + "\n" + text2,
    });

    const [before, after] = splitAt(docText2, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: before + text }] },
        { attr: 1, children: [{ attr: 0, text: text2 + after }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert text before caret at middle line", () => {
    const docText = "abcde";
    const docText2 = "fghi";
    const docText3 = "jkl";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
        { attr: 2, children: [{ attr: 0, text: docText3 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[1], 2],
      [[1], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[1], 1],
      text: text,
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: insertAt(docText2, 1, text) }] },
        { attr: 2, children: [{ attr: 0, text: docText3 }] },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, text.length));
  });

  it("insert text after caret at middle line", () => {
    const docText = "abcde";
    const docText2 = "fghi";
    const docText3 = "jkl";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
        { attr: 2, children: [{ attr: 0, text: docText3 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[1], 2],
      [[1], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[1], 3],
      text: text,
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: insertAt(docText2, 3, text) }] },
        { attr: 2, children: [{ attr: 0, text: docText3 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert line break at start of line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 2, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[1], 0],
      text: "\n",
    });
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 2, text: "" }] },
        { attr: 1, children: [{ attr: 2, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert line break at middle of line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[1], 1],
      text: "\n",
    });

    const [before, after] = splitAt(docText2, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: before }] },
        { attr: 1, children: [{ attr: 0, text: after }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert line break at end of line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[0], docText.length],
      text: "\n",
    });
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 0, children: [{ attr: 0, text: "" }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert text at the edge of text node", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText },
            { attr: 1, text: docText2 },
          ],
        },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[0], docText.length],
      text: text,
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText + text },
            { attr: 1, text: docText2 },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert lines at the edge of text node", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText },
            { attr: 1, text: docText2 },
          ],
        },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[0], docText.length],
      text: text + "\n" + text2,
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText + text }] },
        {
          attr: 0,
          children: [
            { attr: 0, text: text2 },
            { attr: 1, text: docText2 },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert line break at the edge of text node", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText },
            { attr: 1, text: docText2 },
          ],
        },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: [[0], docText.length],
      text: "\n",
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 0, children: [{ attr: 1, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });
});

describe("insert node", () => {
  describe("validation", () => {
    it("path less than min", () => {
      const docText = "abcde";
      const docText2 = "fghij";
      const doc: Doc = {
        children: [
          { attr: 0, children: [{ attr: 0, text: docText }] },
          { attr: 1, children: [{ attr: 0, text: docText2 }] },
        ],
      };
      const sel: SelectionSnapshot = [
        [[1], 2],
        [[1], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "insert_node",
        at: [[-1], 0],
        fragment: [{ children: [{ text: "test" }] }],
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("path more than max", () => {
      const docText = "abcde";
      const docText2 = "fghij";
      const doc: Doc = {
        children: [
          { attr: 0, children: [{ attr: 0, text: docText }] },
          { attr: 1, children: [{ attr: 0, text: docText2 }] },
        ],
      };
      const sel: SelectionSnapshot = [
        [[1], 2],
        [[1], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "insert_node",
        at: [[100], 0],
        fragment: [{ children: [{ text: "test" }] }],
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("offset less than min", () => {
      const docText = "abcde";
      const docText2 = "fghij";
      const doc: Doc = {
        children: [
          { attr: 0, children: [{ attr: 0, text: docText }] },
          { attr: 1, children: [{ attr: 0, text: docText2 }] },
        ],
      };
      const sel: SelectionSnapshot = [
        [[1], 2],
        [[1], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "insert_node",
        at: [[0], -1],
        fragment: [{ children: [{ text: "test" }] }],
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("offset more than max", () => {
      const docText = "abcde";
      const docText2 = "fghij";
      const doc: Doc = {
        children: [
          { attr: 0, children: [{ attr: 0, text: docText }] },
          { attr: 1, children: [{ attr: 0, text: docText2 }] },
        ],
      };
      const sel: SelectionSnapshot = [
        [[1], 2],
        [[1], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "insert_node",
        at: [[0], 100],
        fragment: [{ children: [{ text: "test" }] }],
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("empty fragment", () => {
      const docText = "abcde";
      const docText2 = "fghij";
      const doc: Doc = {
        children: [
          { attr: 0, children: [{ attr: 0, text: docText }] },
          { attr: 1, children: [{ attr: 0, text: docText2 }] },
        ],
      };
      const sel: SelectionSnapshot = [
        [[1], 2],
        [[1], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "insert_node",
        at: [[0], 1],
        fragment: [],
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });
  });

  it("insert text at previous line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[1], 2],
      [[1], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 1],
      fragment: [{ children: [{ text }] }],
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: before },
            { text },
            { attr: 0, text: after },
          ],
        },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert lines at previous line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[1], 2],
      [[1], 2],
    ];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 1],
      fragment: [
        { children: [{ text: text }] },
        { children: [{ text: text2 }] },
      ],
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before }, { text }] },
        { children: [{ text: text2 }, { attr: 0, text: after }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(moveLine(sel, 1));
  });

  it("insert text with attr at previous line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[1], 2],
      [[1], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 1],
      fragment: [{ children: [{ text, foo: "bar" }] }],
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: before },
            { text, foo: "bar" },
            { attr: 0, text: after },
          ],
        },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert text with the same attr at previous line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[1], 2],
      [[1], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 1],
      fragment: [{ children: [{ text, attr: 0 }] }],
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before + text + after }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert void at previous line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[1], 2],
      [[1], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 1],
      fragment: [{ children: [{ foo: "bar" }] }],
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: before },
            { foo: "bar" },
            { attr: 0, text: after },
          ],
        },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert text before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 1],
      fragment: [{ children: [{ text }] }],
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: before },
            { text },
            { attr: 0, text: after },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, text.length));
  });

  it("insert lines before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 1],
      fragment: [
        { children: [{ text: text }] },
        { children: [{ text: text2 }] },
      ],
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before }, { text }] },
        { children: [{ text: text2 }, { attr: 0, text: after }] },
      ],
    });
    expect(res[1]).toEqual(
      moveLine(moveOffset(sel, -before.length + text2.length), 1),
    );
  });

  it("insert text with attr before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 1],
      fragment: [{ children: [{ text, foo: "bar" }] }],
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: before },
            { text, foo: "bar" },
            { attr: 0, text: after },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, text.length));
  });

  it("insert text with the same attr before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 1],
      fragment: [{ children: [{ text, attr: 0 }] }],
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before + text + after }] },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, text.length));
  });

  it("insert void before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 1],
      fragment: [{ children: [{ foo: "bar" }] }],
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: before },
            { foo: "bar" },
            { attr: 0, text: after },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, 1));
  });

  it("insert text on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 2],
      fragment: [{ children: [{ text }] }],
    });

    const [before, after] = splitAt(docText, 2);
    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: before },
            { text },
            { attr: 0, text: after },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, text.length));
  });

  it("insert lines on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 2],
      fragment: [
        { children: [{ text: text }] },
        { children: [{ text: text2 }] },
      ],
    });

    const [before, after] = splitAt(docText, 2);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before }, { text }] },
        { children: [{ text: text2 }, { attr: 0, text: after }] },
      ],
    });
    expect(res[1]).toEqual(
      moveLine(moveOffset(sel, -before.length + text2.length), 1),
    );
  });

  it("insert text with attr on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 2],
      fragment: [{ children: [{ text, foo: "bar" }] }],
    });

    const [before, after] = splitAt(docText, 2);
    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: before },
            { text, foo: "bar" },
            { attr: 0, text: after },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, text.length));
  });

  it("insert text with the same attr on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 2],
      fragment: [{ children: [{ text, attr: 0 }] }],
    });

    const [before, after] = splitAt(docText, 2);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before + text + after }] },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, text.length));
  });

  it("insert void on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 2],
      fragment: [{ children: [{ foo: "bar" }] }],
    });

    const [before, after] = splitAt(docText, 2);
    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: before },
            { foo: "bar" },
            { attr: 0, text: after },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, 1));
  });

  it("insert text inside selection", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 1],
      [[0], 3],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 2],
      fragment: [{ children: [{ text }] }],
    });

    const [before, after] = splitAt(docText, 2);
    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: before },
            { text },
            { attr: 0, text: after },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, { focus: text.length }));
  });

  it("insert lines inside selection", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 1],
      [[0], 3],
    ];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 2],
      fragment: [
        { children: [{ text: text }] },
        { children: [{ text: text2 }] },
      ],
    });

    const [before, after] = splitAt(docText, 2);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before }, { text }] },
        { children: [{ text: text2 }, { attr: 0, text: after }] },
      ],
    });
    expect(res[1]).toEqual(
      moveLine(moveOffset(sel, { focus: -before.length + text2.length }), {
        focus: 1,
      }),
    );
  });

  it("insert text with attr inside selection", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 1],
      [[0], 3],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 2],
      fragment: [{ children: [{ text, foo: "bar" }] }],
    });

    const [before, after] = splitAt(docText, 2);
    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: before },
            { text, foo: "bar" },
            { attr: 0, text: after },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, { focus: text.length }));
  });

  it("insert text with the same attr inside selection", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 1],
      [[0], 3],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 2],
      fragment: [{ children: [{ text, attr: 0 }] }],
    });

    const [before, after] = splitAt(docText, 2);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before + text + after }] },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, { focus: text.length }));
  });

  it("insert void inside selection", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 1],
      [[0], 3],
    ];
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 2],
      fragment: [{ children: [{ foo: "bar" }] }],
    });

    const [before, after] = splitAt(docText, 2);
    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: before },
            { foo: "bar" },
            { attr: 0, text: after },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, { focus: 1 }));
  });

  it("insert text after caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 3],
      fragment: [{ children: [{ text }] }],
    });

    const [before, after] = splitAt(docText, 3);
    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: before },
            { text },
            { attr: 0, text: after },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert lines after caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 3],
      fragment: [
        { children: [{ text: text }] },
        { children: [{ text: text2 }] },
      ],
    });

    const [before, after] = splitAt(docText, 3);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before }, { text }] },
        { children: [{ text: text2 }, { attr: 0, text: after }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert text with attr after caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 3],
      fragment: [{ children: [{ text, foo: "bar" }] }],
    });

    const [before, after] = splitAt(docText, 3);
    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: before },
            { text, foo: "bar" },
            { attr: 0, text: after },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert text with the same attr after caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 3],
      fragment: [{ children: [{ text, attr: 0 }] }],
    });

    const [before, after] = splitAt(docText, 3);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before + text + after }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert void after caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[0], 3],
      fragment: [{ children: [{ foo: "bar" }] }],
    });

    const [before, after] = splitAt(docText, 3);
    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: before },
            { foo: "bar" },
            { attr: 0, text: after },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert text at next line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[1], 1],
      fragment: [{ children: [{ text }] }],
    });

    const [before, after] = splitAt(docText2, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        {
          attr: 1,
          children: [
            { attr: 0, text: before },
            { text },
            { attr: 0, text: after },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert lines at next line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[1], 1],
      fragment: [
        { children: [{ text: text }] },
        { children: [{ text: text2 }] },
      ],
    });

    const [before, after] = splitAt(docText2, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: before }, { text: text }] },
        { children: [{ text: text2 }, { attr: 0, text: after }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert text with attr at next line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[1], 1],
      fragment: [{ children: [{ text, foo: "bar" }] }],
    });

    const [before, after] = splitAt(docText2, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        {
          attr: 1,
          children: [
            { attr: 0, text: before },
            { text, foo: "bar" },
            { attr: 0, text: after },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert text with the same attr at next line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[1], 1],
      fragment: [{ children: [{ text, attr: 0 }] }],
    });

    const [before, after] = splitAt(docText2, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: before + text + after }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert void at next line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: [[1], 1],
      fragment: [{ children: [{ foo: "bar" }] }],
    });

    const [before, after] = splitAt(docText2, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        {
          attr: 1,
          children: [
            { attr: 0, text: before },
            { foo: "bar" },
            { attr: 0, text: after },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });
});

describe("delete", () => {
  describe("validation", () => {
    it("path less than min", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 2],
        [[0], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "delete",
        start: [[-1], 0],
        end: [[0], 1],
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("path more than max", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 2],
        [[0], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "delete",
        start: [[0], 0],
        end: [[100], 1],
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("offset less than min", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 2],
        [[0], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "delete",
        start: [[0], -1],
        end: [[0], 1],
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("offset more than max", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 2],
        [[0], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "delete",
        start: [[0], 0],
        end: [[0], 100],
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("start and end is the same", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 2],
        [[0], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "delete",
        start: [[0], 1],
        end: [[0], 1],
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("start and end is inverted", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 2],
        [[0], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "delete",
        start: [[0], 2],
        end: [[0], 1],
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });
  });

  describe("expanded", () => {
    it("delete text around selection", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 2],
        [[0], 4],
      ];
      const res = applyOperation(doc, sel, {
        type: "delete",
        start: [[0], 1],
        end: [[0], 5],
      });

      expect(res[0]).toEqual({
        children: [
          { attr: 0, children: [{ attr: 0, text: deleteAt(docText, 1, 4) }] },
        ],
      });
      expect(res[1]).toEqual([
        [[0], 1],
        [[0], 1],
      ]);
    });

    it("delete text around selection anchor", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 2],
        [[0], 4],
      ];
      const res = applyOperation(doc, sel, {
        type: "delete",
        start: [[0], 1],
        end: [[0], 3],
      });

      expect(res[0]).toEqual({
        children: [
          { attr: 0, children: [{ attr: 0, text: deleteAt(docText, 1, 2) }] },
        ],
      });
      expect(res[1]).toEqual(moveOffset(sel, { anchor: 1 - 2, focus: -2 }));
    });

    it("delete text around selection focus", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 2],
        [[0], 4],
      ];
      const res = applyOperation(doc, sel, {
        type: "delete",
        start: [[0], 3],
        end: [[0], 5],
      });

      expect(res[0]).toEqual({
        children: [
          { attr: 0, children: [{ attr: 0, text: deleteAt(docText, 3, 2) }] },
        ],
      });
      expect(res[1]).toEqual(moveOffset(sel, { focus: 1 - 2 }));
    });

    it("delete line break inside selection", () => {
      const docText = "abcde";
      const docText2 = "fghij";
      const doc: Doc = {
        children: [
          { attr: 0, children: [{ attr: 0, text: docText }] },
          { attr: 1, children: [{ attr: 0, text: docText2 }] },
        ],
      };
      const sel: SelectionSnapshot = [
        [[0], 2],
        [[1], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "delete",
        start: [[0], 3],
        end: [[1], 1],
      });

      expect(res[0]).toEqual({
        children: [
          {
            attr: 0,
            children: [
              {
                attr: 0,
                text: splitAt(docText, 3)[0] + splitAt(docText2, 1)[1],
              },
            ],
          },
        ],
      });
      expect(res[1]).toEqual([
        [[0], 2],
        [[0], 3 + 1],
      ]);
    });
  });

  it("delete text at previous line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[1], 2],
      [[1], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[0], 1],
      end: [[0], 2],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: deleteAt(docText, 1, 1) }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("delete line break at previous line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[1], 3],
      [[1], 3],
    ];

    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[0], 2],
      end: [[1], 1],
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            {
              attr: 0,
              text:
                deleteAt(docText, 2, docText.length - 1) +
                deleteAt(docText2, 0, 1),
            },
          ],
        },
      ],
    });
    expect(res[1]).toEqual([
      [[0], 2 + (3 - 1)],
      [[0], 2 + (3 - 1)],
    ]);
  });

  it("delete lines at previous line", () => {
    const docText = "abcde";
    const docText2 = "fghi";
    const docText3 = "jkl";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
        { attr: 2, children: [{ attr: 0, text: docText3 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[2], 3],
      [[2], 3],
    ];
    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[0], 0],
      end: [[1], 2],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: deleteAt(docText2, 0, 2) }] },
        { attr: 2, children: [{ attr: 0, text: docText3 }] },
      ],
    });
    expect(res[1]).toEqual(moveLine(sel, -1));
  });

  it("delete text before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 3],
      [[0], 3],
    ];
    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[0], 1],
      end: [[0], 2],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: deleteAt(docText, 1, 1) }] },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, -1));
  });

  it("delete text just before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 3],
      [[0], 3],
    ];
    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[0], 2],
      end: [[0], 3],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: deleteAt(docText, 2, 1) }] },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, -1));
  });

  it("delete text around caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 3],
      [[0], 3],
    ];
    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[0], 2],
      end: [[0], 4],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: deleteAt(docText, 2, 2) }] },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, -1));
  });

  it("delete text just after caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 3],
      [[0], 3],
    ];
    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[0], 3],
      end: [[0], 4],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: deleteAt(docText, 3, 1) }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("delete text after caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 3],
      [[0], 3],
    ];
    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[0], 4],
      end: [[0], 5],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: deleteAt(docText, 4, 1) }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("delete text at next line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[1], 1],
      end: [[1], 2],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: deleteAt(docText2, 1, 1) }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("delete line break at next line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const docText3 = "klmno";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
        { attr: 2, children: [{ attr: 0, text: docText3 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[1], 1],
      end: [[2], 1],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        {
          attr: 1,
          children: [
            {
              attr: 0,
              text:
                deleteAt(docText2, 1, docText2.length - 1) +
                deleteAt(docText3, 0, 1),
            },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("delete lines at next line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const docText3 = "klmno";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
        { attr: 2, children: [{ attr: 0, text: docText3 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[1], 0],
      end: [[2], 1],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        {
          attr: 1,
          children: [
            {
              attr: 0,
              text: deleteAt(docText3, 0, 1),
            },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("delete text before caret at middle line", () => {
    const docText = "abcde";
    const docText2 = "fghi";
    const docText3 = "jkl";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
        { attr: 2, children: [{ attr: 0, text: docText3 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[1], 3],
      [[1], 3],
    ];
    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[1], 1],
      end: [[1], 2],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: deleteAt(docText2, 1, 1) }] },
        { attr: 2, children: [{ attr: 0, text: docText3 }] },
      ],
    });
    expect(res[1]).toEqual(moveOffset(sel, -1));
  });

  it("delete text after caret at middle line", () => {
    const docText = "abcde";
    const docText2 = "fghi";
    const docText3 = "jkl";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
        { attr: 2, children: [{ attr: 0, text: docText3 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[1], 2],
      [[1], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[1], 3],
      end: [[1], 4],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: deleteAt(docText2, 3, 1) }] },
        { attr: 2, children: [{ attr: 0, text: docText3 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("delete line break", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];

    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[0], docText.length],
      end: [[1], 0],
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            {
              attr: 0,
              text: docText + docText2,
            },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("delete empty line from the start", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: "" }] },
        { attr: 2, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];

    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[0], docText.length],
      end: [[1], 0],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 2, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("delete empty line from the end", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: "" }] },
        { attr: 2, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];

    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[1], 0],
      end: [[2], 0],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("delete forward at the edge of text node", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText },
            { attr: 1, text: docText2 },
          ],
        },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];

    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[0], docText.length],
      end: [[0], docText.length + 1],
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText },
            { attr: 1, text: docText2.slice(1) },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("delete backward at the edge of text node", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText },
            { attr: 1, text: docText2 },
          ],
        },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];

    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[0], docText.length - 1],
      end: [[0], docText.length],
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText.slice(0, -1) },
            { attr: 1, text: docText2 },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("delete line break at the edge of text node", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 2, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];

    const res = applyOperation(doc, sel, {
      type: "delete",
      start: [[0], docText.length],
      end: [[1], 0],
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            {
              attr: 0,
              text: docText,
            },
            {
              attr: 2,
              text: docText2,
            },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });
});

describe("format", () => {
  describe("validation", () => {
    it("path less than min", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 2],
        [[0], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "set_attr",
        start: [[-1], 0],
        end: [[0], 1],
        key: "foo",
        value: "bar",
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("path more than max", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 2],
        [[0], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "set_attr",
        start: [[0], 0],
        end: [[100], 1],
        key: "foo",
        value: "bar",
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("offset less than min", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 2],
        [[0], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "set_attr",
        start: [[0], -1],
        end: [[0], 1],
        key: "foo",
        value: "bar",
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("offset more than max", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 2],
        [[0], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "set_attr",
        start: [[0], 0],
        end: [[0], 100],
        key: "foo",
        value: "bar",
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("start and end is the same", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 2],
        [[0], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "set_attr",
        start: [[0], 1],
        end: [[0], 1],
        key: "foo",
        value: "bar",
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("start and end is inverted", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 2],
        [[0], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "set_attr",
        start: [[0], 2],
        end: [[0], 1],
        key: "foo",
        value: "bar",
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });
  });

  it("update text at previous line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[1], 2],
      [[1], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "set_attr",
      start: [[0], 1],
      end: [[0], 2],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText.slice(0, 1) },
            { attr: 0, text: docText.slice(1, 2), foo: "bar" },
            { attr: 0, text: docText.slice(2) },
          ],
        },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update line break at previous line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[1], 3],
      [[1], 3],
    ];

    const res = applyOperation(doc, sel, {
      type: "set_attr",
      start: [[0], 2],
      end: [[1], 1],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText.slice(0, 2) },
            { attr: 0, text: docText.slice(2), foo: "bar" },
          ],
        },
        {
          attr: 1,
          children: [
            { attr: 0, text: docText2.slice(0, 1), foo: "bar" },
            { attr: 0, text: docText2.slice(1) },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update text before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 3],
      [[0], 3],
    ];
    const res = applyOperation(doc, sel, {
      type: "set_attr",
      start: [[0], 1],
      end: [[0], 2],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText.slice(0, 1) },
            { attr: 0, text: docText.slice(1, 2), foo: "bar" },
            { attr: 0, text: docText.slice(2) },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update text just before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 3],
      [[0], 3],
    ];
    const res = applyOperation(doc, sel, {
      type: "set_attr",
      start: [[0], 2],
      end: [[0], 3],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText.slice(0, 2) },
            { attr: 0, text: docText.slice(2, 3), foo: "bar" },
            { attr: 0, text: docText.slice(3) },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update line break inside selection", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[1], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "set_attr",
      start: [[0], 3],
      end: [[1], 1],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText.slice(0, 3) },
            { attr: 0, text: docText.slice(3), foo: "bar" },
          ],
        },
        {
          attr: 1,
          children: [
            { attr: 0, text: docText2.slice(0, 1), foo: "bar" },
            { attr: 0, text: docText2.slice(1) },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update text just after caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 3],
      [[0], 3],
    ];
    const res = applyOperation(doc, sel, {
      type: "set_attr",
      start: [[0], 3],
      end: [[0], 4],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText.slice(0, 3) },
            { attr: 0, text: docText.slice(3, 4), foo: "bar" },
            { attr: 0, text: docText.slice(4) },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update text after caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: SelectionSnapshot = [
      [[0], 3],
      [[0], 3],
    ];
    const res = applyOperation(doc, sel, {
      type: "set_attr",
      start: [[0], 4],
      end: [[0], 5],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText.slice(0, 4) },
            { attr: 0, text: docText.slice(4, 5), foo: "bar" },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update text at next line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "set_attr",
      start: [[1], 1],
      end: [[1], 2],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        {
          attr: 1,
          children: [
            { attr: 0, text: docText2.slice(0, 1) },
            { attr: 0, text: docText2.slice(1, 2), foo: "bar" },
            { attr: 0, text: docText2.slice(2) },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update line break at next line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const docText3 = "klmno";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
        { attr: 2, children: [{ attr: 0, text: docText3 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[0], 2],
      [[0], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "set_attr",
      start: [[1], 1],
      end: [[2], 1],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        {
          attr: 1,
          children: [
            { attr: 0, text: docText2.slice(0, 1) },
            { attr: 0, text: docText2.slice(1), foo: "bar" },
          ],
        },
        {
          attr: 2,
          children: [
            { attr: 0, text: docText3.slice(0, 1), foo: "bar" },
            { attr: 0, text: docText3.slice(1) },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });
});

describe("set attr", () => {
  describe("validation", () => {
    it("path less than min", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 2],
        [[0], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "set_node_attr",
        path: [-1],
        key: "foo",
        value: "bar",
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("path more than max", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: SelectionSnapshot = [
        [[0], 2],
        [[0], 2],
      ];
      const res = applyOperation(doc, sel, {
        type: "set_node_attr",
        path: [100],
        key: "foo",
        value: "bar",
      });

      expect(is(res[0], doc)).toBe(true);
      expect(res[1]).toEqual(sel);
    });
  });

  it("update block node at start", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[1], 2],
      [[1], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "set_node_attr",
      path: [0],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, foo: "bar", children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update block node at end", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: SelectionSnapshot = [
      [[1], 2],
      [[1], 2],
    ];
    const res = applyOperation(doc, sel, {
      type: "set_node_attr",
      path: [1],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, foo: "bar", children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });
});

describe(isValidSelection.name, () => {
  it("path less than min", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    expect(
      isValidSelection(doc, [
        [[-1], 0],
        [[0], 1],
      ]),
    ).toBe(false);
  });

  it("path more than max", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    expect(
      isValidSelection(doc, [
        [[0], 0],
        [[100], 1],
      ]),
    ).toBe(false);
  });

  it("offset less than min", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    expect(
      isValidSelection(doc, [
        [[0], -1],
        [[0], 1],
      ]),
    ).toBe(false);
  });

  it("offset more than max", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    expect(
      isValidSelection(doc, [
        [[0], 0],
        [[0], 100],
      ]),
    ).toBe(false);
  });

  it("should select cursor", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    expect(
      isValidSelection(doc, [
        [[0], 1],
        [[0], 1],
      ]),
    ).toBe(true);
  });

  it("should select text at line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const docText3 = "klmno";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
        { attr: 1, children: [{ attr: 0, text: docText3 }] },
      ],
    };
    expect(
      isValidSelection(doc, [
        [[1], 1],
        [[2], 1],
      ]),
    ).toBe(true);
  });

  it("should select line break", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    expect(
      isValidSelection(doc, [
        [[0], 2],
        [[1], 1],
      ]),
    ).toBe(true);
  });

  it("should select all", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    expect(
      isValidSelection(doc, [
        [[0], 0],
        [
          [doc.children.length - 1],
          doc.children[doc.children.length - 1]!.children[0]!.text.length - 1,
        ],
      ]),
    ).toBe(true);
  });
});
