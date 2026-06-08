/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";
import {
  createParser,
  defaultIsBlockNode,
  findPosition,
  serializePosition,
} from "./index.js";

const document = window.document;
const parser = createParser({
  _document: document,
  _isBlock: defaultIsBlockNode,
});

const h = <
  T extends
    | keyof HTMLElementTagNameMap
    | keyof SVGElementTagNameMap
    | keyof MathMLElementTagNameMap,
>(
  type: T,
  children: (HTMLElement | string)[] = [],
  props?: Record<string, unknown>,
): HTMLElement => {
  const node = document.createElement(type);

  if (props) {
    Object.keys(props).forEach((k) => {
      (node as any)[k] = props[k];
    });
  }

  children.forEach((c) => {
    if (typeof c === "string") {
      node.appendChild(document.createTextNode(c));
    } else {
      node.appendChild(c);
    }
  });

  return node;
};

// https://www.w3.org/TR/content-editable/#dfn-legal-caret-positions
const textPosAt = (
  node: Node,
  path: number[],
  offset: number,
): [node: Node, offset: number] => {
  for (const p of path) {
    node = node.childNodes[p]!;
  }
  return [node, offset];
};
const stubPosAt = (
  node: Node,
  path: number[],
  after?: boolean,
): [node: Node, offset: number] => {
  const last = path.length - 1;
  for (let i = 0; i < last; i++) {
    const p = path[i]!;
    node = node.childNodes[p]!;
  }
  let i = path[last]!;
  if (after) {
    i++;
  }
  return [node, i];
};

describe("depth 0", () => {
  describe("placeholder", () => {
    const doc = h("div", []);

    it("0", () => {
      const domPos = stubPosAt(doc, []);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });
  });

  describe("br", () => {
    const doc = h("div", [h("br")]);

    it("0", () => {
      const domPos = textPosAt(doc, [0], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("text", () => {
    const doc = h("div", ["Hello"]);

    it("0 start", () => {
      const domPos = textPosAt(doc, [0], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = textPosAt(doc, [0], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("text + br", () => {
    const doc = h("div", ["Hello", h("br")]);

    it("0 start", () => {
      const domPos = textPosAt(doc, [0], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = textPosAt(doc, [0], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("img", () => {
    const doc = h("div", [h("img")]);

    it("0 start", () => {
      const domPos = stubPosAt(doc, [0]);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = stubPosAt(doc, [0], true);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 1]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });
  });

  describe("img + text", () => {
    const doc = h("div", [h("img"), "Hello"]);

    it("0 start", () => {
      const domPos = stubPosAt(doc, [0]);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = stubPosAt(doc, [0], true);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 1]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 start", () => {
      const domPos = textPosAt(doc, [1], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 1]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 end", () => {
      const domPos = textPosAt(doc, [1], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("text + img", () => {
    const doc = h("div", ["Hello", h("img")]);

    it("0 start", () => {
      const domPos = textPosAt(doc, [0], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = textPosAt(doc, [0], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("1 start", () => {
      const domPos = stubPosAt(doc, [1]);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 end", () => {
      const domPos = stubPosAt(doc, [1], true);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });
  });

  describe("text + img + text", () => {
    const doc = h("div", ["Hello", h("img"), "world"]);

    it("0 start", () => {
      const domPos = textPosAt(doc, [0], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = textPosAt(doc, [0], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("1 start", () => {
      const domPos = stubPosAt(doc, [1]);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 end", () => {
      const domPos = stubPosAt(doc, [1], true);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("2 start", () => {
      const domPos = textPosAt(doc, [2], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("2 end", () => {
      const domPos = textPosAt(doc, [2], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 11]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("contenteditable:false", () => {
    const doc = h("div", [h("span", ["void"], { contentEditable: "false" })]);

    it("0 start", () => {
      const domPos = stubPosAt(doc, [0]);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = stubPosAt(doc, [0], true);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 1]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });
  });

  describe("contenteditable:false + text", () => {
    const doc = h("div", [
      h("span", ["void"], { contentEditable: "false" }),
      "Hello",
    ]);

    it("0 start", () => {
      const domPos = stubPosAt(doc, [0]);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = stubPosAt(doc, [0], true);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 1]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 start", () => {
      const domPos = textPosAt(doc, [1], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 1]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 end", () => {
      const domPos = textPosAt(doc, [1], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("text + contenteditable:false", () => {
    const doc = h("div", [
      "Hello",
      h("span", ["void"], { contentEditable: "false" }),
    ]);

    it("0 start", () => {
      const domPos = textPosAt(doc, [0], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = textPosAt(doc, [0], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("1 start", () => {
      const domPos = stubPosAt(doc, [1]);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 end", () => {
      const domPos = stubPosAt(doc, [1], true);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });
  });

  describe("text + contenteditable:false + text", () => {
    const doc = h("div", [
      "Hello",
      h("span", ["void"], { contentEditable: "false" }),
      "world",
    ]);

    it("0 start", () => {
      const domPos = textPosAt(doc, [0], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = textPosAt(doc, [0], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("1 start", () => {
      const domPos = stubPosAt(doc, [1]);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 end", () => {
      const domPos = stubPosAt(doc, [1], true);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("2 start", () => {
      const domPos = textPosAt(doc, [2], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("2 end", () => {
      const domPos = textPosAt(doc, [2], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 11]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("template + text + template", () => {
    const doc = h("div", [h("template"), "Hello", h("template")]);

    it("0 start", () => {
      const domPos = textPosAt(doc, [1], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = textPosAt(doc, [1], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });
});

describe("depth 1", () => {
  describe("placeholder", () => {
    const doc = h("div", [h("div", [])]);

    it("0", () => {
      const domPos = stubPosAt(doc, [0]);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });
  });

  describe("br", () => {
    const doc = h("div", [h("div", [h("br")])]);

    it("0", () => {
      const domPos = textPosAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("text", () => {
    const doc = h("div", [h("div", ["Hello"])]);

    it("0 start", () => {
      const domPos = textPosAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = textPosAt(doc, [0, 0], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("text + br", () => {
    const doc = h("div", [h("div", ["Hello", h("br")])]);

    it("0 start", () => {
      const domPos = textPosAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = textPosAt(doc, [0, 0], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("img", () => {
    const doc = h("div", [h("div", [h("img")])]);

    it("0 start", () => {
      const domPos = stubPosAt(doc, [0, 0]);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = stubPosAt(doc, [0, 0], true);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 1]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });
  });

  describe("img + text", () => {
    const doc = h("div", [h("div", [h("img"), "Hello"])]);

    it("0 start", () => {
      const domPos = stubPosAt(doc, [0, 0]);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = stubPosAt(doc, [0, 0], true);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 1]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 start", () => {
      const domPos = textPosAt(doc, [0, 1], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 1]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 end", () => {
      const domPos = textPosAt(doc, [0, 1], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("text + img", () => {
    const doc = h("div", [h("div", ["Hello", h("img")])]);

    it("0 start", () => {
      const domPos = textPosAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = textPosAt(doc, [0, 0], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("1 start", () => {
      const domPos = stubPosAt(doc, [0, 1]);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 end", () => {
      const domPos = stubPosAt(doc, [0, 1], true);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });
  });

  describe("text + img + text", () => {
    const doc = h("div", [h("div", ["Hello", h("img"), "world"])]);

    it("0 start", () => {
      const domPos = textPosAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = textPosAt(doc, [0, 0], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("1 start", () => {
      const domPos = stubPosAt(doc, [0, 1]);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 end", () => {
      const domPos = stubPosAt(doc, [0, 1], true);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("2 start", () => {
      const domPos = textPosAt(doc, [0, 2], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("2 end", () => {
      const domPos = textPosAt(doc, [0, 2], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 11]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("contenteditable:false", () => {
    const doc = h("div", [
      h("div", [h("span", ["void"], { contentEditable: "false" })]),
    ]);

    it("0 start", () => {
      const domPos = stubPosAt(doc, [0, 0]);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = stubPosAt(doc, [0, 0], true);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 1]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });
  });

  describe("contenteditable:false + text", () => {
    const doc = h("div", [
      h("div", [h("span", ["void"], { contentEditable: "false" }), "Hello"]),
    ]);

    it("0 start", () => {
      const domPos = stubPosAt(doc, [0, 0]);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = stubPosAt(doc, [0, 0], true);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 1]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 start", () => {
      const domPos = textPosAt(doc, [0, 1], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 1]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 end", () => {
      const domPos = textPosAt(doc, [0, 1], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("text + contenteditable:false", () => {
    const doc = h("div", [
      h("div", ["Hello", h("span", ["void"], { contentEditable: "false" })]),
    ]);

    it("0 start", () => {
      const domPos = textPosAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = textPosAt(doc, [0, 0], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("1 start", () => {
      const domPos = stubPosAt(doc, [0, 1]);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 end", () => {
      const domPos = stubPosAt(doc, [0, 1], true);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      // TODO contain
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });
  });

  describe("text + contenteditable:false + text", () => {
    const doc = h("div", [
      h("div", [
        "Hello",
        h("span", ["void"], { contentEditable: "false" }),
        "world",
      ]),
    ]);

    it("0 start", () => {
      const domPos = textPosAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = textPosAt(doc, [0, 0], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("1 start", () => {
      const domPos = stubPosAt(doc, [0, 1]);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 end", () => {
      const domPos = stubPosAt(doc, [0, 1], true);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("2 start", () => {
      const domPos = textPosAt(doc, [0, 2], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("2 end", () => {
      const domPos = textPosAt(doc, [0, 2], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 11]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("template + block + template", () => {
    const doc = h("div", [h("template"), h("div", ["Hello"]), h("template")]);

    it("0 start", () => {
      const domPos = textPosAt(doc, [1, 0], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = textPosAt(doc, [1, 0], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("blocks", () => {
    const doc = h("div", [h("div", ["Hello"]), h("br"), h("div", ["world"])]);

    it("0 start", () => {
      const domPos = textPosAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const domPos = textPosAt(doc, [0, 0], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("1", () => {
      const domPos = stubPosAt(doc, [1, 0]);
      const pos = serializePosition(doc, ...domPos, parser);
      // TODO revisit
      expect(pos).toEqual([[0], 5]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("2 start", () => {
      const domPos = textPosAt(doc, [2, 0], 0);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[2], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("2 end", () => {
      const domPos = textPosAt(doc, [2, 0], 5);
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[2], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });
});
