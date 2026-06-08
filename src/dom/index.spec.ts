/**
 * @vitest-environment jsdom
 */
import { JSDOM } from "jsdom";
import { afterAll, describe, expect, it } from "vitest";
import {
  createParser,
  defaultIsBlockNode,
  findPosition,
  serializePosition,
} from "./index.js";

type DomPosition = [node: Node, offset: number];

const context = () => {
  const jsdom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    url: "https://localhost",
  });
  const window = jsdom.window;
  const document = window.document;
  const parser = createParser({
    _document: document,
    _isBlock: defaultIsBlockNode,
  });
  const builder = <
    T extends
      | keyof HTMLElementTagNameMap
      | keyof SVGElementTagNameMap
      | keyof MathMLElementTagNameMap,
  >(
    type: T,
    children: (HTMLElement | string)[] = [],
  ): HTMLElement => {
    const node = document.createElement(type);

    children.forEach((c) => {
      if (typeof c === "string") {
        node.appendChild(document.createTextNode(c));
      } else {
        node.appendChild(c);
      }
    });

    return node;
  };
  return {
    h: builder,
    parser,
    cleanup: () => {
      window.close();
    },
  };
};

const nodeAtPath = (node: Node, path: number[]): Node => {
  for (const i of path) {
    node = node.childNodes[i]!;
  }
  return node;
};

const { h, parser, cleanup } = context();
afterAll(cleanup);

describe("div", () => {
  describe("br", () => {
    const doc = h("div", [h("br")]);

    it("0", () => {
      const node = nodeAtPath(doc, [0]);
      const domPos: DomPosition = [node, 0];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("text", () => {
    const doc = h("div", ["Hello"]);

    it("0 start", () => {
      const node = nodeAtPath(doc, [0]);
      const domPos: DomPosition = [node, 0];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const node = nodeAtPath(doc, [0]);
      const domPos: DomPosition = [node, 5];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("text + br", () => {
    const doc = h("div", ["Hello", h("br")]);

    it("0 start", () => {
      const node = nodeAtPath(doc, [0]);
      const domPos: DomPosition = [node, 0];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const node = nodeAtPath(doc, [0]);
      const domPos: DomPosition = [node, 5];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("void", () => {
    const doc = h("div", [h("img")]);

    it("0 start", () => {
      const node = nodeAtPath(doc, [0]);
      const domPos: DomPosition = [node, 0];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const node = nodeAtPath(doc, [0]);
      const domPos: DomPosition = [node, 1];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 1]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("void + text", () => {
    const doc = h("div", [h("img"), "Hello"]);

    it("0 start", () => {
      const node = nodeAtPath(doc, [0]);
      const domPos: DomPosition = [node, 0];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const node = nodeAtPath(doc, [0]);
      const domPos: DomPosition = [node, 1];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 1]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("1 start", () => {
      const node = nodeAtPath(doc, [1]);
      const domPos: DomPosition = [node, 0];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 1]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 end", () => {
      const node = nodeAtPath(doc, [1]);
      const domPos: DomPosition = [node, 5];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("text + void", () => {
    const doc = h("div", ["Hello", h("img")]);

    it("0 start", () => {
      const node = nodeAtPath(doc, [0]);
      const domPos: DomPosition = [node, 0];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const node = nodeAtPath(doc, [0]);
      const domPos: DomPosition = [node, 5];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("1 start", () => {
      const node = nodeAtPath(doc, [1]);
      const domPos: DomPosition = [node, 0];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 end", () => {
      const node = nodeAtPath(doc, [1]);
      const domPos: DomPosition = [node, 1];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("text + void + text", () => {
    const doc = h("div", ["Hello", h("img"), "world"]);

    it("0 start", () => {
      const node = nodeAtPath(doc, [0]);
      const domPos: DomPosition = [node, 0];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 0]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("0 end", () => {
      const node = nodeAtPath(doc, [0]);
      const domPos: DomPosition = [node, 5];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("1 start", () => {
      const node = nodeAtPath(doc, [1]);
      const domPos: DomPosition = [node, 0];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 5]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("1 end", () => {
      const node = nodeAtPath(doc, [1]);
      const domPos: DomPosition = [node, 1];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });

    it("2 start", () => {
      const node = nodeAtPath(doc, [2]);
      const domPos: DomPosition = [node, 0];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 6]);
      // TODO affinity
      expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
    });

    it("2 end", () => {
      const node = nodeAtPath(doc, [2]);
      const domPos: DomPosition = [node, 5];
      const pos = serializePosition(doc, ...domPos, parser);
      expect(pos).toEqual([[0], 11]);
      expect(findPosition(doc, pos, parser)).toEqual(domPos);
    });
  });

  describe("div", () => {
    describe("br", () => {
      const doc = h("div", [h("div", [h("br")])]);

      it("0", () => {
        const node = nodeAtPath(doc, [0, 0]);
        const domPos: DomPosition = [node, 0];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 0]);
        expect(findPosition(doc, pos, parser)).toEqual(domPos);
      });
    });

    describe("text", () => {
      const doc = h("div", [h("div", ["Hello"])]);

      it("0 start", () => {
        const node = nodeAtPath(doc, [0, 0]);
        const domPos: DomPosition = [node, 0];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 0]);
        expect(findPosition(doc, pos, parser)).toEqual(domPos);
      });

      it("0 end", () => {
        const node = nodeAtPath(doc, [0, 0]);
        const domPos: DomPosition = [node, 5];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 5]);
        expect(findPosition(doc, pos, parser)).toEqual(domPos);
      });
    });

    describe("text + br", () => {
      const doc = h("div", [h("div", ["Hello", h("br")])]);

      it("0 start", () => {
        const node = nodeAtPath(doc, [0, 0]);
        const domPos: DomPosition = [node, 0];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 0]);
        expect(findPosition(doc, pos, parser)).toEqual(domPos);
      });

      it("0 end", () => {
        const node = nodeAtPath(doc, [0, 0]);
        const domPos: DomPosition = [node, 5];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 5]);
        expect(findPosition(doc, pos, parser)).toEqual(domPos);
      });
    });

    describe("void", () => {
      const doc = h("div", [h("div", [h("img")])]);

      it("0 start", () => {
        const node = nodeAtPath(doc, [0, 0]);
        const domPos: DomPosition = [node, 0];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 0]);
        expect(findPosition(doc, pos, parser)).toEqual(domPos);
      });

      it("0 end", () => {
        const node = nodeAtPath(doc, [0, 0]);
        const domPos: DomPosition = [node, 1];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 1]);
        expect(findPosition(doc, pos, parser)).toEqual(domPos);
      });
    });

    describe("void + text", () => {
      const doc = h("div", [h("div", [h("img"), "Hello"])]);

      it("0 start", () => {
        const node = nodeAtPath(doc, [0, 0]);
        const domPos: DomPosition = [node, 0];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 0]);
        expect(findPosition(doc, pos, parser)).toEqual(domPos);
      });

      it("0 end", () => {
        const node = nodeAtPath(doc, [0, 0]);
        const domPos: DomPosition = [node, 1];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 1]);
        expect(findPosition(doc, pos, parser)).toEqual(domPos);
      });

      it("1 start", () => {
        const node = doc.childNodes[0]!.childNodes[1]!;
        const domPos: DomPosition = [node, 0];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 1]);
        // TODO affinity
        expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
      });

      it("1 end", () => {
        const node = doc.childNodes[0]!.childNodes[1]!;
        const domPos: DomPosition = [node, 5];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 6]);
        expect(findPosition(doc, pos, parser)).toEqual(domPos);
      });
    });

    describe("text + void", () => {
      const doc = h("div", [h("div", ["Hello", h("img")])]);

      it("0 start", () => {
        const node = nodeAtPath(doc, [0, 0]);
        const domPos: DomPosition = [node, 0];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 0]);
        expect(findPosition(doc, pos, parser)).toEqual(domPos);
      });

      it("0 end", () => {
        const node = nodeAtPath(doc, [0, 0]);
        const domPos: DomPosition = [node, 5];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 5]);
        expect(findPosition(doc, pos, parser)).toEqual(domPos);
      });

      it("1 start", () => {
        const node = nodeAtPath(doc, [0, 1]);
        const domPos: DomPosition = [node, 0];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 5]);
        // TODO affinity
        expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
      });

      it("1 end", () => {
        const node = nodeAtPath(doc, [0, 1]);
        const domPos: DomPosition = [node, 1];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 6]);
        expect(findPosition(doc, pos, parser)).toEqual(domPos);
      });
    });

    describe("text + void + text", () => {
      const doc = h("div", [h("div", ["Hello", h("img"), "world"])]);

      it("0 start", () => {
        const node = nodeAtPath(doc, [0, 0]);
        const domPos: DomPosition = [node, 0];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 0]);
        expect(findPosition(doc, pos, parser)).toEqual(domPos);
      });

      it("0 end", () => {
        const node = nodeAtPath(doc, [0, 0]);
        const domPos: DomPosition = [node, 5];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 5]);
        expect(findPosition(doc, pos, parser)).toEqual(domPos);
      });

      it("1 start", () => {
        const node = nodeAtPath(doc, [0, 1]);
        const domPos: DomPosition = [node, 0];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 5]);
        // TODO affinity
        expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
      });

      it("1 end", () => {
        const node = nodeAtPath(doc, [0, 1]);
        const domPos: DomPosition = [node, 1];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 6]);
        expect(findPosition(doc, pos, parser)).toEqual(domPos);
      });

      it("2 start", () => {
        const node = nodeAtPath(doc, [0, 2]);
        const domPos: DomPosition = [node, 0];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 6]);
        // TODO affinity
        expect(findPosition(doc, pos, parser)).not.toEqual(domPos);
      });

      it("2 end", () => {
        const node = nodeAtPath(doc, [0, 2]);
        const domPos: DomPosition = [node, 5];
        const pos = serializePosition(doc, ...domPos, parser);
        expect(pos).toEqual([[0], 11]);
        expect(findPosition(doc, pos, parser)).toEqual(domPos);
      });
    });
  });
});
