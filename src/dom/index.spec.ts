/**
 * @vitest-environment jsdom
 */
import { expect, it } from "vitest";
import {
  createParser,
  findPosition,
  serializePosition,
  type DomPoint,
} from "./index.js";
import type { DomPosition, Path } from "../doc/types.js";
import { isElementNode, isTextNode } from "./utils.js";
import { isHiddenNode } from "./parser.js";

// https://w3c.github.io/contentEditable/#dfn-legal-caret-positions

const document = window.document;
const parser = createParser(document);

const allowedAttrs = ["contentEditable"] as const;

type DomPath = [Path, number];

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
  return [node, offset];
};

const indexOf = (node: Node): number => {
  let i = 0;
  while ((node = node.previousSibling!)) {
    i++;
  }
  return i;
};

const toRange = (pos: DomPoint): DomPoint => {
  if (isElementNode(pos[0]) && pos[0].parentNode) {
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
  const doc = h("div", []);

  it.for<[DomPath, DomPosition]>([
    [
      [[], 0],
      [0, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [h("br")]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0], 0],
      [0, true],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", ["Hello"]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0], 0],
      [0, true],
    ],
    [
      [[0], 5],
      [5, false],
    ],
    // firefox
    [
      [[], 0],
      [0, true],
    ],
    [
      [[], 1],
      [5, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", ["Hello", h("br")]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0], 0],
      [0, true],
    ],
    [
      [[0], 5],
      [5, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", ["Hello", h("br"), "world"]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0], 0],
      [0, true],
    ],
    [
      [[0], 5],
      [5, false],
    ],
    [
      [[2], 0],
      [5, false],
    ],
    [
      [[2], 5],
      [10, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", ["Hello\nworld"]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0], 0],
      [0, true],
    ],
    [
      [[0], 5],
      [5, false],
    ],
    [
      [[0], 10],
      [10, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", ["Hello", "\n", "world"]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0], 0],
      [0, true],
    ],
    [
      [[0], 5],
      [5, false],
    ],
    [
      [[2], 0],
      [5, false],
    ],
    [
      [[2], 5],
      [10, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [h("img")]);

  it.for<[DomPath, DomPosition]>([
    [
      [[], 0],
      [0, true],
    ],
    [
      [[], 1],
      [1, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [h("img"), "Hello"]);

  it.for<[DomPath, DomPosition]>([
    [
      [[], 0],
      [0, true],
    ],
    [
      [[], 1],
      [1, false],
    ],
    [
      [[1], 0],
      [1, false],
    ],
    [
      [[1], 5],
      [6, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", ["Hello", h("img")]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0], 0],
      [0, true],
    ],
    [
      [[0], 5],
      [5, false],
    ],
    [
      [[], 1],
      [5, false],
    ],
    [
      [[], 2],
      [6, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", ["Hello", h("img"), "world"]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0], 0],
      [0, true],
    ],
    [
      [[0], 5],
      [5, false],
    ],
    [
      [[], 1],
      [5, false],
    ],
    [
      [[], 2],
      [6, false],
    ],
    [
      [[2], 0],
      [6, false],
    ],
    [
      [[2], 5],
      [11, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [h("span", ["void"], { contentEditable: "false" })]);

  it.for<[DomPath, DomPosition]>([
    [
      [[], 0],
      [0, true],
    ],
    [
      [[], 1],
      [1, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [
    h("span", ["void"], { contentEditable: "false" }),
    "Hello",
  ]);

  it.for<[DomPath, DomPosition]>([
    [
      [[], 0],
      [0, true],
    ],
    [
      [[], 1],
      [1, false],
    ],
    [
      [[1], 0],
      [1, false],
    ],
    [
      [[1], 5],
      [6, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [
    "Hello",
    h("span", ["void"], { contentEditable: "false" }),
  ]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0], 0],
      [0, true],
    ],
    [
      [[0], 5],
      [5, false],
    ],
    [
      [[], 1],
      [5, false],
    ],
    [
      [[], 2],
      [6, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [
    "Hello",
    h("span", ["void"], { contentEditable: "false" }),
    "world",
  ]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0], 0],
      [0, true],
    ],
    [
      [[0], 5],
      [5, false],
    ],
    [
      [[], 1],
      [5, false],
    ],
    [
      [[], 2],
      [6, false],
    ],
    [
      [[2], 0],
      [6, false],
    ],
    [
      [[2], 5],
      [11, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [h("template"), "Hello", h("template")]);

  it.for<[DomPath, DomPosition]>([
    [
      [[1], 0],
      [0, true],
    ],
    [
      [[1], 5],
      [5, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [h("div", [])]);

  it.for<[DomPath, DomPosition]>([
    [
      [[], 0],
      [0, true],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [h("div", [h("br")])]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0, 0], 0],
      [0, true],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [h("div", ["Hello"])]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0, 0], 0],
      [0, true],
    ],
    [
      [[0, 0], 5],
      [5, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [h("div", ["Hello", h("br")])]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0, 0], 0],
      [0, true],
    ],
    [
      [[0, 0], 5],
      [5, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [h("div", ["Hello", h("br"), "world"])]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0, 0], 0],
      [0, true],
    ],
    [
      [[0, 0], 5],
      [5, false],
    ],
    [
      [[0, 2], 0],
      [5, false],
    ],
    [
      [[0, 2], 5],
      [10, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [h("div", ["Hello", "\n", "world"])]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0, 0], 0],
      [0, true],
    ],
    [
      [[0, 0], 5],
      [5, false],
    ],
    [
      [[0, 2], 0],
      [5, false],
    ],
    [
      [[0, 2], 5],
      [10, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [h("div", ["Hello\nworld"])]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0, 0], 0],
      [0, true],
    ],
    [
      [[0, 0], 5],
      [5, false],
    ],
    [
      [[0, 0], 10],
      [10, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [h("div", [h("img")])]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0], 0],
      [0, true],
    ],
    [
      [[0], 1],
      [1, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [h("div", [h("img"), "Hello"])]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0], 0],
      [0, true],
    ],
    [
      [[0], 1],
      [1, false],
    ],
    [
      [[0, 1], 0],
      [1, false],
    ],
    [
      [[0, 1], 5],
      [6, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [h("div", ["Hello", h("img")])]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0, 0], 0],
      [0, true],
    ],
    [
      [[0, 0], 5],
      [5, false],
    ],
    [
      [[0], 1],
      [5, false],
    ],
    [
      [[0], 2],
      [6, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [h("div", ["Hello", h("img"), "world"])]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0, 0], 0],
      [0, true],
    ],
    [
      [[0, 0], 5],
      [5, false],
    ],
    [
      [[0], 1],
      [5, false],
    ],
    [
      [[0], 2],
      [6, false],
    ],
    [
      [[0, 2], 0],
      [6, false],
    ],
    [
      [[0, 2], 5],
      [11, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [
    h("div", [h("span", ["void"], { contentEditable: "false" })]),
  ]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0], 0],
      [0, true],
    ],
    [
      [[0], 1],
      [1, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [
    h("div", [h("span", ["void"], { contentEditable: "false" }), "Hello"]),
  ]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0], 0],
      [0, true],
    ],
    [
      [[0], 1],
      [1, false],
    ],
    [
      [[0, 1], 0],
      [1, false],
    ],
    [
      [[0, 1], 5],
      [6, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [
    h("div", ["Hello", h("span", ["void"], { contentEditable: "false" })]),
  ]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0, 0], 0],
      [0, true],
    ],
    [
      [[0, 0], 5],
      [5, false],
    ],
    [
      [[0], 1],
      [5, false],
    ],
    [
      [[0], 2],
      [6, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
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

  it.for<[DomPath, DomPosition]>([
    [
      [[0, 0], 0],
      [0, true],
    ],
    [
      [[0, 0], 5],
      [5, false],
    ],
    [
      [[0], 1],
      [5, false],
    ],
    [
      [[0], 2],
      [6, false],
    ],
    [
      [[0, 2], 0],
      [6, false],
    ],
    [
      [[0, 2], 5],
      [11, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [h("template"), "Hello", h("template")]);

  it.for<[DomPath, DomPosition]>([
    [
      [[1], 0],
      [0, true],
    ],
    [
      [[1], 5],
      [5, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [
    h("div", ["Hello"]),
    h("div", [h("br")]),
    h("div", ["world"]),
  ]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0, 0], 0],
      [0, true],
    ],
    [
      [[0, 0], 5],
      [5, false],
    ],
    [
      [[1], 0],
      [5, true],
    ],
    [
      [[1, 0], 0],
      [5, true],
    ],
    [
      [[2, 0], 0],
      [5, true],
    ],
    [
      [[2, 0], 5],
      [10, false],
    ],
    // firefox
    [
      [[], 0],
      [0, true],
    ],
    [
      [[1], 1],
      [5, false],
    ],
    [
      [[], 3],
      [10, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [
    h("ul", [h("li", ["Hello"]), h("li", ["world"]), h("li", ["world"])]),
  ]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0, 0, 0], 0],
      [0, true], // TODO fix
    ],
    [
      [[0, 0, 0], 5],
      [5, false], // TODO fix
    ],
    [
      [[0, 1, 0], 0],
      [5, true], // TODO fix
    ],
    [
      [[0, 1, 0], 5],
      [10, false], // TODO fix
    ],
    [
      [[0, 2, 0], 0],
      [10, true], // TODO fix
    ],
    [
      [[0, 2, 0], 5],
      [15, false], // TODO fix
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
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

  it.for<[DomPath, DomPosition]>([
    [
      [[0, 0, 0, 0, 0], 0],
      [0, true], // TODO fix
    ],
    [
      [[0, 0, 0, 0, 0], 5],
      [5, false], // TODO fix
    ],
    [
      [[0, 0, 0, 1, 0], 0],
      [5, true], // TODO fix
    ],
    [
      [[0, 0, 0, 1, 0], 5],
      [10, false], // TODO fix
    ],
    [
      [[0, 0, 1, 0, 0], 0],
      [10, true], // TODO fix
    ],
    [
      [[0, 0, 1, 0, 0], 5],
      [15, false], // TODO fix
    ],
    [
      [[0, 0, 1, 1, 0], 0],
      [15, true], // TODO fix
    ],
    [
      [[0, 0, 1, 1, 0], 5],
      [20, false], // TODO fix
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [
    h("table", [
      h("thead", [h("tr", [h("th", ["Hello"]), h("th", ["world"])])]),
      h("tbody", [h("tr", [h("td", ["Hello"]), h("td", ["world"])])]),
    ]),
  ]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0, 0, 0, 0, 0], 0],
      [0, true], // TODO fix
    ],
    [
      [[0, 0, 0, 0, 0], 5],
      [5, false], // TODO fix
    ],
    [
      [[0, 0, 0, 1, 0], 0],
      [5, true], // TODO fix
    ],
    [
      [[0, 0, 0, 1, 0], 5],
      [10, false], // TODO fix
    ],
    [
      [[0, 1, 0, 0, 0], 0],
      [10, true], // TODO fix
    ],
    [
      [[0, 1, 0, 0, 0], 5],
      [15, false], // TODO fix
    ],
    [
      [[0, 1, 0, 1, 0], 0],
      [15, true], // TODO fix
    ],
    [
      [[0, 1, 0, 1, 0], 5],
      [20, false], // TODO fix
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

{
  const doc = h("div", [
    h("table", [
      h("colgroup", [h("col"), h("col")]),
      h("tbody", [h("tr", [h("td", ["Hello"]), h("td", ["world"])])]),
    ]),
  ]);

  it.for<[DomPath, DomPosition]>([
    [
      [[0, 1, 0, 0, 0], 0],
      [0, true], // TODO fix
    ],
    [
      [[0, 1, 0, 0, 0], 5],
      [5, false], // TODO fix
    ],
    [
      [[0, 1, 0, 1, 0], 0],
      [5, true], // TODO fix
    ],
    [
      [[0, 1, 0, 1, 0], 5],
      [10, false], // TODO fix
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}

// {
//   const doc = h("div", [h("div", ["Hello"]), h("hr")]);

//   it.for<[DomPath, DomPosition]>([
//     [
//       [[0, 0], 0],
//       [[0], 0],
//     ],
//     [
//       [[0, 0], 5],
//       [[0], 5],
//     ],
//     [
//       [[], 1],
//       [[0], 5],
//     ],
//     [
//       [[], 2],
//       [[0], 6],
//     ],
//   ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
//     const domPos = posAt(doc, ...p);
//     const pos = serializePosition(doc, parser, ...domPos);
//     expect(pos).toEqual(expectedPos);
//     const domPos2 = toRange(findPosition(doc, parser, pos));
//     expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
//   });
// }

// {
//   const doc = h("div", [h("hr"), h("div", ["Hello"])]);

//   it.for<[DomPath, DomPosition]>([
//     [
//       [[], 0],
//       [[0], 0],
//     ],
//     [
//       [[], 1],
//       [[1], 0],
//     ],
//     [
//       [[1], 0],
//       [[1], 0],
//     ],
//     [
//       [[1], 5],
//       [[1], 5],
//     ],
//   ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
//     const domPos = posAt(doc, ...p);
//     const pos = serializePosition(doc, parser, ...domPos);
//     expect(pos).toEqual(expectedPos);
//     const domPos2 = toRange(findPosition(doc, parser, pos));
//     expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
//   });
// }

// {
//   const doc = h("div", [h("div", ["Hello"]), h("hr"), h("div", ["world"])]);

//   it.for<[DomPath, DomPosition]>([
//     [
//       [[0, 0], 0],
//       [[0], 0],
//     ],
//     [
//       [[0, 0], 5],
//       [[0], 5],
//     ],
//     [
//       [[], 1],
//       [[0], 5],
//     ],
//     [
//       [[], 2],
//       [[0], 6],
//     ],
//     [
//       [[2, 0], 0],
//       [[0], 6],
//     ],
//     [
//       [[2, 0], 5],
//       [[0], 11],
//     ],
//   ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
//     const domPos = posAt(doc, ...p);
//     const pos = serializePosition(doc, parser, ...domPos);
//     expect(pos).toEqual(expectedPos);
//     const domPos2 = toRange(findPosition(doc, parser, pos));
//     expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
//   });
// }

{
  const doc = h("div", [h("template"), h("div", ["Hello"]), h("template")]);

  it.for<[DomPath, DomPosition]>([
    [
      [[1, 0], 0],
      [0, true],
    ],
    [
      [[1, 0], 5],
      [5, false],
    ],
  ])(`${elToString(doc)}: $0 $1`, ([p, expectedPos]) => {
    const domPos = posAt(doc, ...p);
    const pos = serializePosition(doc, parser, ...domPos);
    expect(pos).toEqual(expectedPos);
    const domPos2 = toRange(findPosition(doc, parser, pos));
    expect(serializePosition(doc, parser, ...domPos2)).toEqual(pos);
  });
}
