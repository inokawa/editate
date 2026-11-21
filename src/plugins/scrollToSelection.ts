import { findPosition, getCurrentDocument, rangeToRect } from "../dom/index.js";
import { isElementNode } from "../dom/utils.js";
import { offsetToPosition } from "../doc/node.js";
import { toRange } from "../doc/position.js";
import type { Editor } from "../editor.js";
import { max, min } from "../utils.js";

// `auto` parses to NaN and reserves nothing
const resolveScrollPadding = (value: string, size: number): number => {
  const px = parseFloat(value);
  return px ? (value.endsWith("%") ? (px / 100) * size : px) : 0;
};

const overflow = (
  start: number,
  end: number,
  boundStart: number,
  boundEnd: number,
): number =>
  start < boundStart ? start - boundStart : end > boundEnd ? end - boundEnd : 0;

// The offsets to bring the rect into the scrollport inset by the scroll padding
const fit = (
  rect: DOMRect,
  port: DOMRect,
  style: CSSStyleDeclaration,
): [left: number, top: number] => [
  overflow(
    rect.left,
    rect.right,
    port.left + resolveScrollPadding(style.scrollPaddingLeft, port.width),
    port.right - resolveScrollPadding(style.scrollPaddingRight, port.width),
  ),
  overflow(
    rect.top,
    rect.bottom,
    port.top + resolveScrollPadding(style.scrollPaddingTop, port.height),
    port.bottom - resolveScrollPadding(style.scrollPaddingBottom, port.height),
  ),
];

const isScrollable = (overflow: string): boolean =>
  overflow === "auto" || overflow === "scroll" || overflow === "overlay";

// Clamping keeps the applied offset known without reading back the scroll
// position, which stays stale during a smooth scroll.
const clamp = (
  diff: number,
  scrolled: number,
  scrollable: number,
  reversed: boolean,
): number => {
  const start = reversed ? -scrollable : 0;
  return max(start - scrolled, min(diff, start + scrollable - scrolled));
};

const scrollBy = (
  target: Window | Element,
  left: number,
  top: number,
): void => {
  if (top || left) {
    target.scrollBy({ top, left, behavior: "auto" });
  }
};

/**
 * A plugin to scroll to the selection on document change.
 */
export const scrollToSelectionPlugin = (editor: Editor) => {
  editor.hook("mount", (element, parser) => {
    const document = getCurrentDocument(element);
    const window = document.defaultView!;
    const { body, documentElement } = document;
    const rootStyle = window.getComputedStyle(documentElement);

    let timer: ReturnType<typeof setTimeout> | null = null;
    // Moving the caret reveals it natively, leaving only document changes
    const cleanup = editor.on("change", () => {
      if (timer != null) return;
      // Defer until the host framework has re-rendered, since the native reveal
      // ran against the layout before it. Matches the delay in editor.input().
      timer = setTimeout(() => {
        timer = null;
        let rect = rangeToRect(element, parser, editor.doc, editor.selection);
        const [node] = findPosition(
          element,
          parser,
          offsetToPosition(editor.doc, toRange(editor.selection)[0]),
        );

        // Walk the scroll chain inner -> outer like scrollIntoView(), from the
        // caret as the scrollers in the content, such as a code block scrolling
        // along x, come and go with it. Rects are viewport-relative, so fitting
        // the caret in a scroller does not put it in the outer ones; scrolling
        // the scroller shifts those coords, hence shifting the rect by the
        // offsets applied. The reverse never holds, so one pass converges.
        // body/documentElement are left to the viewport scroll.
        for (
          let scroller = isElementNode(node) ? node : node.parentElement;
          scroller && scroller !== body && scroller !== documentElement;
          scroller = scroller.parentElement
        ) {
          const style = window.getComputedStyle(scroller);
          // Only scroll containers scroll, which the authored overflow tells, whether or not they overflow now. Both axes matter: a vertical writing mode scrolls along x.
          if (
            !isScrollable(style.overflowX) &&
            !isScrollable(style.overflowY)
          ) {
            continue;
          }
          const {
            scrollLeft,
            scrollTop,
            scrollWidth,
            scrollHeight,
            clientLeft,
            clientTop,
            clientWidth,
            clientHeight,
          } = scroller;
          const box = scroller.getBoundingClientRect();
          // The scrollport is the padding box minus scrollbars, which is what client*
          // describe. The border box would count borders and scrollbars as visible.
          const [diffLeft, diffTop] = fit(
            rect,
            new DOMRect(
              box.left + clientLeft,
              box.top + clientTop,
              clientWidth,
              clientHeight,
            ),
            style,
          );
          // An axis flowing back toward the scroll origin is reached through negative
          // offsets, so scrollLeft runs [-scrollable, 0] under `rtl` or `vertical-rl`.
          // x starts at the inline start when horizontal and at the block start otherwise, y at the inline start when vertical, which is at the bottom in `sideways-lr` while `ltr`.
          const { writingMode } = style;
          const rtl = style.direction === "rtl";
          const horizontal = writingMode.startsWith("horizontal");
          const offsetLeft = clamp(
            diffLeft,
            scrollLeft,
            scrollWidth - clientWidth,
            horizontal ? rtl : writingMode.endsWith("rl"),
          );
          const offsetTop = clamp(
            diffTop,
            scrollTop,
            scrollHeight - clientHeight,
            !horizontal && rtl !== (writingMode === "sideways-lr"),
          );
          scrollBy(scroller, offsetLeft, offsetTop);
          rect = new DOMRect(
            rect.x - offsetLeft,
            rect.y - offsetTop,
            rect.width,
            rect.height,
          );
        }

        // not innerWidth/Height, which include the scrollbars
        const { clientWidth, clientHeight } = documentElement;
        scrollBy(
          window,
          ...fit(rect, new DOMRect(0, 0, clientWidth, clientHeight), rootStyle),
        );
      }, 50);
    });

    return () => {
      if (timer != null) {
        clearTimeout(timer);
      }
      cleanup();
    };
  });
};
