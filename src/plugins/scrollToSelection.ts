import { getCurrentDocument, selectionToRange } from "../dom/index.js";
import { isElementNode } from "../dom/utils.js";
import type { Editor } from "../editor.js";
import { max, min } from "../utils.js";

// `auto` parses to NaN and reserves nothing
const resolveScrollPadding = (value: string, size: number): number => {
  const px = parseFloat(value);
  return px ? (value.endsWith("%") ? (px / 100) * size : px) : 0;
};

const getBounds = (
  start: number,
  size: number,
  paddingStart: string,
  paddingEnd: string,
): [start: number, end: number] => [
  start + resolveScrollPadding(paddingStart, size),
  start + size - resolveScrollPadding(paddingEnd, size),
];

const isScrollable = (overflow: string): boolean =>
  overflow === "auto" || overflow === "scroll" || overflow === "overlay";

const overflow = (
  start: number,
  end: number,
  [boundStart, boundEnd]: [number, number],
): number =>
  start < boundStart ? start - boundStart : end > boundEnd ? end - boundEnd : 0;

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
  target: Window | HTMLElement,
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
    // Resolved once on mount, so this keys off the authored overflow rather than
    // whether the element currently overflows, which depends on the content. Both
    // axes matter: a vertical writing mode scrolls along x.
    // body/documentElement are left to the viewport scroll.
    let scroller: HTMLElement | undefined;
    // live declarations, so the lookup is paid once but the values stay current
    let scrollerStyle: CSSStyleDeclaration | undefined;
    for (
      let node: HTMLElement | null = element;
      node && node !== body && node !== documentElement;
      node = node.parentElement
    ) {
      const style = window.getComputedStyle(node);
      if (isScrollable(style.overflowX) || isScrollable(style.overflowY)) {
        scroller = node;
        scrollerStyle = style;
        break;
      }
    }
    const rootStyle = window.getComputedStyle(documentElement);

    let timer: ReturnType<typeof setTimeout> | null = null;
    // Moving the caret reveals it natively, leaving only document changes
    const cleanup = editor.on("change", () => {
      if (timer != null) return;
      // Defer until the host framework has re-rendered, since the native reveal
      // ran against the layout before it. Matches the delay in editor.input().
      timer = setTimeout(() => {
        timer = null;
        const range = selectionToRange(
          element,
          parser,
          editor.doc,
          editor.selection,
        );
        let rect = range.getBoundingClientRect();
        // A collapsed range around a `<br>` reports an empty rect at (0, 0),
        // which would scroll toward the start of the document. A caret itself
        // is flat on one axis only, on y in a vertical writing mode.
        if (!rect.width && !rect.height) {
          const node = range.startContainer;
          const el = isElementNode(node) ? node : node.parentElement;
          if (el) {
            rect = el.getBoundingClientRect();
          }
        }

        // Walk the scroll chain inner -> outer like scrollIntoView(). Rects are
        // viewport-relative, so fitting the caret in the scroller does not put
        // it on screen; scrolling the scroller shifts those coords, hence
        // subtracting the applied offset. The reverse never holds, so one pass
        // converges. Only the nearest scroller is walked. Both passes measure
        // before either scrolls, since a scroll would invalidate layout and
        // force the later measurements to lay out again.
        let left = 0;
        let top = 0;
        if (scroller && scrollerStyle) {
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
          // An axis flowing back toward the scroll origin is reached through negative
          // offsets, so scrollLeft runs [-scrollable, 0] under `rtl` or `vertical-rl`.
          const rtl = scrollerStyle.direction === "rtl";
          let reversedX = rtl;
          let reversedY = false;
          switch (scrollerStyle.writingMode) {
            case "vertical-rl":
            case "sideways-rl":
              reversedX = true;
              reversedY = rtl;
              break;
            case "vertical-lr":
              reversedX = false;
              reversedY = rtl;
              break;
            // the one mode whose inline axis runs bottom-to-top while `ltr`
            case "sideways-lr":
              reversedX = false;
              reversedY = !rtl;
          }

          // The scrollport is the padding box minus scrollbars, which is what client*
          // describe. The border box would count borders and scrollbars as visible.
          top = clamp(
            overflow(
              rect.top,
              rect.bottom,
              getBounds(
                box.top + clientTop,
                clientHeight,
                scrollerStyle.scrollPaddingTop,
                scrollerStyle.scrollPaddingBottom,
              ),
            ),
            scrollTop,
            scrollHeight - clientHeight,
            reversedY,
          );
          left = clamp(
            overflow(
              rect.left,
              rect.right,
              getBounds(
                box.left + clientLeft,
                clientWidth,
                scrollerStyle.scrollPaddingLeft,
                scrollerStyle.scrollPaddingRight,
              ),
            ),
            scrollLeft,
            scrollWidth - clientWidth,
            reversedX,
          );
        }

        // not innerWidth/Height, which include the scrollbars
        const { clientWidth, clientHeight } = documentElement;
        const windowTop = overflow(
          rect.top - top,
          rect.bottom - top,
          getBounds(
            0,
            clientHeight,
            rootStyle.scrollPaddingTop,
            rootStyle.scrollPaddingBottom,
          ),
        );
        const windowLeft = overflow(
          rect.left - left,
          rect.right - left,
          getBounds(
            0,
            clientWidth,
            rootStyle.scrollPaddingLeft,
            rootStyle.scrollPaddingRight,
          ),
        );

        if (scroller) {
          scrollBy(scroller, left, top);
        }
        scrollBy(window, windowLeft, windowTop);
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
