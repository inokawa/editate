/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";
import {
  createParser,
  defaultIsBlockNode,
  findPosition,
  serializePosition,
  type DomPoint,
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
  props?: Record<string, string>,
): HTMLElement => {
  const node = document.createElement(type);

  if (props) {
    Object.entries(props).forEach(([k, v]) => {
      (node as any)[k] = v;
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

const posAt = (
  node: Node,
  path: number[],
  offset: number,
): [node: Node, offset: number] => {
  for (const p of path) {
    node = node.childNodes[p]!;
  }
  if (!path.length) {
    return [node, offset];
  }
  return toRange([node, offset]);
};

const indexOf = (node: Node): number => {
  let i = 0;
  while ((node = node.previousSibling!)) {
    i++;
  }
  return i;
};

const toRange = (pos: DomPoint): DomPoint => {
  if (pos[0].nodeType === Node.ELEMENT_NODE) {
    const [node, offset] = pos;
    let index = indexOf(node);
    if (offset >= 1) {
      index++;
    }
    return [node.parentNode!, index];
  } else {
    return pos;
  }
};

describe("depth 0", () => {
  describe("placeholder", () => {
    const doc = h("div", []);

    it("0", () => {
      const domPos = posAt(doc, [], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      // TODO fix
      // const domPos2 = toRange(findPosition(doc, parser, pos)!);
      // expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("br", () => {
    const doc = h("div", [h("br")]);

    it("0", () => {
      const domPos = posAt(doc, [0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("text", () => {
    const doc = h("div", ["Hello"]);

    it("0 start", () => {
      const domPos = posAt(doc, [0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("text + br", () => {
    const doc = h("div", ["Hello", h("br")]);

    it("0 start", () => {
      const domPos = posAt(doc, [0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("text + br + text", () => {
    const doc = h("div", ["Hello", h("br"), "world"]);

    it("0 end", () => {
      const domPos = posAt(doc, [0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("2 start", () => {
      const domPos = posAt(doc, [2], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("img", () => {
    const doc = h("div", [h("img")]);

    it("0 start", () => {
      const domPos = posAt(doc, [0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 1]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("img + text", () => {
    const doc = h("div", [h("img"), "Hello"]);

    it("0 start", () => {
      const domPos = posAt(doc, [0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 1]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 start", () => {
      const domPos = posAt(doc, [1], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 1]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 end", () => {
      const domPos = posAt(doc, [1], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 6]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("text + img", () => {
    const doc = h("div", ["Hello", h("img")]);

    it("0 start", () => {
      const domPos = posAt(doc, [0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 start", () => {
      const domPos = posAt(doc, [1], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 end", () => {
      const domPos = posAt(doc, [1], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 6]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("text + img + text", () => {
    const doc = h("div", ["Hello", h("img"), "world"]);

    it("0 start", () => {
      const domPos = posAt(doc, [0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 start", () => {
      const domPos = posAt(doc, [1], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 end", () => {
      const domPos = posAt(doc, [1], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 6]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("2 start", () => {
      const domPos = posAt(doc, [2], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 6]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("2 end", () => {
      const domPos = posAt(doc, [2], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 11]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("contenteditable:false", () => {
    const doc = h("div", [h("span", ["void"], { contentEditable: "false" })]);

    it("0 start", () => {
      const domPos = posAt(doc, [0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 1]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("contenteditable:false + text", () => {
    const doc = h("div", [
      h("span", ["void"], { contentEditable: "false" }),
      "Hello",
    ]);

    it("0 start", () => {
      const domPos = posAt(doc, [0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 1]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 start", () => {
      const domPos = posAt(doc, [1], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 1]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 end", () => {
      const domPos = posAt(doc, [1], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 6]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("text + contenteditable:false", () => {
    const doc = h("div", [
      "Hello",
      h("span", ["void"], { contentEditable: "false" }),
    ]);

    it("0 start", () => {
      const domPos = posAt(doc, [0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 start", () => {
      const domPos = posAt(doc, [1], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 end", () => {
      const domPos = posAt(doc, [1], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 6]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("text + contenteditable:false + text", () => {
    const doc = h("div", [
      "Hello",
      h("span", ["void"], { contentEditable: "false" }),
      "world",
    ]);

    it("0 start", () => {
      const domPos = posAt(doc, [0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 start", () => {
      const domPos = posAt(doc, [1], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 end", () => {
      const domPos = posAt(doc, [1], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 6]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("2 start", () => {
      const domPos = posAt(doc, [2], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 6]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("2 end", () => {
      const domPos = posAt(doc, [2], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 11]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("template + text + template", () => {
    const doc = h("div", [h("template"), "Hello", h("template")]);

    it("0 start", () => {
      const domPos = posAt(doc, [1], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [1], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });
});

describe("depth 1", () => {
  describe("placeholder", () => {
    const doc = h("div", [h("div", [])]);

    it("0", () => {
      const domPos = posAt(doc, [0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      // TODO fix
      // const domPos2 = toRange(findPosition(doc, parser, pos)!);
      // expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("br", () => {
    const doc = h("div", [h("div", [h("br")])]);

    it("0", () => {
      const domPos = posAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("text", () => {
    const doc = h("div", [h("div", ["Hello"])]);

    it("0 start", () => {
      const domPos = posAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0, 0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("text + br", () => {
    const doc = h("div", [h("div", ["Hello", h("br")])]);

    it("0 start", () => {
      const domPos = posAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0, 0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("text + br + text", () => {
    const doc = h("div", [h("div", ["Hello", h("br"), "world"])]);

    it("0 end", () => {
      const domPos = posAt(doc, [0, 0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("2 start", () => {
      const domPos = posAt(doc, [0, 2], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("img", () => {
    const doc = h("div", [h("div", [h("img")])]);

    it("0 start", () => {
      const domPos = posAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0, 0], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 1]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("img + text", () => {
    const doc = h("div", [h("div", [h("img"), "Hello"])]);

    it("0 start", () => {
      const domPos = posAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0, 0], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 1]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 start", () => {
      const domPos = posAt(doc, [0, 1], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 1]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 end", () => {
      const domPos = posAt(doc, [0, 1], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 6]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("text + img", () => {
    const doc = h("div", [h("div", ["Hello", h("img")])]);

    it("0 start", () => {
      const domPos = posAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0, 0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 start", () => {
      const domPos = posAt(doc, [0, 1], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 end", () => {
      const domPos = posAt(doc, [0, 1], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 6]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("text + img + text", () => {
    const doc = h("div", [h("div", ["Hello", h("img"), "world"])]);

    it("0 start", () => {
      const domPos = posAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0, 0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 start", () => {
      const domPos = posAt(doc, [0, 1], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 end", () => {
      const domPos = posAt(doc, [0, 1], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 6]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("2 start", () => {
      const domPos = posAt(doc, [0, 2], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 6]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("2 end", () => {
      const domPos = posAt(doc, [0, 2], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 11]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("contenteditable:false", () => {
    const doc = h("div", [
      h("div", [h("span", ["void"], { contentEditable: "false" })]),
    ]);

    it("0 start", () => {
      const domPos = posAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0, 0], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 1]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("contenteditable:false + text", () => {
    const doc = h("div", [
      h("div", [h("span", ["void"], { contentEditable: "false" }), "Hello"]),
    ]);

    it("0 start", () => {
      const domPos = posAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0, 0], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 1]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 start", () => {
      const domPos = posAt(doc, [0, 1], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 1]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 end", () => {
      const domPos = posAt(doc, [0, 1], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 6]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("text + contenteditable:false", () => {
    const doc = h("div", [
      h("div", ["Hello", h("span", ["void"], { contentEditable: "false" })]),
    ]);

    it("0 start", () => {
      const domPos = posAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0, 0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 start", () => {
      const domPos = posAt(doc, [0, 1], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 end", () => {
      const domPos = posAt(doc, [0, 1], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 6]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
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
      const domPos = posAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0, 0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 start", () => {
      const domPos = posAt(doc, [0, 1], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 end", () => {
      const domPos = posAt(doc, [0, 1], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 6]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("2 start", () => {
      const domPos = posAt(doc, [0, 2], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 6]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("2 end", () => {
      const domPos = posAt(doc, [0, 2], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 11]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("template + text + template", () => {
    const doc = h("div", [h("template"), "Hello", h("template")]);

    it("0 start", () => {
      const domPos = posAt(doc, [1], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [1], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("div + div(empty) + div", () => {
    const doc = h("div", [
      h("div", ["Hello"]),
      h("div", [h("br")]),
      h("div", ["world"]),
    ]);

    it("0 start", () => {
      const domPos = posAt(doc, [0, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0, 0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1", () => {
      const domPos = posAt(doc, [1, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[1], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("2 start", () => {
      const domPos = posAt(doc, [2, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[2], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("2 end", () => {
      const domPos = posAt(doc, [2, 0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[2], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("ul", () => {
    const doc = h("div", [h("ul", [h("li", ["Hello"]), h("li", ["world"])])]);

    it("0 start", () => {
      const domPos = posAt(doc, [0, 0, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      // TODO fix
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0, 0, 0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      // TODO fix
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 start", () => {
      const domPos = posAt(doc, [0, 1, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      // TODO fix
      expect(pos).toEqual([[1], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 end", () => {
      const domPos = posAt(doc, [0, 1, 0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      // TODO fix
      expect(pos).toEqual([[1], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("table", () => {
    const doc = h("div", [
      h("table", [h("tr", [h("td", ["Hello"]), h("td", ["world"])])]),
    ]);

    it("0 start", () => {
      const domPos = posAt(doc, [0, 0, 0, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      // TODO fix
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0, 0, 0, 0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      // TODO fix
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 start", () => {
      const domPos = posAt(doc, [0, 0, 1, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      // TODO fix
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 end", () => {
      const domPos = posAt(doc, [0, 0, 1, 0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      // TODO fix
      expect(pos).toEqual([[0], 10]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("div + hr", () => {
    const doc = h("div", [h("div", ["Hello"]), h("hr")]);

    it("0 end", () => {
      const domPos = posAt(doc, [0, 0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 start", () => {
      const domPos = posAt(doc, [1], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 end", () => {
      const domPos = posAt(doc, [1], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 6]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("hr + div", () => {
    const doc = h("div", [h("hr"), h("div", ["Hello"])]);

    it("0 start", () => {
      const domPos = posAt(doc, [0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [0], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      // TODO fix
      expect(pos).toEqual([[1], 0]);
      // const domPos2 = toRange(findPosition(doc, parser, pos)!);
      // expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 start", () => {
      const domPos = posAt(doc, [1, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[1], 0]);
      // TODO fix
      // const domPos2 = toRange(findPosition(doc, parser, pos)!);
      // expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("div + hr + div", () => {
    const doc = h("div", [h("div", ["Hello"]), h("hr"), h("div", ["world"])]);

    it("0 end", () => {
      const domPos = posAt(doc, [0, 0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 start", () => {
      const domPos = posAt(doc, [1], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("1 end", () => {
      const domPos = posAt(doc, [1], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      // TODO fix
      expect(pos).toEqual([[2], 0]);
      // const domPos2 = toRange(findPosition(doc, parser, pos)!);
      // expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("2 start", () => {
      const domPos = posAt(doc, [2, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      // TODO fix
      expect(pos).toEqual([[2], 0]);
      // const domPos2 = toRange(findPosition(doc, parser, pos)!);
      // expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });

  describe("template + div + template", () => {
    const doc = h("div", [h("template"), h("div", ["Hello"]), h("template")]);

    it("0 start", () => {
      const domPos = posAt(doc, [1, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 0]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it("0 end", () => {
      const domPos = posAt(doc, [1, 0], 5);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[0], 5]);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  });
});
