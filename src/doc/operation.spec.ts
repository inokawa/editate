import { describe, expect, it } from "vitest";
import {
  applyOperation,
  invertOperation,
  isValidSelection,
  mapPosition,
  type Operation,
} from "./operation.js";
import { type DocNode, type Selection } from "./types.js";
import { getNodeSize } from "./node.js";

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

it("discard if error", () => {
  const docText = "abcde";
  const docText2 = "fghij";
  const doc: Doc = {
    children: [
      { attr: 0, children: [{ attr: 0, text: docText }] },
      { attr: 1, children: [{ attr: 0, text: docText2 }] },
    ],
  };
  const sel: Selection = [2, 2];

  expect(() =>
    applyOperation(doc, sel, { type: "insert_node", at: 0 } as any),
  ).toThrow();
});

describe("insert text", () => {
  describe("validation", () => {
    it("offset less than min", () => {
      const docText = "abcde";
      const docText2 = "fghij";
      const doc: Doc = {
        children: [
          { attr: 0, children: [{ attr: 0, text: docText }] },
          { attr: 1, children: [{ attr: 0, text: docText2 }] },
        ],
      };
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "insert_text",
        at: -1,
        text: "test",
      });

      expect(res[0] === doc).toBe(true);
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
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "insert_text",
        at: 100,
        text: "test",
      });

      expect(res[0] === doc).toBe(true);
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
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "insert_text",
        at: 1,
        text: "",
      });

      expect(res[0] === doc).toBe(true);
      expect(res[1]).toEqual(sel);
    });
  });

  describe("expanded", () => {
    it("insert text inside selection", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: Selection = [1, 3];
      const text = "ABC";
      const res = applyOperation(doc, sel, {
        type: "insert_text",
        at: 2,
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
      expect(res[1]).toEqual([sel[0], sel[1] + text.length]);
    });

    it("insert line break inside selection", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: Selection = [1, 3];
      const res = applyOperation(doc, sel, {
        type: "insert_text",
        at: 2,
        text: "\n",
      });

      const [before, after] = splitAt(docText, 2);
      expect(res[0]).toEqual({
        children: [
          { attr: 0, children: [{ attr: 0, text: before }] },
          { attr: 0, children: [{ attr: 0, text: after }] },
        ],
      });
      expect(res[1]).toEqual([sel[0], sel[1] + 1]);
    });

    it("insert lines inside selection", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: Selection = [1, 3];
      const text = "ABC";
      const text2 = "DEFG";
      const insertedText = text + "\n" + text2;
      const res = applyOperation(doc, sel, {
        type: "insert_text",
        at: 2,
        text: insertedText,
      });

      const [before, after] = splitAt(docText, 2);
      expect(res[0]).toEqual({
        children: [
          { attr: 0, children: [{ attr: 0, text: before + text }] },
          { attr: 0, children: [{ attr: 0, text: text2 + after }] },
        ],
      });
      expect(res[1]).toEqual([sel[0], sel[1] + insertedText.length]);
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
    const sel: Selection = [docText.length + 1 + 2, docText.length + 1 + 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: 1,
      text: text,
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: insertAt(docText, 1, text) }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual([sel[0] + text.length, sel[1] + text.length]);
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
    const sel: Selection = [docText.length + 1 + 2, docText.length + 1 + 2];
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: 1,
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
    expect(res[1]).toEqual([sel[0] + 1, sel[1] + 1]);
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
    const sel: Selection = [docText.length + 1 + 2, docText.length + 1 + 2];
    const text = "ABC";
    const text2 = "DEFG";
    const insertedText = text + "\n" + text2;
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: 1,
      text: insertedText,
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before + text }] },
        { attr: 0, children: [{ attr: 0, text: text2 + after }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual([
      sel[0] + insertedText.length,
      sel[1] + insertedText.length,
    ]);
  });

  it("insert text before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: 1,
      text: text,
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: insertAt(docText, 1, text) }] },
      ],
    });
    expect(res[1]).toEqual([sel[0] + text.length, sel[1] + text.length]);
  });

  it("insert line break before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: 1,
      text: "\n",
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before }] },
        { attr: 0, children: [{ attr: 0, text: after }] },
      ],
    });
    expect(res[1]).toEqual([sel[0] + 1, sel[1] + 1]);
  });

  it("insert lines before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const text2 = "DEFG";
    const insertedText = text + "\n" + text2;
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: 1,
      text: insertedText,
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before + text }] },
        { attr: 0, children: [{ attr: 0, text: text2 + after }] },
      ],
    });
    expect(res[1]).toEqual([
      sel[0] + insertedText.length,
      sel[1] + insertedText.length,
    ]);
  });

  it("insert text on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: 2,
      text: text,
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: insertAt(docText, 2, text) }] },
      ],
    });
    expect(res[1]).toEqual([sel[0] + text.length, sel[1] + text.length]);
  });

  it("insert line break on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: 2,
      text: "\n",
    });

    const [before, after] = splitAt(docText, 2);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before }] },
        { attr: 0, children: [{ attr: 0, text: after }] },
      ],
    });
    expect(res[1]).toEqual([sel[0] + 1, sel[1] + 1]);
  });

  it("insert lines on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const text2 = "DEFG";
    const insertedText = text + "\n" + text2;
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: 2,
      text: insertedText,
    });

    const [before, after] = splitAt(docText, 2);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before + text }] },
        { attr: 0, children: [{ attr: 0, text: text2 + after }] },
      ],
    });
    expect(res[1]).toEqual([
      sel[0] + insertedText.length,
      sel[1] + insertedText.length,
    ]);
  });

  it("insert three lines on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const text2 = "DEF";
    const text3 = "GHI";
    const insertedText = text + "\n" + text2 + "\n" + text3;
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: 2,
      text: insertedText,
    });

    const [before, after] = splitAt(docText, 2);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before + text }] },
        { attr: 0, children: [{ attr: 0, text: text2 }] },
        { attr: 0, children: [{ attr: 0, text: text3 + after }] },
      ],
    });
    expect(res[1]).toEqual([
      sel[0] + insertedText.length,
      sel[1] + insertedText.length,
    ]);
  });

  it("insert text after caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: 3,
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
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: 3,
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
    const sel: Selection = [2, 2];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: 3,
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
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: docText.length + 1 + 1,
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
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: docText.length + 1 + 1,
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
    const sel: Selection = [2, 2];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: docText.length + 1 + 1,
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
    const sel: Selection = [docText.length + 1 + 2, docText.length + 1 + 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: docText.length + 1 + 1,
      text: text,
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: insertAt(docText2, 1, text) }] },
        { attr: 2, children: [{ attr: 0, text: docText3 }] },
      ],
    });
    expect(res[1]).toEqual([sel[0] + text.length, sel[1] + text.length]);
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
    const sel: Selection = [docText.length + 1 + 2, docText.length + 1 + 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: docText.length + 1 + 3,
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
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: docText.length + 1,
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
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: docText.length + 1 + 1,
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
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: docText.length,
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

  it("insert text at document start", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: 0,
      text: text,
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: insertAt(docText, 0, text) }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual([sel[0] + text.length, sel[1] + text.length]);
  });

  it("insert text at document end", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: getNodeSize(doc),
      text: text,
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 + text }] },
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
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: docText.length,
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
    const sel: Selection = [2, 2];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: docText.length,
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
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: docText.length,
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

  it("insert text at empty line", () => {
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: "" }] }],
    };
    const sel: Selection = [0, 0];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: 0,
      text: text,
    });

    expect(res[0]).toEqual({
      children: [{ attr: 0, children: [{ attr: 0, text: text }] }],
    });
    expect(res[1]).toEqual([sel[0] + text.length, sel[1] + text.length]);
  });

  it("insert text after void", () => {
    const docText = "abcde";
    const doc = {
      children: [
        {
          attr: 0,
          children: [{ attr: 0, text: docText }, { foo: "bar" }],
        },
      ],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_text",
      at: docText.length + 1,
      text: text,
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText },
            { foo: "bar" },
            { text: text },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  describe("single line document", () => {
    it("insert text on caret", () => {
      const docText = "abcde";
      const doc = { attr: 0, children: [{ attr: 0, text: docText }] };
      const sel: Selection = [2, 2];
      const text = "ABC";
      const res = applyOperation(doc, sel, {
        type: "insert_text",
        at: 2,
        text: text,
      });

      expect(res[0]).toEqual({
        attr: 0,
        children: [{ attr: 0, text: insertAt(docText, 2, text) }],
      });
      expect(res[1]).toEqual([sel[0] + text.length, sel[1] + text.length]);
    });
  });
});

describe("insert node", () => {
  describe("validation", () => {
    it("offset less than min", () => {
      const docText = "abcde";
      const docText2 = "fghij";
      const doc: Doc = {
        children: [
          { attr: 0, children: [{ attr: 0, text: docText }] },
          { attr: 1, children: [{ attr: 0, text: docText2 }] },
        ],
      };
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "insert_node",
        at: -1,
        fragment: [{ children: [{ text: "test" }] }],
      });

      expect(res[0] === doc).toBe(true);
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
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "insert_node",
        at: 100,
        fragment: [{ children: [{ text: "test" }] }],
      });

      expect(res[0] === doc).toBe(true);
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
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "insert_node",
        at: 1,
        fragment: [],
      });

      expect(res[0] === doc).toBe(true);
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
    const sel: Selection = [docText.length + 1 + 2, docText.length + 1 + 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 1,
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
    expect(res[1]).toEqual([sel[0] + text.length, sel[1] + text.length]);
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
    const sel: Selection = [docText.length + 1 + 2, docText.length + 1 + 2];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 1,
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
    expect(res[1]).toEqual([
      sel[0] + text.length + 1 + text2.length,
      sel[1] + text.length + 1 + text2.length,
    ]);
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
    const sel: Selection = [docText.length + 1 + 2, docText.length + 1 + 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 1,
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
    expect(res[1]).toEqual([sel[0] + text.length, sel[1] + text.length]);
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
    const sel: Selection = [docText.length + 1 + 2, docText.length + 1 + 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 1,
      fragment: [{ children: [{ text, attr: 0 }] }],
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before + text + after }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual([sel[0] + text.length, sel[1] + text.length]);
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
    const sel: Selection = [docText.length + 1 + 2, docText.length + 1 + 2];
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 1,
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
    expect(res[1]).toEqual([sel[0] + 1, sel[1] + 1]);
  });

  it("insert text before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 1,
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
    expect(res[1]).toEqual([sel[0] + text.length, sel[1] + text.length]);
  });

  it("insert lines before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 1,
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
    expect(res[1]).toEqual([
      sel[0] + text.length + 1 + text2.length,
      sel[1] + text.length + 1 + text2.length,
    ]);
  });

  it("insert text with attr before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 1,
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
    expect(res[1]).toEqual([sel[0] + text.length, sel[1] + text.length]);
  });

  it("insert text with the same attr before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 1,
      fragment: [{ children: [{ text, attr: 0 }] }],
    });

    const [before, after] = splitAt(docText, 1);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before + text + after }] },
      ],
    });
    expect(res[1]).toEqual([sel[0] + text.length, sel[1] + text.length]);
  });

  it("insert void before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 1,
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
    expect(res[1]).toEqual([sel[0] + 1, sel[1] + 1]);
  });

  it("insert text on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 2,
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
    expect(res[1]).toEqual([sel[0] + text.length, sel[1] + text.length]);
  });

  it("insert lines on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 2,
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
    expect(res[1]).toEqual([
      sel[0] + text.length + 1 + text2.length,
      sel[1] + text.length + 1 + text2.length,
    ]);
  });

  it("insert text with attr on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 2,
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
    expect(res[1]).toEqual([sel[0] + text.length, sel[1] + text.length]);
  });

  it("insert text with the same attr on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 2,
      fragment: [{ children: [{ text, attr: 0 }] }],
    });

    const [before, after] = splitAt(docText, 2);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before + text + after }] },
      ],
    });
    expect(res[1]).toEqual([sel[0] + text.length, sel[1] + text.length]);
  });

  it("insert void on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 2,
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
    expect(res[1]).toEqual([sel[0] + 1, sel[1] + 1]);
  });

  it("insert text without block on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 2,
      fragment: [{ text }],
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
    expect(res[1]).toEqual([sel[0] + text.length, sel[1] + text.length]);
  });

  it("insert text inside selection", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [1, 3];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 2,
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
    expect(res[1]).toEqual([sel[0], sel[1] + text.length]);
  });

  it("insert lines inside selection", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [1, 3];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 2,
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
    expect(res[1]).toEqual([sel[0], sel[1] + text.length + 1 + text2.length]);
  });

  it("insert text with attr inside selection", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [1, 3];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 2,
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
    expect(res[1]).toEqual([sel[0], sel[1] + text.length]);
  });

  it("insert text with the same attr inside selection", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [1, 3];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 2,
      fragment: [{ children: [{ text, attr: 0 }] }],
    });

    const [before, after] = splitAt(docText, 2);
    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: before + text + after }] },
      ],
    });
    expect(res[1]).toEqual([sel[0], sel[1] + text.length]);
  });

  it("insert void inside selection", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [1, 3];
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 2,
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
    expect(res[1]).toEqual([sel[0], sel[1] + 1]);
  });

  it("insert text after caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 3,
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
    const sel: Selection = [2, 2];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 3,
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
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 3,
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
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 3,
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
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 3,
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
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: docText.length + 1 + 1,
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
    const sel: Selection = [2, 2];
    const text = "ABC";
    const text2 = "DEFG";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: docText.length + 1 + 1,
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
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: docText.length + 1 + 1,
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
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: docText.length + 1 + 1,
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
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: docText.length + 1 + 1,
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

  it("insert void at start of line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: docText.length + 1,
      fragment: [{ children: [{ foo: "bar" }] }],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        {
          attr: 1,
          children: [{ foo: "bar" }, { attr: 0, text: docText2 }],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert text at document end", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: Selection = [2, 2];
    const text = "ABC";
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: getNodeSize(doc),
      fragment: [{ children: [{ text }] }],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }, { text }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("insert text at empty line", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: "" }] }],
    };
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 0,
      fragment: [{ children: [{ text: docText }] }],
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [{ text: docText }],
        },
      ],
    });
    expect(res[1]).toEqual([sel[0] + docText.length, sel[1] + docText.length]);
  });

  it("insert void at empty line", () => {
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: "" }] }],
    };
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 0,
      fragment: [{ children: [{ foo: "bar" }] }],
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [{ foo: "bar" }],
        },
      ],
    });
    expect(res[1]).toEqual([sel[0] + 1, sel[1] + 1]);
  });

  it("insert texts with the same attr on caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [1, 1];
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: 1,
      fragment: [
        {
          children: [
            { text: "x", foo: "bar" },
            { text: "y", foo: "bar" },
          ],
        },
      ],
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: "a" },
            { text: "xy", foo: "bar" },
            { attr: 0, text: "bcde" },
          ],
        },
      ],
    });
    expect(res[1]).toEqual([sel[0] + 2, sel[1] + 2]);
  });

  it("insert empty line at empty line", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 1, text: "" }] },
      ],
    };
    const sel: Selection = [docText.length + 1, docText.length + 1];
    const res = applyOperation(doc, sel, {
      type: "insert_node",
      at: docText.length + 1,
      fragment: [{ children: [{ text: "" }] }],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ text: "" }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  describe("single line document", () => {
    it("insert void on caret", () => {
      const docText = "abcde";
      const doc = { attr: 0, children: [{ attr: 0, text: docText }] };
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "insert_node",
        at: 2,
        fragment: [{ children: [{ foo: "bar" }] }],
      });

      const [before, after] = splitAt(docText, 2);
      expect(res[0]).toEqual({
        attr: 0,
        children: [
          { attr: 0, text: before },
          { foo: "bar" },
          { attr: 0, text: after },
        ],
      });
      expect(res[1]).toEqual([sel[0] + 1, sel[1] + 1]);
    });
  });
});

describe("delete", () => {
  describe("validation", () => {
    it("offset less than min", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "delete",
        range: [-1, 1],
      });

      expect(res[0] === doc).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("offset more than max", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "delete",
        range: [0, 100],
      });

      expect(res[0] === doc).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("start and end is the same", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "delete",
        range: [1, 1],
      });

      expect(res[0] === doc).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("start and end is inverted", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "delete",
        range: [2, 1],
      });

      expect(res[0] === doc).toBe(true);
      expect(res[1]).toEqual(sel);
    });
  });

  describe("expanded", () => {
    it("delete text around selection", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: Selection = [2, 4];
      const res = applyOperation(doc, sel, {
        type: "delete",
        range: [1, 5],
      });

      expect(res[0]).toEqual({
        children: [
          { attr: 0, children: [{ attr: 0, text: deleteAt(docText, 1, 4) }] },
        ],
      });
      expect(res[1]).toEqual([1, 1]);
    });

    it("delete text around selection anchor", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: Selection = [2, 4];
      const res = applyOperation(doc, sel, {
        type: "delete",
        range: [1, 3],
      });

      expect(res[0]).toEqual({
        children: [
          { attr: 0, children: [{ attr: 0, text: deleteAt(docText, 1, 2) }] },
        ],
      });
      expect(res[1]).toEqual([sel[0] + 1 - 2, sel[1] - 2]);
    });

    it("delete text around selection focus", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: Selection = [2, 4];
      const res = applyOperation(doc, sel, {
        type: "delete",
        range: [3, 5],
      });

      expect(res[0]).toEqual({
        children: [
          { attr: 0, children: [{ attr: 0, text: deleteAt(docText, 3, 2) }] },
        ],
      });
      expect(res[1]).toEqual([sel[0], sel[1] + 1 - 2]);
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
      const sel: Selection = [2, docText.length + 1 + 2];
      const res = applyOperation(doc, sel, {
        type: "delete",
        range: [3, docText.length + 1 + 1],
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
      expect(res[1]).toEqual([2, 3 + 1]);
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
    const sel: Selection = [docText.length + 1 + 2, docText.length + 1 + 2];
    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [1, 2],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: deleteAt(docText, 1, 1) }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual([sel[0] - 1, sel[1] - 1]);
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
    const sel: Selection = [docText.length + 1 + 3, docText.length + 1 + 3];

    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [2, docText.length + 1 + 1],
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
    expect(res[1]).toEqual([2 + (3 - 1), 2 + (3 - 1)]);
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
    const sel: Selection = [
      docText.length + 1 + docText2.length + 1 + 3,
      docText.length + 1 + docText2.length + 1 + 3,
    ];
    const deleteLength = docText.length + 1 + 2;
    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [0, deleteLength],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: deleteAt(docText2, 0, 2) }] },
        { attr: 2, children: [{ attr: 0, text: docText3 }] },
      ],
    });
    expect(res[1]).toEqual([sel[0] - deleteLength, sel[1] - deleteLength]);
  });

  it("delete text before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [3, 3];
    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [1, 2],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: deleteAt(docText, 1, 1) }] },
      ],
    });
    expect(res[1]).toEqual([sel[0] + -1, sel[1] + -1]);
  });

  it("delete text just before caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [3, 3];
    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [2, 3],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: deleteAt(docText, 2, 1) }] },
      ],
    });
    expect(res[1]).toEqual([sel[0] + -1, sel[1] + -1]);
  });

  it("delete text around caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [3, 3];
    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [2, 4],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: deleteAt(docText, 2, 2) }] },
      ],
    });
    expect(res[1]).toEqual([sel[0] + -1, sel[1] + -1]);
  });

  it("delete text just after caret", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [3, 3];
    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [3, 4],
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
    const sel: Selection = [3, 3];
    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [4, 5],
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
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [docText.length + 1 + 1, docText.length + 1 + 2],
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
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [
        docText.length + 1 + 1,
        docText.length + 1 + docText2.length + 1 + 1,
      ],
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
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [docText.length + 1, docText.length + 1 + docText2.length + 1 + 1],
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
    const sel: Selection = [docText.length + 1 + 3, docText.length + 1 + 3];
    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [docText.length + 1 + 1, docText.length + 1 + 2],
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: deleteAt(docText2, 1, 1) }] },
        { attr: 2, children: [{ attr: 0, text: docText3 }] },
      ],
    });
    expect(res[1]).toEqual([sel[0] + -1, sel[1] + -1]);
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
    const sel: Selection = [docText.length + 1 + 2, docText.length + 1 + 2];
    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [docText.length + 1 + 3, docText.length + 1 + 4],
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

  it("delete void", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc = {
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText },
            { foo: "bar" },
            { attr: 0, text: docText2 },
          ],
        },
      ],
    };
    const sel: Selection = [2, 2];

    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [docText.length, docText.length + 1],
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

  it("delete text with attr", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc = {
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
    const sel: Selection = [2, 2];

    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [docText.length - 1, docText.length + 1],
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText.slice(0, -1) },
            { attr: 1, text: docText2.slice(1) },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("delete merges adjacent same-attr text nodes", () => {
    const doc: Doc = {
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: "ab" },
            { attr: 1, text: "cd" },
            { attr: 0, text: "ef" },
          ],
        },
      ],
    };
    const sel: Selection = [1, 1];
    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [2, 4],
    });

    expect(res[0]).toEqual({
      children: [{ attr: 0, children: [{ attr: 0, text: "abef" }] }],
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
    const sel: Selection = [2, 2];

    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [docText.length, docText.length + 1],
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

  it("delete text to empty line", () => {
    const docText = "abcde";
    const doc = {
      children: [
        {
          attr: 0,
          children: [{ attr: 0, text: docText }],
        },
      ],
    };
    const sel: Selection = [0, docText.length];

    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [0, docText.length],
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [{ attr: 0, text: "" }],
        },
      ],
    });
    expect(res[1]).toEqual([0, 0]);
  });

  it("delete void to empty line", () => {
    const doc = {
      children: [
        {
          attr: 0,
          children: [{ foo: "bar" }],
        },
      ],
    };
    const sel: Selection = [0, 1];

    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [0, 1],
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [{ text: "" }],
        },
      ],
    });
    expect(res[1]).toEqual([0, 0]);
  });

  it("delete lines to empty line", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: Selection = [0, getNodeSize(doc)];
    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [0, getNodeSize(doc)],
    });

    expect(res[0]).toEqual({
      children: [{ attr: 0, children: [{ attr: 0, text: "" }] }],
    });
    expect(res[1]).toEqual([0, 0]);
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
    const sel: Selection = [2, 2];

    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [docText.length, docText.length + 1],
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
    const sel: Selection = [2, 2];

    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [docText.length + 1, docText.length + 2],
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
    const sel: Selection = [2, 2];

    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [docText.length, docText.length + 1],
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
    const sel: Selection = [2, 2];

    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [docText.length - 1, docText.length],
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
    const sel: Selection = [2, 2];

    const res = applyOperation(doc, sel, {
      type: "delete",
      range: [docText.length, docText.length + 1],
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

  describe("single line document", () => {
    it("delete text before caret", () => {
      const docText = "abcde";
      const doc = { attr: 0, children: [{ attr: 0, text: docText }] };
      const sel: Selection = [3, 3];
      const res = applyOperation(doc, sel, {
        type: "delete",
        range: [1, 2],
      });

      expect(res[0]).toEqual({
        attr: 0,
        children: [{ attr: 0, text: deleteAt(docText, 1, 1) }],
      });
      expect(res[1]).toEqual([sel[0] + -1, sel[1] + -1]);
    });

    it("delete text just before caret", () => {
      const docText = "abcde";
      const doc = { attr: 0, children: [{ attr: 0, text: docText }] };
      const sel: Selection = [3, 3];
      const res = applyOperation(doc, sel, {
        type: "delete",
        range: [2, 3],
      });

      expect(res[0]).toEqual({
        attr: 0,
        children: [{ attr: 0, text: deleteAt(docText, 2, 1) }],
      });
      expect(res[1]).toEqual([sel[0] + -1, sel[1] + -1]);
    });

    it("delete text around caret", () => {
      const docText = "abcde";
      const doc = { attr: 0, children: [{ attr: 0, text: docText }] };
      const sel: Selection = [3, 3];
      const res = applyOperation(doc, sel, {
        type: "delete",
        range: [2, 4],
      });

      expect(res[0]).toEqual({
        attr: 0,
        children: [{ attr: 0, text: deleteAt(docText, 2, 2) }],
      });
      expect(res[1]).toEqual([sel[0] + -1, sel[1] + -1]);
    });

    it("delete text just after caret", () => {
      const docText = "abcde";
      const doc = { attr: 0, children: [{ attr: 0, text: docText }] };
      const sel: Selection = [3, 3];
      const res = applyOperation(doc, sel, {
        type: "delete",
        range: [3, 4],
      });

      expect(res[0]).toEqual({
        attr: 0,
        children: [{ attr: 0, text: deleteAt(docText, 3, 1) }],
      });
      expect(res[1]).toEqual(sel);
    });

    it("delete text after caret", () => {
      const docText = "abcde";
      const doc = { attr: 0, children: [{ attr: 0, text: docText }] };
      const sel: Selection = [3, 3];
      const res = applyOperation(doc, sel, {
        type: "delete",
        range: [4, 5],
      });

      expect(res[0]).toEqual({
        attr: 0,
        children: [{ attr: 0, text: deleteAt(docText, 4, 1) }],
      });
      expect(res[1]).toEqual(sel);
    });

    it("delete across multiple text nodes", () => {
      const doc = {
        attr: 0,
        children: [
          { attr: 0, text: "ab" },
          { attr: 1, text: "cd" },
          { attr: 0, text: "ef" },
        ],
      };
      const sel: Selection = [1, 1];
      const res = applyOperation(doc, sel, {
        type: "delete",
        range: [2, 4],
      });

      expect(res[0]).toEqual({
        attr: 0,
        children: [{ attr: 0, text: "abef" }],
      });
      expect(res[1]).toEqual(sel);
    });

    it("delete text to empty line", () => {
      const docText = "abcde";
      const doc = { attr: 0, children: [{ attr: 0, text: docText }] };
      const sel: Selection = [0, docText.length];
      const res = applyOperation(doc, sel, {
        type: "delete",
        range: [0, docText.length],
      });

      expect(res[0]).toEqual({
        attr: 0,
        children: [{ attr: 0, text: "" }],
      });
      expect(res[1]).toEqual([0, 0]);
    });
  });
});

describe("format", () => {
  describe("validation", () => {
    it("offset less than min", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "format",
        range: [-1, 1],
        key: "foo",
        value: "bar",
      });

      expect(res[0] === doc).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("offset more than max", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "format",
        range: [0, 100],
        key: "foo",
        value: "bar",
      });

      expect(res[0] === doc).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("start and end is the same", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "format",
        range: [1, 1],
        key: "foo",
        value: "bar",
      });

      expect(res[0] === doc).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("start and end is inverted", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "format",
        range: [2, 1],
        key: "foo",
        value: "bar",
      });

      expect(res[0] === doc).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("format text of text node", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "format",
        range: [1, 3],
        key: "text",
        value: "XYZ",
      });

      expect(res[0] === doc).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("format children of block node", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "format",
        range: [1, 1],
        key: "children",
        value: [{ text: "xy" }],
        depth: -2,
      });

      expect(res[0] === doc).toBe(true);
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
    const sel: Selection = [docText.length + 1 + 2, docText.length + 1 + 2];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [1, 2],
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
    const sel: Selection = [docText.length + 1 + 3, docText.length + 1 + 3];

    const res = applyOperation(doc, sel, {
      type: "format",
      range: [2, docText.length + 1 + 1],
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
    const sel: Selection = [3, 3];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [1, 2],
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
    const sel: Selection = [3, 3];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [2, 3],
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
    const sel: Selection = [2, docText.length + 1 + 2];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [3, docText.length + 1 + 1],
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
    const sel: Selection = [3, 3];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [3, 4],
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
    const sel: Selection = [3, 3];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [4, 5],
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

  it("update entire line", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [0, docText.length],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText, foo: "bar" }] },
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
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [docText.length + 1 + 1, docText.length + 1 + 2],
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
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [
        docText.length + 1 + 1,
        docText.length + 1 + docText2.length + 1 + 1,
      ],
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

  it("update lines", () => {
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
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [2, docText.length + 1 + docText2.length + 1 + 3],
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
        { attr: 1, children: [{ attr: 0, text: docText2, foo: "bar" }] },
        {
          attr: 2,
          children: [
            { attr: 0, text: docText3.slice(0, 3), foo: "bar" },
            { attr: 0, text: docText3.slice(3) },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update text with collapsed range", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: Selection = [3, 3];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [1, 1],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [{ attr: 0, text: docText }],
        },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update text with collapsed range at the edge of text node", () => {
    const doc: Doc = {
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: "ab" },
            { attr: 1, text: "cd" },
          ],
        },
      ],
    };
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [2, 2],
      key: "foo",
      value: "bar",
    });

    expect(res[0] === doc).toBe(true);
    expect(res[1]).toEqual(sel);
  });

  it("update empty text with collapsed range", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: "" }] },
        { attr: 2, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: Selection = [3, 3];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [docText.length + 1, docText.length + 1],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: "", foo: "bar" }] },
        { attr: 2, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update empty text with expanded range", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: "" }] },
        { attr: 2, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: Selection = [3, 3];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [docText.length + 1, docText.length + 2],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: "", foo: "bar" }] },
        { attr: 2, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update void with collapsed range", () => {
    const doc = {
      children: [{ attr: 0, children: [{ foo: "bar" }] }],
    };
    const sel: Selection = [0, 0];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [0, 0],
      key: "mark",
      value: true,
    });

    expect(res[0] === doc).toBe(true);
    expect(res[1]).toEqual(sel);
  });

  it("update void with expanded range", () => {
    const doc = {
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: "ab" },
            { foo: "bar" },
            { attr: 0, text: "cd" },
          ],
        },
      ],
    };
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [0, 5],
      key: "mark",
      value: true,
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: "ab", mark: true },
            { foo: "bar", mark: true },
            { attr: 0, text: "cd", mark: true },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update the empty text the range ends at", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: "" }] },
      ],
    };
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [1, docText.length + 1],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: "a" },
            { attr: 0, text: "bcde", foo: "bar" },
          ],
        },
        { attr: 1, children: [{ attr: 0, text: "", foo: "bar" }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update text before void", () => {
    const docText = "abcde";
    const doc = {
      children: [
        {
          attr: 0,
          children: [{ attr: 0, text: docText }, { foo: "bar" }],
        },
      ],
    };
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [1, docText.length],
      key: "mark",
      value: true,
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: docText.slice(0, 1) },
            { attr: 0, text: docText.slice(1), mark: true },
            { foo: "bar" },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update text to the same attr as neighbor", () => {
    const doc = {
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: "ab", foo: "bar" },
            { attr: 0, text: "cd" },
          ],
        },
      ],
    };
    const sel: Selection = [1, 1];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [2, 4],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: "abcd", foo: "bar" }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  describe("single line document", () => {
    it("update text after caret", () => {
      const docText = "abcde";
      const doc = { attr: 0, children: [{ attr: 0, text: docText }] };
      const sel: Selection = [0, 0];
      const res = applyOperation(doc, sel, {
        type: "format",
        range: [1, 3],
        key: "foo",
        value: "bar",
      });

      expect(res[0]).toEqual({
        attr: 0,
        children: [
          { attr: 0, text: docText.slice(0, 1) },
          { attr: 0, text: docText.slice(1, 3), foo: "bar" },
          { attr: 0, text: docText.slice(3) },
        ],
      });
      expect(res[1]).toEqual(sel);
    });

    it("update empty text with collapsed range", () => {
      const doc = { attr: 0, children: [{ attr: 0, text: "" }] };
      const sel: Selection = [0, 0];
      const res = applyOperation(doc, sel, {
        type: "format",
        range: [0, 0],
        key: "foo",
        value: "bar",
      });

      expect(res[0]).toEqual({
        attr: 0,
        children: [{ attr: 0, text: "", foo: "bar" }],
      });
      expect(res[1]).toEqual(sel);
    });
  });
});

describe("format with depth", () => {
  describe("validation", () => {
    it("depth less than min", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "format",
        range: [1, 2],
        key: "foo",
        value: "bar",
        depth: -4,
      });

      expect(res[0] === doc).toBe(true);
      expect(res[1]).toEqual(sel);
    });

    it("depth more than max", () => {
      const docText = "abcde";
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
      };
      const sel: Selection = [2, 2];
      const res = applyOperation(doc, sel, {
        type: "format",
        range: [1, 2],
        key: "foo",
        value: "bar",
        depth: 3,
      });

      expect(res[0] === doc).toBe(true);
      expect(res[1]).toEqual(sel);
    });
  });

  it("update root node", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: Selection = [docText.length + 1 + 2, docText.length + 1 + 2];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [0, 0],
      key: "foo",
      value: "bar",
      depth: 0,
    });

    expect(res[0]).toEqual({
      foo: "bar",
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update children of root node", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    const sel: Selection = [2, 2];
    const children = [{ attr: 1, children: [{ attr: 1, text: "xy" }] }];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [0, 0],
      key: "children",
      value: children,
      depth: 0,
    });

    expect(res[0]).toEqual({ children });
    expect(res[1]).toEqual(sel);
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
    const sel: Selection = [docText.length + 1 + 2, docText.length + 1 + 2];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [2, 2],
      key: "foo",
      value: "bar",
      depth: -2,
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
    const sel: Selection = [docText.length + 1 + 2, docText.length + 1 + 2];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [docText.length + 1 + 2, docText.length + 1 + 2],
      key: "foo",
      value: "bar",
      depth: -2,
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, foo: "bar", children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update block node with positive depth", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [2, 2],
      key: "foo",
      value: "bar",
      depth: 1,
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, foo: "bar", children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update the empty block the range ends at", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: "" }] },
      ],
    };
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [1, docText.length + 1],
      key: "foo",
      value: "bar",
      depth: -2,
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, foo: "bar", children: [{ attr: 0, text: docText }] },
        { attr: 1, foo: "bar", children: [{ attr: 0, text: "" }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update the empty item of a list the range ends at", () => {
    type Item = { attr: number; children: { attr: number; text: string }[] };
    const doc: { children: (Item | { attr: number; children: Item[] })[] } = {
      children: [
        { attr: 0, children: [{ attr: 0, text: "abcde" }] },
        {
          attr: 1,
          children: [
            { attr: 2, children: [{ attr: 0, text: "" }] },
            { attr: 3, children: [{ attr: 0, text: "fghij" }] },
          ],
        },
      ],
    };
    const sel: Selection = [2, 2];
    const item = applyOperation(doc, sel, {
      type: "format",
      range: [1, 6],
      key: "foo",
      value: "bar",
      depth: -2,
    })[0];
    const text = applyOperation(doc, sel, {
      type: "format",
      range: [1, 6],
      key: "foo",
      value: "bar",
    })[0];

    expect(item.children[1]).toEqual({
      attr: 1,
      children: [
        { attr: 2, foo: "bar", children: [{ attr: 0, text: "" }] },
        { attr: 3, children: [{ attr: 0, text: "fghij" }] },
      ],
    });
    expect(text.children[1]).toEqual({
      attr: 1,
      children: [
        { attr: 2, children: [{ attr: 0, text: "", foo: "bar" }] },
        { attr: 3, children: [{ attr: 0, text: "fghij" }] },
      ],
    });
    expect(sel).toEqual([2, 2]);
  });

  it("update block nodes with expanded range", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [1, docText.length + 1 + 2],
      key: "foo",
      value: "bar",
      depth: -2,
    });

    expect(res[0]).toEqual({
      children: [
        { attr: 0, foo: "bar", children: [{ attr: 0, text: docText }] },
        { attr: 1, foo: "bar", children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update text node", () => {
    const docText = "abcde";
    const docText2 = "fghij";
    const doc: Doc = {
      children: [
        { attr: 0, children: [{ attr: 0, text: docText }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [0, docText.length],
      key: "foo",
      value: "bar",
      depth: -1,
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            {
              attr: 0,
              text: docText,
              foo: "bar",
            },
          ],
        },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update void node", () => {
    const docText2 = "fghij";
    const doc = {
      children: [
        { attr: 0, children: [{ attr: 0, foo: "baz" }] },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    };
    const sel: Selection = [2, 2];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [0, 1],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [{ attr: 0, foo: "bar" }],
        },
        { attr: 1, children: [{ attr: 0, text: docText2 }] },
      ],
    });
    expect(res[1]).toEqual(sel);
  });
});

describe("format with depth in nested doc", () => {
  type NestedDoc = {
    children: {
      attr: number;
      children: { attr: number; children: { attr: number; text: string }[] }[];
    }[];
  };

  it("update text node", () => {
    const docText = "abcde";
    const doc: NestedDoc = {
      children: [
        {
          attr: 0,
          children: [{ attr: 1, children: [{ attr: 2, text: docText }] }],
        },
      ],
    };
    const sel: Selection = [1, 1];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [1, 3],
      key: "foo",
      value: "bar",
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            {
              attr: 1,
              children: [
                { attr: 2, text: docText.slice(0, 1) },
                { attr: 2, text: docText.slice(1, 3), foo: "bar" },
                { attr: 2, text: docText.slice(3) },
              ],
            },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update inner block node", () => {
    const docText = "abcde";
    const doc: NestedDoc = {
      children: [
        {
          attr: 0,
          children: [{ attr: 1, children: [{ attr: 2, text: docText }] }],
        },
      ],
    };
    const sel: Selection = [1, 1];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [1, 3],
      key: "foo",
      value: "bar",
      depth: -2,
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          children: [
            {
              attr: 1,
              foo: "bar",
              children: [{ attr: 2, text: docText }],
            },
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update outer block node with collapsed range", () => {
    const docText = "abcde";
    const doc: NestedDoc = {
      children: [
        {
          attr: 0,
          children: [{ attr: 1, children: [{ attr: 2, text: docText }] }],
        },
      ],
    };
    const sel: Selection = [1, 1];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [1, 1],
      key: "foo",
      value: "bar",
      depth: -3,
    });

    expect(res[0]).toEqual({
      children: [
        {
          attr: 0,
          foo: "bar",
          children: [{ attr: 1, children: [{ attr: 2, text: docText }] }],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });
});

describe("format with depth in unevenly nested doc", () => {
  type UnevenDoc = {
    children: (
      | { type: "p"; align?: string; children: { text: string }[] }
      | {
          type: "table";
          width?: number;
          children: {
            type: "row";
            height?: number;
            children: {
              type: "cell";
              align?: string;
              children: { text: string }[];
            }[];
          }[];
        }
    )[];
  };
  type TableNode = Extract<UnevenDoc["children"][number], { type: "table" }>;
  const docText = "abcde";
  const cellText = "1";
  const cellText2 = "2";
  const doc: UnevenDoc = {
    children: [
      { type: "p", children: [{ text: docText }] },
      {
        type: "table",
        children: [
          {
            type: "row",
            children: [
              { type: "cell", children: [{ text: cellText }] },
              { type: "cell", children: [{ text: cellText2 }] },
            ],
          },
          {
            type: "row",
            children: [
              { type: "cell", children: [{ text: "3" }] },
              { type: "cell", children: [{ text: "4" }] },
            ],
          },
        ],
      },
    ],
  };
  const table = doc.children[1] as TableNode;
  const cell2Start = docText.length + 1 + cellText.length + 1;

  it("update cell at caret with leaf block depth", () => {
    const sel: Selection = [cell2Start, cell2Start];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [cell2Start, cell2Start],
      key: "align",
      value: "right",
      depth: -2,
    });

    expect((res[0].children[1] as TableNode).children[0]!.children[1]).toEqual({
      type: "cell",
      align: "right",
      children: [{ text: cellText2 }],
    });
    expect(res[0].children[0] === doc.children[0]).toBe(true);
    expect(
      (res[0].children[1] as TableNode).children[1] === table.children[1],
    ).toBe(true);
    expect(res[1]).toEqual(sel);
  });

  it("update paragraph and cells inside selection with leaf block depth", () => {
    const sel: Selection = [2, cell2Start + cellText2.length];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: sel,
      key: "align",
      value: "right",
      depth: -2,
    });

    expect(res[0]).toEqual({
      children: [
        { type: "p", align: "right", children: [{ text: docText }] },
        {
          type: "table",
          children: [
            {
              type: "row",
              children: [
                {
                  type: "cell",
                  align: "right",
                  children: [{ text: cellText }],
                },
                {
                  type: "cell",
                  align: "right",
                  children: [{ text: cellText2 }],
                },
              ],
            },
            table.children[1],
          ],
        },
      ],
    });
    expect(res[1]).toEqual(sel);
  });

  it("update row and table above caret with negative depth", () => {
    const sel: Selection = [cell2Start, cell2Start];
    const row = applyOperation(doc, sel, {
      type: "format",
      range: sel,
      key: "height",
      value: 20,
      depth: -3,
    })[0];
    const widened = applyOperation(doc, sel, {
      type: "format",
      range: sel,
      key: "width",
      value: 100,
      depth: -4,
    })[0];

    expect((row.children[1] as TableNode).children[0]).toEqual({
      type: "row",
      height: 20,
      children: table.children[0]!.children,
    });
    expect(
      (row.children[1] as TableNode).children[1] === table.children[1],
    ).toBe(true);
    expect(widened.children[1]).toEqual({ ...table, width: 100 });
    expect((widened.children[1] as TableNode).children === table.children).toBe(
      true,
    );
  });

  it("update top-level block at caret with positive depth", () => {
    const sel: Selection = [cell2Start, cell2Start];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: sel,
      key: "width",
      value: 100,
      depth: 1,
    });

    expect(res[0].children[1]).toEqual({ ...table, width: 100 });
    expect(res[0].children[0] === doc.children[0]).toBe(true);
  });

  it("update block at caret at end of text", () => {
    const sel: Selection = [docText.length, docText.length];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: sel,
      key: "align",
      value: "right",
      depth: -2,
    });

    expect(res[0].children[0]).toEqual({
      type: "p",
      align: "right",
      children: [{ text: docText }],
    });
    expect(res[0].children[1] === doc.children[1]).toBe(true);
  });

  it("depth beyond root", () => {
    const sel: Selection = [cell2Start, cell2Start];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: sel,
      key: "width",
      value: 100,
      depth: -6,
    });

    expect(res[0] === doc).toBe(true);
    expect(res[1]).toEqual(sel);
  });
});

describe("format without value", () => {
  type MarkDoc = {
    children: {
      attr: number;
      mark?: boolean;
      children: { attr: number; text: string; mark?: boolean }[];
    }[];
  };

  it("remove attr with undefined value and merge texts", () => {
    const doc: MarkDoc = {
      children: [
        {
          attr: 0,
          children: [
            { attr: 0, text: "ab", mark: true },
            { attr: 0, text: "cd" },
          ],
        },
      ],
    };
    const sel: Selection = [1, 1];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [0, 2],
      key: "mark",
      value: undefined,
    });

    expect(res[0]).toEqual({
      children: [{ attr: 0, children: [{ attr: 0, text: "abcd" }] }],
    });
    expect("mark" in res[0].children[0]!.children[0]!).toBe(false);
    expect(res[1]).toEqual(sel);
  });

  it("remove attr with omitted value", () => {
    const doc: MarkDoc = {
      children: [
        { attr: 0, mark: true, children: [{ attr: 0, text: "abcde" }] },
      ],
    };
    const sel: Selection = [1, 1];
    const res = applyOperation(doc, sel, {
      type: "format",
      range: [1, 1],
      key: "mark",
      depth: -2,
    });

    expect(res[0]).toEqual({
      children: [{ attr: 0, children: [{ attr: 0, text: "abcde" }] }],
    });
    expect("mark" in res[0].children[0]!).toBe(false);
    expect(res[1]).toEqual(sel);
  });
});

describe(isValidSelection.name, () => {
  it("offset less than min", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    expect(isValidSelection(doc, [-1, 1])).toBe(false);
  });

  it("offset more than max", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    expect(isValidSelection(doc, [0, 100])).toBe(false);
  });

  it("should select cursor", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    expect(isValidSelection(doc, [1, 1])).toBe(true);
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
        docText.length + 1 + 1,
        docText.length + 1 + docText2.length + 1 + 1,
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
    expect(isValidSelection(doc, [2, docText.length + 1 + 1])).toBe(true);
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
    expect(isValidSelection(doc, [0, getNodeSize(doc)])).toBe(true);
  });

  it("should select backward", () => {
    const docText = "abcde";
    const doc: Doc = {
      children: [{ attr: 0, children: [{ attr: 0, text: docText }] }],
    };
    expect(isValidSelection(doc, [3, 1])).toBe(true);
  });
});

describe(mapPosition.name, () => {
  describe("insert_text", () => {
    const op = (at: number): Operation => ({
      type: "insert_text",
      at,
      text: "xy",
    });

    it("should move position after insertion before it", () => {
      expect(mapPosition(5, op(3))).toBe(7);
      expect(mapPosition(5, op(3))).toBe(7);
    });

    it("should keep position before insertion after it", () => {
      expect(mapPosition(5, op(6))).toBe(5);
      expect(mapPosition(5, op(6))).toBe(5);
    });

    it("should respect bias on insertion at the same position", () => {
      expect(mapPosition(5, op(5))).toBe(7);
      expect(mapPosition(5, op(5), true)).toBe(5);
    });
  });

  describe("insert_node", () => {
    const fragment = [{ children: [{ text: "xy" }] }];
    const size = getNodeSize({ children: fragment });
    const op = (at: number): Operation => ({
      type: "insert_node",
      at,
      fragment,
    });

    it("should move position after insertion before it", () => {
      expect(mapPosition(5, op(3))).toBe(5 + size);
      expect(mapPosition(5, op(3))).toBe(5 + size);
    });

    it("should keep position before insertion after it", () => {
      expect(mapPosition(5, op(6))).toBe(5);
      expect(mapPosition(5, op(6))).toBe(5);
    });

    it("should respect bias on insertion at the same position", () => {
      expect(mapPosition(5, op(5))).toBe(5 + size);
      expect(mapPosition(5, op(5), true)).toBe(5);
    });
  });

  describe("delete", () => {
    const op = (start: number, end: number): Operation => ({
      type: "delete",
      range: [start, end],
    });

    it("should move position after deletion before it", () => {
      expect(mapPosition(5, op(1, 3))).toBe(3);
      expect(mapPosition(5, op(1, 3))).toBe(3);
    });

    it("should collapse position inside deleted range to its start", () => {
      expect(mapPosition(5, op(3, 8))).toBe(3);
      expect(mapPosition(5, op(3, 8))).toBe(3);
      expect(mapPosition(5, op(5, 8))).toBe(5);
      expect(mapPosition(5, op(3, 5))).toBe(3);
    });

    it("should keep position before deletion after it", () => {
      expect(mapPosition(5, op(6, 8))).toBe(5);
      expect(mapPosition(5, op(6, 8))).toBe(5);
    });
  });
});

describe(invertOperation.name, () => {
  describe("delete", () => {
    it("should insert the deleted fragment at the start", () => {
      const sel: Selection = [0, 0];
      const doc: Doc = {
        children: [
          { attr: 0, children: [{ attr: 0, text: "abcde" }] },
          { attr: 1, children: [{ attr: 1, text: "fghij" }] },
          { attr: 2, children: [{ attr: 2, text: "klmno" }] },
        ],
      };
      const op: Operation = { type: "delete", range: [3, 13] };
      const applied = applyOperation(doc, sel, op)[0];
      const inverted = invertOperation(doc, op);
      const reverted = inverted.reduce(
        (d, o) => applyOperation(d, sel, o)[0],
        applied,
      );

      expect(applied).toEqual({
        children: [
          {
            attr: 0,
            children: [
              { attr: 0, text: "abc" },
              { attr: 2, text: "lmno" },
            ],
          },
        ],
      });
      expect(inverted).toEqual([
        {
          type: "insert_node",
          at: 3,
          fragment: [
            { attr: 0, children: [{ attr: 0, text: "de" }] },
            { attr: 1, children: [{ attr: 1, text: "fghij" }] },
            { attr: 2, children: [{ attr: 2, text: "k" }] },
          ],
        },
      ]);
      expect(reverted).toEqual(doc);
    });

    it("should restore the whole document", () => {
      const sel: Selection = [0, 0];
      const doc: Doc = {
        children: [
          { attr: 0, children: [{ attr: 0, text: "abcde" }] },
          { attr: 1, children: [{ attr: 1, text: "fghij" }] },
        ],
      };
      const op: Operation = { type: "delete", range: [0, 11] };
      const applied = applyOperation(doc, sel, op)[0];
      const reverted = invertOperation(doc, op).reduce(
        (d, o) => applyOperation(d, sel, o)[0],
        applied,
      );

      expect(applied).toEqual({
        children: [{ attr: 0, children: [{ attr: 1, text: "" }] }],
      });
      expect(reverted).toEqual(doc);
    });

    it("should restore the empty text node of the joined block", () => {
      const sel: Selection = [0, 0];
      const doc: DocNode = {
        children: [
          { children: [{ text: "ab", bold: true }] },
          { children: [{ text: "" }] },
        ],
      };
      const op: Operation = { type: "delete", range: [2, 3] };
      const applied = applyOperation(doc, sel, op)[0];
      const reverted = invertOperation(doc, op).reduce(
        (d, o) => applyOperation(d, sel, o)[0],
        applied,
      );

      expect(applied).toEqual({
        children: [{ children: [{ text: "ab", bold: true }] }],
      });
      expect(reverted).toEqual(doc);
    });
  });

  describe("insert_text", () => {
    it("should delete the inserted text including linebreaks", () => {
      const sel: Selection = [0, 0];
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: "abcde" }] }],
      };
      const text = "x\nyz";
      const op: Operation = { type: "insert_text", at: 2, text };
      const inverted = invertOperation(doc, op);
      const reverted = inverted.reduce(
        (d, o) => applyOperation(d, sel, o)[0],
        applyOperation(doc, sel, op)[0],
      );

      expect(inverted).toEqual([
        { type: "delete", range: [2, 2 + text.length] },
      ]);
      expect(reverted).toEqual(doc);
    });
  });

  describe("insert_node", () => {
    it("should delete the inserted fragment", () => {
      const sel: Selection = [0, 0];
      const doc: Doc = {
        children: [{ attr: 0, children: [{ attr: 0, text: "abcde" }] }],
      };
      const fragment: Doc["children"] = [
        { attr: 1, children: [{ attr: 1, text: "x" }] },
        { attr: 2, children: [{ attr: 2, text: "yz" }] },
      ];
      const op: Operation = { type: "insert_node", at: 2, fragment };
      const inverted = invertOperation(doc, op);
      const reverted = inverted.reduce(
        (d, o) => applyOperation(d, sel, o)[0],
        applyOperation(doc, sel, op)[0],
      );

      expect(inverted).toEqual([
        { type: "delete", range: [2, 2 + getNodeSize({ children: fragment })] },
      ]);
      expect(reverted).toEqual(doc);
    });

    it("should delete the inserted void node", () => {
      const sel: Selection = [0, 0];
      const doc: DocNode = {
        children: [{ children: [{ text: "abcde" }] }],
      };
      const op: Operation = {
        type: "insert_node",
        at: 2,
        fragment: [{ children: [{ foo: "bar" }] }],
      };
      const applied = applyOperation(doc, sel, op)[0];
      const inverted = invertOperation(doc, op);
      const reverted = inverted.reduce(
        (d, o) => applyOperation(d, sel, o)[0],
        applied,
      );

      expect(applied).toEqual({
        children: [
          { children: [{ text: "ab" }, { foo: "bar" }, { text: "cde" }] },
        ],
      });
      expect(inverted).toEqual([{ type: "delete", range: [2, 3] }]);
      expect(reverted).toEqual(doc);
    });

    it("should put the replaced empty text node back after deleting the content", () => {
      const sel: Selection = [0, 0];
      const doc: DocNode = {
        children: [{ children: [{ text: "", bold: true }] }],
      };
      const op: Operation = {
        type: "insert_node",
        at: 0,
        fragment: [{ children: [{ text: "hello" }] }],
      };
      const applied = applyOperation(doc, sel, op)[0];
      const inverted = invertOperation(doc, op);
      const reverted = inverted.reduce(
        (d, o) => applyOperation(d, sel, o)[0],
        applied,
      );

      expect(applied).toEqual({
        children: [{ children: [{ text: "hello" }] }],
      });
      expect(inverted).toEqual([
        { type: "delete", range: [0, 5] },
        { type: "insert_node", at: 0, fragment: [{ text: "", bold: true }] },
      ]);
      expect(reverted).toEqual(doc);
    });

    it("should not keep the attrs of the inserted text on the empty text node", () => {
      const sel: Selection = [0, 0];
      const doc: DocNode = { children: [{ children: [{ text: "" }] }] };
      const op: Operation = {
        type: "insert_node",
        at: 0,
        fragment: [{ children: [{ text: "hello", bold: true }] }],
      };
      const reverted = invertOperation(doc, op).reduce(
        (d, o) => applyOperation(d, sel, o)[0],
        applyOperation(doc, sel, op)[0],
      );

      expect(reverted).toEqual(doc);
    });
  });

  describe("format", () => {
    it("should restore each text node in the range with its depth from the root", () => {
      const sel: Selection = [0, 0];
      const doc: DocNode = {
        children: [
          {
            children: [{ text: "ab", foo: "old" }, { text: "cde" }],
          },
          { children: [{ text: "fghij" }] },
        ],
      };
      const op: Operation = {
        type: "format",
        range: [1, 7],
        key: "foo",
        value: "new",
      };
      const inverted = invertOperation(doc, op);
      const reverted = inverted.reduce(
        (d, o) => applyOperation(d, sel, o)[0],
        applyOperation(doc, sel, op)[0],
      );

      expect(inverted).toEqual([
        { type: "format", range: [1, 2], key: "foo", value: "old", depth: 2 },
        {
          type: "format",
          range: [2, 7],
          key: "foo",
          value: undefined,
          depth: 2,
        },
      ]);
      expect(reverted).toEqual(doc);
    });

    it("should revert adjacent nodes with the same value by one operation", () => {
      const sel: Selection = [0, 0];
      const doc: DocNode = {
        children: [
          { children: [{ text: "ab" }, { text: "cd", foo: "old" }] },
          { children: [{ text: "ef", foo: "old" }, { text: "gh" }] },
        ],
      };
      const op: Operation = {
        type: "format",
        range: [0, 9],
        key: "foo",
        value: "new",
      };
      const inverted = invertOperation(doc, op);
      const reverted = inverted.reduce(
        (d, o) => applyOperation(d, sel, o)[0],
        applyOperation(doc, sel, op)[0],
      );

      expect(inverted).toEqual([
        {
          type: "format",
          range: [0, 2],
          key: "foo",
          value: undefined,
          depth: 2,
        },
        { type: "format", range: [2, 7], key: "foo", value: "old", depth: 2 },
        {
          type: "format",
          range: [7, 9],
          key: "foo",
          value: undefined,
          depth: 2,
        },
      ]);
      expect(reverted).toEqual(doc);
    });

    it("should restore the removed attr", () => {
      const sel: Selection = [0, 0];
      const doc: DocNode = {
        children: [{ children: [{ text: "ab", foo: "old" }, { text: "cd" }] }],
      };
      const op: Operation = { type: "format", range: [0, 4], key: "foo" };
      const applied = applyOperation(doc, sel, op)[0];
      const reverted = invertOperation(doc, op).reduce(
        (d, o) => applyOperation(d, sel, o)[0],
        applied,
      );

      expect(applied).toEqual({ children: [{ children: [{ text: "abcd" }] }] });
      expect(reverted).toEqual(doc);
    });

    it("should restore each block in the range with the part of the range on it", () => {
      const sel: Selection = [0, 0];
      const doc: Doc = {
        children: [
          { attr: 0, children: [{ attr: 0, text: "abcde" }] },
          { attr: 1, children: [{ attr: 1, text: "fghij" }] },
        ],
      };
      const op: Operation = {
        type: "format",
        range: [2, 8],
        key: "attr",
        value: 9,
        depth: -2,
      };
      const inverted = invertOperation(doc, op);
      const reverted = inverted.reduce(
        (d, o) => applyOperation(d, sel, o)[0],
        applyOperation(doc, sel, op)[0],
      );

      expect(inverted).toEqual([
        { type: "format", range: [2, 5], key: "attr", value: 0, depth: 1 },
        { type: "format", range: [6, 8], key: "attr", value: 1, depth: 1 },
      ]);
      expect(reverted).toEqual(doc);
    });

    it("should revert adjacent blocks with the same attr by one operation", () => {
      const sel: Selection = [0, 0];
      const doc: Doc = {
        children: [
          { attr: 0, children: [{ attr: 0, text: "abcde" }] },
          { attr: 0, children: [{ attr: 1, text: "fghij" }] },
        ],
      };
      const op: Operation = {
        type: "format",
        range: [2, 8],
        key: "attr",
        value: 9,
        depth: -2,
      };
      const inverted = invertOperation(doc, op);
      const reverted = inverted.reduce(
        (d, o) => applyOperation(d, sel, o)[0],
        applyOperation(doc, sel, op)[0],
      );

      expect(inverted).toEqual([
        { type: "format", range: [2, 8], key: "attr", value: 0, depth: 1 },
      ]);
      expect(reverted).toEqual(doc);
    });

    it("should restore the block at caret", () => {
      const sel: Selection = [0, 0];
      const doc: Doc = {
        children: [
          { attr: 0, children: [{ attr: 0, text: "abcde" }] },
          { attr: 1, children: [{ attr: 1, text: "fghij" }] },
        ],
      };
      const op: Operation = {
        type: "format",
        range: [6, 6],
        key: "attr",
        value: 9,
        depth: -2,
      };
      const inverted = invertOperation(doc, op);
      const reverted = inverted.reduce(
        (d, o) => applyOperation(d, sel, o)[0],
        applyOperation(doc, sel, op)[0],
      );

      expect(inverted).toEqual([
        { type: "format", range: [6, 6], key: "attr", value: 1, depth: 1 },
      ]);
      expect(reverted).toEqual(doc);
    });

    it("should restore the empty text node at caret", () => {
      const sel: Selection = [0, 0];
      const doc: DocNode = {
        children: [{ children: [{ text: "", foo: "old" }] }],
      };
      const op: Operation = {
        type: "format",
        range: [0, 0],
        key: "foo",
        value: "new",
      };
      const applied = applyOperation(doc, sel, op)[0];
      const inverted = invertOperation(doc, op);
      const reverted = inverted.reduce(
        (d, o) => applyOperation(d, sel, o)[0],
        applied,
      );

      expect(applied).toEqual({
        children: [{ children: [{ text: "", foo: "new" }] }],
      });
      expect(inverted).toEqual([
        { type: "format", range: [0, 0], key: "foo", value: "old", depth: 2 },
      ]);
      expect(reverted).toEqual(doc);
    });

    it("should restore the root attr and children", () => {
      const sel: Selection = [0, 0];
      const doc = {
        foo: "old",
        children: [{ attr: 0, children: [{ attr: 0, text: "abcde" }] }],
      };
      const attr: Operation = {
        type: "format",
        range: [0, 0],
        key: "foo",
        value: "new",
        depth: 0,
      };
      const children: Operation = {
        type: "format",
        range: [0, 0],
        key: "children",
        value: [{ attr: 1, children: [{ attr: 1, text: "x" }] }],
        depth: 0,
      };

      const invertedAttr = invertOperation(doc, attr);
      const invertedChildren = invertOperation(doc, children);

      expect(invertedAttr).toEqual([
        { type: "format", range: [0, 0], key: "foo", value: "old", depth: 0 },
      ]);
      expect(
        invertedAttr.reduce(
          (d, o) => applyOperation(d, sel, o)[0],
          applyOperation(doc, sel, attr)[0],
        ),
      ).toEqual(doc);
      expect(invertedChildren).toEqual([
        {
          type: "format",
          range: [0, 0],
          key: "children",
          value: doc.children,
          depth: 0,
        },
      ]);
      expect(
        invertedChildren.reduce(
          (d, o) => applyOperation(d, sel, o)[0],
          applyOperation(doc, sel, children)[0],
        ),
      ).toEqual(doc);
    });

    it("should not revert nodes at the same depth apart by one operation", () => {
      const sel: Selection = [0, 0];
      const doc: DocNode = {
        children: [
          { children: [{ children: [{ children: [{ text: "1" }] }] }] },
          { children: [{ text: "ab", foo: "old" }] },
          { children: [{ children: [{ children: [{ text: "2" }] }] }] },
        ],
      };
      const op: Operation = {
        type: "format",
        range: [0, getNodeSize(doc)],
        key: "foo",
        value: "new",
        depth: -3,
      };
      const inverted = invertOperation(doc, op);
      const reverted = inverted.reduce(
        (d, o) => applyOperation(d, sel, o)[0],
        applyOperation(doc, sel, op)[0],
      );

      expect(inverted).toEqual([
        {
          type: "format",
          range: [0, 1],
          key: "foo",
          value: undefined,
          depth: 2,
        },
        {
          type: "format",
          range: [5, 6],
          key: "foo",
          value: undefined,
          depth: 2,
        },
        {
          type: "format",
          range: [0, 6],
          key: "foo",
          value: undefined,
          depth: 0,
        },
      ]);
      expect(reverted).toEqual(doc);
    });

    describe("in unevenly nested doc", () => {
      const doc: DocNode & { foo: string } = {
        foo: "root",
        children: [
          { type: "p", foo: "p", children: [{ text: "abcde" }] },
          {
            type: "table",
            children: [
              {
                type: "row",
                foo: "row",
                children: [
                  { type: "cell", children: [{ text: "1" }] },
                  { type: "cell", foo: "cell", children: [{ text: "2" }] },
                ],
              },
            ],
          },
        ],
      };
      const docSize = getNodeSize(doc);

      it("should restore leaf blocks of different depths", () => {
        const sel: Selection = [0, 0];
        const op: Operation = {
          type: "format",
          range: [0, docSize],
          key: "foo",
          value: "new",
          depth: -2,
        };
        const inverted = invertOperation(doc, op);
        const reverted = inverted.reduce(
          (d, o) => applyOperation(d, sel, o)[0],
          applyOperation(doc, sel, op)[0],
        );

        expect(inverted).toEqual([
          { type: "format", range: [0, 5], key: "foo", value: "p", depth: 1 },
          {
            type: "format",
            range: [6, 7],
            key: "foo",
            value: undefined,
            depth: 3,
          },
          {
            type: "format",
            range: [8, 9],
            key: "foo",
            value: "cell",
            depth: 3,
          },
        ]);
        expect(reverted).toEqual(doc);
      });

      it("should not revert adjacent blocks of different depths by one operation", () => {
        const sel: Selection = [0, 0];
        const op: Operation = {
          type: "format",
          range: [0, docSize],
          key: "bar",
          value: "new",
          depth: -2,
        };
        const inverted = invertOperation(doc, op);
        const reverted = inverted.reduce(
          (d, o) => applyOperation(d, sel, o)[0],
          applyOperation(doc, sel, op)[0],
        );

        expect(inverted).toEqual([
          {
            type: "format",
            range: [0, 5],
            key: "bar",
            value: undefined,
            depth: 1,
          },
          {
            type: "format",
            range: [6, 9],
            key: "bar",
            value: undefined,
            depth: 3,
          },
        ]);
        expect(reverted).toEqual(doc);
      });

      it("should restore ancestors of different depths including the root", () => {
        const sel: Selection = [0, 0];
        const op: Operation = {
          type: "format",
          range: [0, docSize],
          key: "foo",
          value: "new",
          depth: -3,
        };
        const inverted = invertOperation(doc, op);
        const reverted = inverted.reduce(
          (d, o) => applyOperation(d, sel, o)[0],
          applyOperation(doc, sel, op)[0],
        );

        expect(inverted).toEqual([
          { type: "format", range: [6, 9], key: "foo", value: "row", depth: 2 },
          {
            type: "format",
            range: [0, 9],
            key: "foo",
            value: "root",
            depth: 0,
          },
        ]);
        expect(reverted).toEqual(doc);
      });
    });
  });
});
