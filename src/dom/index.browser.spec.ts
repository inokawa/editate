import { describe, expect, it, onTestFinished } from "vitest";
import { createParser, defaultIsBlockNode, rangeToRect } from "./index.js";
import type { DocNode } from "../doc/types.js";

const IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";

const render = (html: string, style = ""): HTMLElement => {
  const element = document.body.appendChild(document.createElement("div"));
  element.style.cssText = "font: 20px monospace;" + style;
  element.innerHTML = html;
  onTestFinished(() => {
    element.remove();
  });
  return element;
};

const parser = createParser(document, defaultIsBlockNode);

const domRange = (
  [startNode, startOffset]: [Node, number],
  [endNode, endOffset]: [Node, number] = [startNode, startOffset],
): DOMRect => {
  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  return range.getBoundingClientRect();
};

describe("rangeToRect", () => {
  it("caret in text", () => {
    const doc: DocNode = { children: [{ children: [{ text: "abc" }] }] };
    const element = render("<div>abc</div>");
    const text = element.firstChild!.firstChild!;
    expect(rangeToRect(element, parser, doc, [1, 1]).toJSON()).toEqual(
      domRange([text, 1]).toJSON(),
    );
  });

  it("range across blocks", () => {
    const doc: DocNode = {
      children: [
        { children: [{ text: "abc" }] },
        { children: [{ text: "de" }] },
      ],
    };
    const element = render("<div>abc</div><div>de</div>");
    const [a, b] = element.children;
    expect(rangeToRect(element, parser, doc, [1, 5]).toJSON()).toEqual(
      domRange([a!.firstChild!, 1], [b!.firstChild!, 1]).toJSON(),
    );
  });

  it("caret on an empty line", () => {
    const doc: DocNode = {
      children: [{ children: [{ text: "ab" }] }, { children: [{ text: "" }] }],
    };
    const element = render("<div>ab</div><div><br></div>");
    expect(rangeToRect(element, parser, doc, [3, 3]).toJSON()).toEqual(
      element.querySelector("br")!.getBoundingClientRect().toJSON(),
    );
  });

  it("caret next to a void", () => {
    const doc: DocNode = {
      children: [{ children: [{ text: "ab" }, { type: "image" }] }],
    };
    const element = render(`<div>ab<img src="${IMAGE}"></div>`);
    expect(rangeToRect(element, parser, doc, [3, 3]).toJSON()).toEqual(
      element.querySelector("img")!.getBoundingClientRect().toJSON(),
    );
  });

  it("range from a void", () => {
    const doc: DocNode = {
      children: [{ children: [{ type: "image" }, { text: "ab" }] }],
    };
    const element = render(`<div><img src="${IMAGE}">ab</div>`);
    const block = element.firstChild!;
    expect(rangeToRect(element, parser, doc, [0, 3]).toJSON()).toEqual(
      domRange([block, 0], [block.lastChild!, 2]).toJSON(),
    );
  });

  it("caret in an empty root", () => {
    const doc: DocNode = { children: [{ children: [{ text: "" }] }] };
    // rendered without <br> to show a placeholder with :empty
    const element = render("", "min-height: 20px");
    expect(rangeToRect(element, parser, doc, [0, 0]).toJSON()).toEqual(
      element.getBoundingClientRect().toJSON(),
    );
  });

  it("caret in a vertical writing mode", () => {
    const text = "a".repeat(100);
    const doc: DocNode = { children: [{ children: [{ text }] }] };
    const element = render(`<div>${text}</div>`, "writing-mode: vertical-rl");
    const node = element.firstChild!.firstChild!;
    const last = domRange([node, 99], [node, 100]);
    // WebKit reports an empty rect, so the character next to the caret is measured instead, or the one before it at the end. Firefox reports a caret as long as the rest of the line.
    for (const [offset, y] of [
      [99, last.top],
      [100, last.bottom],
    ] as const) {
      const rect = rangeToRect(element, parser, doc, [offset, offset]);
      expect(rect.top).toBeLessThanOrEqual(y + 0.5);
      expect(rect.bottom).toBeGreaterThanOrEqual(y - 0.5);
      expect(rect.height).toBeLessThanOrEqual(last.height + 0.5);
    }
  });
});
