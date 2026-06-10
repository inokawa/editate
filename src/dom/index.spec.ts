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
import type { DomPosition, Path } from "../doc/types.js";
import { isElementNode, isTextNode } from "./utils.js";
import { isHiddenNode } from "./parser.js";

const document = window.document;
const parser = createParser({
  _document: document,
  _isBlock: defaultIsBlockNode,
});

const allowedAttrs = ["contentEditable"] as const;

const h = <
  T extends
    | keyof HTMLElementTagNameMap
    | keyof SVGElementTagNameMap
    | keyof MathMLElementTagNameMap,
>(
  type: T,
  children: (HTMLElement | string)[] = [],
  props?: Record<(typeof allowedAttrs)[number], string>,
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

const posAt = (node: Node, path: Path, offset: number): DomPoint => {
  for (const p of path) {
    node = node.childNodes[p]!;
  }
  if (isElementNode(node) && isHiddenNode(node)) {
    throw new Error(`${elToString(node)} is hidden`);
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
  if (isElementNode(pos[0])) {
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

const elToString = (element: Element): string => {
  let tag = element.tagName.toLowerCase();
  const results: string[] = [];

  const attrs: string[] = [];
  for (const key of allowedAttrs) {
    const value = (element as any)[key];
    if (value != null) {
      attrs.push(`${key}=${value}`);
    }
  }
  if (attrs.length !== 0) {
    tag += `.${attrs.join("/")}`;
  }

  for (const node of element.childNodes) {
    if (isElementNode(node)) {
      results.push(elToString(node));
    } else if (isTextNode(node)) {
      results.push(`"${node.data.replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`);
    }
  }
  if (results.length === 0) {
    return tag;
  }
  return `${tag}[${results.join(",")}]`;
};

{
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

  {
    const doc = h("div", [h("br")]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0], 0],
        [[0], 0],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", ["Hello"]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0], 0],
        [[0], 0],
      ],
      [
        [[0], 5],
        [[0], 5],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", ["Hello", h("br")]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0], 0],
        [[0], 0],
      ],
      [
        [[0], 5],
        [[0], 5],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", ["Hello", h("br"), "world"]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0], 0],
        [[0], 0],
      ],
      [
        [[0], 5],
        [[0], 5],
      ],
      [
        [[2], 0],
        [[0], 5],
      ],
      [
        [[2], 5],
        [[0], 10],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", ["Hello\nworld"]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0], 0],
        [[0], 0],
      ],
      [
        [[0], 5],
        [[0], 5],
      ],
      [
        [[0], 10],
        [[0], 10],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", ["Hello", "\n", "world"]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0], 0],
        [[0], 0],
      ],
      [
        [[0], 5],
        [[0], 5],
      ],
      [
        [[2], 0],
        [[0], 5],
      ],
      [
        [[2], 5],
        [[0], 10],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [h("img")]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0], 0],
        [[0], 0],
      ],
      [
        [[0], 1],
        [[0], 1],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [h("img"), "Hello"]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0], 0],
        [[0], 0],
      ],
      [
        [[0], 1],
        [[0], 1],
      ],
      [
        [[1], 0],
        [[0], 1],
      ],
      [
        [[1], 5],
        [[0], 6],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", ["Hello", h("img")]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0], 0],
        [[0], 0],
      ],
      [
        [[0], 5],
        [[0], 5],
      ],
      [
        [[1], 0],
        [[0], 5],
      ],
      [
        [[1], 1],
        [[0], 6],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", ["Hello", h("img"), "world"]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0], 0],
        [[0], 0],
      ],
      [
        [[0], 5],
        [[0], 5],
      ],
      [
        [[1], 0],
        [[0], 5],
      ],
      [
        [[1], 1],
        [[0], 6],
      ],
      [
        [[2], 0],
        [[0], 6],
      ],
      [
        [[2], 5],
        [[0], 11],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [h("span", ["void"], { contentEditable: "false" })]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0], 0],
        [[0], 0],
      ],
      [
        [[0], 1],
        [[0], 1],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [
      h("span", ["void"], { contentEditable: "false" }),
      "Hello",
    ]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0], 0],
        [[0], 0],
      ],
      [
        [[0], 1],
        [[0], 1],
      ],
      [
        [[1], 0],
        [[0], 1],
      ],
      [
        [[1], 5],
        [[0], 6],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [
      "Hello",
      h("span", ["void"], { contentEditable: "false" }),
    ]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0], 0],
        [[0], 0],
      ],
      [
        [[0], 5],
        [[0], 5],
      ],
      [
        [[1], 0],
        [[0], 5],
      ],
      [
        [[1], 1],
        [[0], 6],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [
      "Hello",
      h("span", ["void"], { contentEditable: "false" }),
      "world",
    ]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0], 0],
        [[0], 0],
      ],
      [
        [[0], 5],
        [[0], 5],
      ],
      [
        [[1], 0],
        [[0], 5],
      ],
      [
        [[1], 1],
        [[0], 6],
      ],
      [
        [[2], 0],
        [[0], 6],
      ],
      [
        [[2], 5],
        [[0], 11],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [h("template"), "Hello", h("template")]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[1], 0],
        [[0], 0],
      ],
      [
        [[1], 5],
        [[0], 5],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }
}

{
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

  {
    const doc = h("div", [h("div", [h("br")])]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0], 0],
        [[0], 0],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [h("div", ["Hello"])]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0], 0],
        [[0], 0],
      ],
      [
        [[0, 0], 5],
        [[0], 5],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [h("div", ["Hello", h("br")])]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0], 0],
        [[0], 0],
      ],
      [
        [[0, 0], 5],
        [[0], 5],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [h("div", ["Hello", h("br"), "world"])]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0], 0],
        [[0], 0],
      ],
      [
        [[0, 0], 5],
        [[0], 5],
      ],
      [
        [[0, 2], 0],
        [[0], 5],
      ],
      [
        [[0, 2], 5],
        [[0], 10],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [h("div", ["Hello", "\n", "world"])]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0], 0],
        [[0], 0],
      ],
      [
        [[0, 0], 5],
        [[0], 5],
      ],
      [
        [[0, 2], 0],
        [[0], 5],
      ],
      [
        [[0, 2], 5],
        [[0], 10],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [h("div", ["Hello\nworld"])]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0], 0],
        [[0], 0],
      ],
      [
        [[0, 0], 5],
        [[0], 5],
      ],
      [
        [[0, 0], 10],
        [[0], 10],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [h("div", [h("img")])]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0], 0],
        [[0], 0],
      ],
      [
        [[0, 0], 1],
        [[0], 1],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [h("div", [h("img"), "Hello"])]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0], 0],
        [[0], 0],
      ],
      [
        [[0, 0], 1],
        [[0], 1],
      ],
      [
        [[0, 1], 0],
        [[0], 1],
      ],
      [
        [[0, 1], 5],
        [[0], 6],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [h("div", ["Hello", h("img")])]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0], 0],
        [[0], 0],
      ],
      [
        [[0, 0], 5],
        [[0], 5],
      ],
      [
        [[0, 1], 0],
        [[0], 5],
      ],
      [
        [[0, 1], 1],
        [[0], 6],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [h("div", ["Hello", h("img"), "world"])]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0], 0],
        [[0], 0],
      ],
      [
        [[0, 0], 5],
        [[0], 5],
      ],
      [
        [[0, 1], 0],
        [[0], 5],
      ],
      [
        [[0, 1], 1],
        [[0], 6],
      ],
      [
        [[0, 2], 0],
        [[0], 6],
      ],
      [
        [[0, 2], 5],
        [[0], 11],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [
      h("div", [h("span", ["void"], { contentEditable: "false" })]),
    ]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0], 0],
        [[0], 0],
      ],
      [
        [[0, 0], 1],
        [[0], 1],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [
      h("div", [h("span", ["void"], { contentEditable: "false" }), "Hello"]),
    ]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0], 0],
        [[0], 0],
      ],
      [
        [[0, 0], 1],
        [[0], 1],
      ],
      [
        [[0, 1], 0],
        [[0], 1],
      ],
      [
        [[0, 1], 5],
        [[0], 6],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [
      h("div", ["Hello", h("span", ["void"], { contentEditable: "false" })]),
    ]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0], 0],
        [[0], 0],
      ],
      [
        [[0, 0], 5],
        [[0], 5],
      ],
      [
        [[0, 1], 0],
        [[0], 5],
      ],
      [
        [[0, 1], 1],
        [[0], 6],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [
      h("div", [
        "Hello",
        h("span", ["void"], { contentEditable: "false" }),
        "world",
      ]),
    ]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0], 0],
        [[0], 0],
      ],
      [
        [[0, 0], 5],
        [[0], 5],
      ],
      [
        [[0, 1], 0],
        [[0], 5],
      ],
      [
        [[0, 1], 1],
        [[0], 6],
      ],
      [
        [[0, 2], 0],
        [[0], 6],
      ],
      [
        [[0, 2], 5],
        [[0], 11],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [h("template"), "Hello", h("template")]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[1], 0],
        [[0], 0],
      ],
      [
        [[1], 5],
        [[0], 5],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [
      h("div", ["Hello"]),
      h("div", [h("br")]),
      h("div", ["world"]),
    ]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0], 0],
        [[0], 0],
      ],
      [
        [[0, 0], 5],
        [[0], 5],
      ],
      [
        [[1, 0], 0],
        [[1], 0],
      ],
      [
        [[2, 0], 0],
        [[2], 0],
      ],
      [
        [[2, 0], 5],
        [[2], 5],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [
      h("ul", [h("li", ["Hello"]), h("li", ["world"]), h("li", ["world"])]),
    ]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0, 0], 0],
        [[0], 0], // TODO fix
      ],
      [
        [[0, 0, 0], 5],
        [[0], 5], // TODO fix
      ],
      [
        [[0, 1, 0], 0],
        [[1], 0], // TODO fix
      ],
      [
        [[0, 1, 0], 5],
        [[1], 5], // TODO fix
      ],
      [
        [[0, 2, 0], 0],
        [[2], 0], // TODO fix
      ],
      [
        [[0, 2, 0], 5],
        [[2], 5], // TODO fix
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [
      h("table", [
        h("tbody", [
          h("tr", [h("td", ["Hello"]), h("td", ["world"])]),
          h("tr", [h("td", ["Hello"]), h("td", ["world"])]),
        ]),
      ]),
    ]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0, 0, 0, 0], 0],
        [[0], 0], // TODO fix
      ],
      [
        [[0, 0, 0, 0, 0], 5],
        [[0], 5], // TODO fix
      ],
      [
        [[0, 0, 0, 1, 0], 0],
        [[1], 0], // TODO fix
      ],
      [
        [[0, 0, 0, 1, 0], 5],
        [[1], 5], // TODO fix
      ],
      [
        [[0, 0, 1, 0, 0], 0],
        [[0], 0], // TODO fix
      ],
      [
        [[0, 0, 1, 0, 0], 5],
        [[0], 5], // TODO fix
      ],
      [
        [[0, 0, 1, 1, 0], 0],
        [[1], 0], // TODO fix
      ],
      [
        [[0, 0, 1, 1, 0], 5],
        [[1], 5], // TODO fix
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [h("div", ["Hello"]), h("hr")]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0], 5],
        [[0], 5],
      ],
      [
        [[1], 0],
        [[0], 5],
      ],
      [
        [[1], 1],
        [[0], 6],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [h("hr"), h("div", ["Hello"])]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0], 0],
        [[0], 0],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it(`${elToString(doc)}: 0 end`, () => {
      const domPos = posAt(doc, [0], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      // TODO fix
      expect(pos).toEqual([[1], 0]);
      // const domPos2 = toRange(findPosition(doc, parser, pos)!);
      // expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it(`${elToString(doc)}: 1 start`, () => {
      const domPos = posAt(doc, [1, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual([[1], 0]);
      // TODO fix
      // const domPos2 = toRange(findPosition(doc, parser, pos)!);
      // expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [h("div", ["Hello"]), h("hr"), h("div", ["world"])]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[0, 0], 5],
        [[0], 5],
      ],
      [
        [[1], 0],
        [[0], 5],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it(`${elToString(doc)}: 1 end`, () => {
      const domPos = posAt(doc, [1], 1);
      const pos = serializePosition(doc, parser, ...domPos);
      // TODO fix
      expect(pos).toEqual([[2], 0]);
      // const domPos2 = toRange(findPosition(doc, parser, pos)!);
      // expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });

    it(`${elToString(doc)}: 2 start`, () => {
      const domPos = posAt(doc, [2, 0], 0);
      const pos = serializePosition(doc, parser, ...domPos);
      // TODO fix
      expect(pos).toEqual([[2], 0]);
      // const domPos2 = toRange(findPosition(doc, parser, pos)!);
      // expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }

  {
    const doc = h("div", [h("template"), h("div", ["Hello"]), h("template")]);

    it.for<[DomPosition, DomPosition]>([
      [
        [[1, 0], 0],
        [[0], 0],
      ],
      [
        [[1, 0], 5],
        [[0], 5],
      ],
    ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
      const domPos = posAt(doc, ...p);
      const pos = serializePosition(doc, parser, ...domPos);
      expect(pos).toEqual(expectedPos);
      const domPos2 = toRange(findPosition(doc, parser, pos)!);
      expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
    });
  }
}
