import { expect, it, onTestFinished } from "vitest";
import { createEditor } from "../../editor.js";
import { scrollToSelectionPlugin } from "./scrollToSelection.js";

type Doc = { children: { children: { text: string }[] }[] };

const setup = (parent: HTMLElement, lines: string[], lineStyle = "") => {
  const element = parent.appendChild(document.createElement("div"));
  element.append(
    ...lines.map((text) => {
      const line = document.createElement("div");
      line.style.cssText = lineStyle;
      line.append(text);
      return line;
    }),
  );
  const editor = createEditor<Doc>({
    doc: { children: lines.map((text) => ({ children: [{ text }] })) },
  });
  // The elements are reused as frameworks do, so the scrollers in the content keep their scroll positions
  editor.on("change", () => {
    editor.doc.children.forEach(({ children: [node] }, i) => {
      (element.children[i]!.firstChild as Text).data = node!.text;
    });
  });
  scrollToSelectionPlugin(editor);
  const cleanup = editor.input(element);
  onTestFinished(() => {
    cleanup();
    element.remove();
  });
  return { element, editor };
};

const createScroller = (parent: HTMLElement, style: string): HTMLElement => {
  const scroller = parent.appendChild(document.createElement("div"));
  scroller.style.cssText = style;
  onTestFinished(() => {
    scroller.remove();
  });
  return scroller;
};

// The character before the caret at the end of the last line, as Firefox reports the caret as long as the line in a vertical writing mode
const getLastCharRect = (element: HTMLElement): DOMRect => {
  const text = element.lastChild!.firstChild as Text;
  const range = document.createRange();
  range.setStart(text, text.length - 1);
  range.setEnd(text, text.length);
  return range.getBoundingClientRect();
};

// The end of the scrollable content stays on the edge of the scrollport, by a fraction of a pixel on either side
const isInside = (rect: DOMRect, port: DOMRect): boolean =>
  rect.top >= port.top - 1 &&
  rect.bottom <= port.bottom + 1 &&
  rect.left >= port.left - 1 &&
  rect.right <= port.right + 1;

const getScrollport = (scroller: HTMLElement): DOMRect => {
  const { top, left } = scroller.getBoundingClientRect();
  return new DOMRect(
    left + scroller.clientLeft,
    top + scroller.clientTop,
    scroller.clientWidth,
    scroller.clientHeight,
  );
};

// The same character as the last one, as another script could be laid out away from the caret by the bidi algorithm
const appendText = (editor: ReturnType<typeof setup>["editor"]) => {
  const end = editor.doc.children.reduce(
    (acc, b) => acc + b.children[0]!.text.length,
    editor.doc.children.length - 1,
  );
  editor.selection = [end, end];
  editor.apply({
    type: "insert_text",
    at: end,
    text: editor.doc.children.at(-1)!.children[0]!.text.slice(-1),
  });
};

const lines = Array.from({ length: 30 }, (_, i) => `line ${i}`);

it("scroll the window to the caret", async () => {
  const { element, editor } = setup(
    document.body,
    Array.from({ length: 100 }, (_, i) => `line ${i}`),
  );
  onTestFinished(() => {
    window.scrollTo(0, 0);
  });
  appendText(editor);
  const { clientWidth, clientHeight } = document.documentElement;
  await expect
    .poll(() =>
      isInside(
        getLastCharRect(element),
        new DOMRect(0, 0, clientWidth, clientHeight),
      ),
    )
    .toBe(true);
});

it("scroll a scroller in the content to the caret", async () => {
  const { element, editor } = setup(
    document.body,
    ["a".repeat(100)],
    "width: 100px; overflow-x: auto; white-space: pre",
  );
  appendText(editor);
  await expect
    .poll(() =>
      isInside(
        getLastCharRect(element),
        getScrollport(element.lastChild as HTMLElement),
      ),
    )
    .toBe(true);
});

it("scroll nested scrollers to the caret", async () => {
  const outer = createScroller(document.body, "height: 100px; overflow: auto");
  const inner = createScroller(outer, "height: 200px; overflow: auto");
  const { element, editor } = setup(inner, lines);
  // so that the outer one could scroll past the caret
  outer.appendChild(document.createElement("div")).style.height = "200px";
  appendText(editor);
  await expect
    .poll(() => {
      const rect = getLastCharRect(element);
      return (
        isInside(rect, getScrollport(inner)) &&
        isInside(rect, getScrollport(outer))
      );
    })
    .toBe(true);
});

// The scroll origin is on the right or at the bottom, so the caret at the end is reached through negative offsets
it.each([
  ["rtl", "direction: rtl", ["א".repeat(100)]],
  ["vertical-rl", "writing-mode: vertical-rl", lines],
  [
    "vertical-rl and rtl",
    "writing-mode: vertical-rl; direction: rtl",
    ["א".repeat(100)],
  ],
  ["sideways-lr", "writing-mode: sideways-lr", ["a".repeat(100)]],
])("scroll a scroller in %s to the caret", async (_, style, lines) => {
  const scroller = createScroller(
    document.body,
    `width: 100px; height: 100px; overflow: auto; ${style}`,
  );
  const { element, editor } = setup(scroller, lines, "white-space: pre");
  appendText(editor);
  await expect
    .poll(() => isInside(getLastCharRect(element), getScrollport(scroller)))
    .toBe(true);
});

it("scroll a scroller to the caret within its scroll padding", async () => {
  const scroller = createScroller(
    document.body,
    "height: 100px; overflow: auto; scroll-padding-bottom: 40px",
  );
  const { element, editor } = setup(scroller, lines);
  // so that the padding can be kept below the caret
  scroller.appendChild(document.createElement("div")).style.height = "200px";
  appendText(editor);
  await expect
    .poll(() => {
      const port = getScrollport(scroller);
      return isInside(
        getLastCharRect(element),
        new DOMRect(port.x, port.y, port.width, port.height - 40),
      );
    })
    .toBe(true);
});

it("scroll the outer scroller by what the inner one could scroll", async () => {
  const outer = createScroller(document.body, "height: 100px; overflow: auto");
  // The padding cannot be kept below the caret at the end of the content
  const inner = createScroller(
    outer,
    "height: 200px; overflow: auto; scroll-padding-bottom: 40px",
  );
  const { element, editor } = setup(inner, lines);
  appendText(editor);
  await expect
    .poll(() => {
      const rect = getLastCharRect(element);
      return (
        isInside(rect, getScrollport(inner)) &&
        isInside(rect, getScrollport(outer))
      );
    })
    .toBe(true);
});
