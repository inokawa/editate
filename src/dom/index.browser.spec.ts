import { describe, expect, it, onTestFinished } from "vitest";
import { createParser, defaultIsBlockNode, rangeToRect } from "./index.js";
import type { DocNode } from "../doc/types.js";

const IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";

const render = (html: string, style: string = ""): HTMLElement => {
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
      children: [
        {
          children: [
            { type: "image" },
            { text: "ab" },
            { type: "image" },
            { text: "cd" },
            { type: "image" },
          ],
        },
      ],
    };
    const element = render(
      `<div><img src="${IMAGE}">ab<img src="${IMAGE}">cd<img src="${IMAGE}"></div>`,
    );
    const [first, middle, last] = element.querySelectorAll("img");
    // before the void at the start of the block
    expect(rangeToRect(element, parser, doc, [0, 0]).toJSON()).toEqual(
      first!.getBoundingClientRect().toJSON(),
    );
    // after the void followed by text
    expect(rangeToRect(element, parser, doc, [4, 4]).toJSON()).toEqual(
      middle!.getBoundingClientRect().toJSON(),
    );
    // after the void at the end of the block
    expect(rangeToRect(element, parser, doc, [7, 7]).toJSON()).toEqual(
      last!.getBoundingClientRect().toJSON(),
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
    const doc: DocNode = { children: [{ children: [{ text: "abc" }] }] };
    const element = render("<div>abc</div>", "writing-mode: vertical-rl");
    const block = element.firstElementChild!.getBoundingClientRect();
    const rect = rangeToRect(element, parser, doc, [1, 1]);
    // not the empty rect WebKit reports, but on the line, or the element of the text in WebKit
    expect(rect.width || rect.height).not.toBe(0);
    expect(rect.left).toBeGreaterThanOrEqual(block.left);
    expect(rect.right).toBeLessThanOrEqual(block.right);
    expect(rect.top).toBeGreaterThanOrEqual(block.top);
    expect(rect.bottom).toBeLessThanOrEqual(block.bottom);
  });
});
