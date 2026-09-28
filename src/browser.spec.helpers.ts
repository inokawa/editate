// e2e bundles this into pages, so this must not depend on the test runner
import {
  createParser,
  defaultIsBlockNode,
  getDOMSelection,
  getSelectionRangeInEditor,
  takeSelectionSnapshot,
  TOKEN_BLOCK,
  TOKEN_SOFT_BREAK,
  TOKEN_TEXT,
  TOKEN_VOID,
} from "./dom/index.js";
import type { TokenType } from "./dom/parser.js";
import type { DomPosition } from "./doc/types.js";

export const NON_EDITABLE_PLACEHOLDER = "$";

export const getText = (
  element: HTMLElement,
  { blockTag, selected }: { blockTag?: string; selected?: boolean } = {},
): string[] => {
  const document = element.ownerDocument;
  let target: Node = element;
  if (selected) {
    const selection = document.getSelection()!;
    target = selection.getRangeAt(0)!.cloneContents();
  }

  const parse = createParser(
    document,
    blockTag ? (n) => n.tagName === blockTag.toUpperCase() : defaultIsBlockNode,
  );

  return parse(({ _next: next, _domNode: domNode }) => {
    let type: TokenType | void;
    let row: string[] | null = null;
    let text = "";
    let hasContent = false;

    const rows: string[] = [];

    const completeText = () => {
      if (text) {
        if (!row) {
          row = [];
        }
        row.push(text);
        text = "";
      }
    };
    const completeRow = () => {
      completeText();
      if (!row && hasContent) {
        row = [];
      }
      if (row) {
        rows.push(row.join(""));
      }
      row = null;
      hasContent = false;
    };

    while ((type = next())) {
      if (type === TOKEN_BLOCK) {
        completeRow();
      } else {
        hasContent = true;

        if (type === TOKEN_TEXT) {
          text += domNode<typeof type>().data;
        } else if (type === TOKEN_VOID) {
          completeText();
          if (!row) {
            row = [];
          }
          row.push(NON_EDITABLE_PLACEHOLDER);
        } else if (type === TOKEN_SOFT_BREAK) {
          completeRow();
        }
      }
    }
    completeRow();

    if (!rows.length) {
      rows.push("");
    }

    return rows;
  }, target);
};

export const getSelection = (
  element: HTMLElement,
  { blockTag }: { blockTag?: string } = {},
): [number, number] => {
  const lines = getText(element, { blockTag });
  const selection = takeSelectionSnapshot(
    element,
    createParser(
      element.ownerDocument,
      blockTag
        ? (n) => n.tagName === blockTag.toUpperCase()
        : defaultIsBlockNode,
    ),
  );

  const transformPos = ([path, offset]: DomPosition): number => {
    const p = path.length ? path[0]! : 0;
    for (let i = 0; i < p; i++) {
      const length = lines[i]!.length;
      offset += length;
      if (i !== lines.length - 1) {
        offset++;
      }
    }
    return offset;
  };
  return [transformPos(selection[0]), transformPos(selection[1])];
};

const ANCHOR = "^";
const FOCUS = "|";

// The rows of getText joined with "\n", with the selection of getSelection marked like assert_selection of Chromium: ANCHOR at the anchor and FOCUS at the focus, or only FOCUS for a caret
// Nothing is marked when the selection is outside the editable
// https://chromium.googlesource.com/chromium/src/+/main/third_party/blink/web_tests/editing/assert_selection.js
export const getState = (
  element: HTMLElement,
  config: { blockTag?: string } = {},
): string => {
  const text = getText(element, config).join("\n");
  if (text.includes(ANCHOR) || text.includes(FOCUS)) {
    throw new Error(`text contains a marker: ${text}`);
  }
  if (!getSelectionRangeInEditor(getDOMSelection(element), element)) {
    return text;
  }
  const [anchor, focus] = getSelection(element, config);
  const mark = (t: string, offset: number, marker: string) =>
    t.slice(0, offset) + marker + t.slice(offset);
  if (anchor === focus) {
    return mark(text, focus, FOCUS);
  }
  // mark the later offset first so the earlier one stays valid
  return anchor < focus
    ? mark(mark(text, focus, FOCUS), anchor, ANCHOR)
    : mark(mark(text, anchor, ANCHOR), focus, FOCUS);
};
