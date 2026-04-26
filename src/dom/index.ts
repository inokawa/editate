import {
  type TokenType,
  parse,
  getNodeSize,
  getDomNode,
  isElementNode,
  TOKEN_TEXT,
  TOKEN_VOID,
  TOKEN_SOFT_BREAK,
  TOKEN_BLOCK,
  type ParserConfig,
  nextBlock,
  readNext as next,
  parentBlock,
  readToken,
} from "./parser.js";
import { comparePosition } from "../doc/position.js";
import type {
  Position,
  InlineNode,
  SelectionSnapshot,
  PositionRange,
  Fragment,
  TextNode,
  Path,
  BlockNode,
} from "../doc/types.js";
import { min } from "../utils.js";

export { defaultIsBlockNode, defaultIsVoidNode } from "./default.js";

// const DOCUMENT_POSITION_DISCONNECTED = 0x01;
const DOCUMENT_POSITION_PRECEDING = 0x02;
const DOCUMENT_POSITION_FOLLOWING = 0x04;
// const DOCUMENT_POSITION_CONTAINS = 0x08;
const DOCUMENT_POSITION_CONTAINED_BY = 0x10;
// const DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 0x20;

const compareDomPosition = (a: Node, b: Node) => a.compareDocumentPosition(b);

/**
 * @internal
 */
export const getCurrentDocument = (node: Element): Document =>
  node.ownerDocument;

/**
 * @internal
 */
export const getDOMSelection = (element: Element): Selection => {
  // TODO support ShadowRoot
  return getCurrentDocument(element).getSelection()!;
};

/**
 * @internal
 */
export const getSelectionRangeInEditor = (
  selection: Selection,
  root: Element,
): Range | void => {
  if (selection.rangeCount) {
    const range = selection.getRangeAt(0);
    if (root.contains(range.commonAncestorContainer)) {
      return range;
    }
  }
};

const setRangeToSelection = (
  root: Element,
  range: Range,
  force: boolean | undefined,
  backward?: boolean,
): void => {
  const selection = getDOMSelection(root);
  if (!force && !getSelectionRangeInEditor(selection, root)) {
    return;
  }
  selection.removeAllRanges();
  selection.addRange(range);
  if (backward) {
    selection.collapseToEnd();
    selection.extend(range.startContainer, range.startOffset);
  }
};

/**
 * @internal
 */
export const setSelectionToDOM = (
  document: Document,
  root: Element,
  [anchor, focus]: SelectionSnapshot,
  config: ParserConfig,
  force?: boolean,
): void => {
  const posDiff = comparePosition(anchor, focus);
  const isCollapsed = posDiff === 0;
  const backward = posDiff === 1;
  const start = backward ? focus : anchor;
  const end = backward ? anchor : focus;
  // special path for empty content with empty selection, necessary for placeholder
  if (
    start[0].length === 0 &&
    start[1] === 0 &&
    isCollapsed &&
    !root.hasChildNodes()
  ) {
    const range = document.createRange();
    range.setStart(root, 0);
    range.setEnd(root, 0);

    return setRangeToSelection(root, range, force);
  }

  const domStart = findPosition(root, start, config);
  if (!domStart) {
    return;
  }

  const domEnd = isCollapsed ? domStart : findPosition(root, end, config);
  if (!domEnd) {
    return;
  }

  // https://w3c.github.io/contentEditable/#dfn-legal-caret-positions
  const range = document.createRange();

  const [startNode, startOffset] = domStart;
  const [endNode, endOffset] = domEnd;

  // embed or br
  if (isElementNode(startNode)) {
    if (startOffset < 1) {
      range.setStartBefore(startNode);
    } else {
      range.setStartAfter(startNode);
    }
  } else {
    range.setStart(startNode, startOffset);
  }

  // embed or br
  if (isElementNode(endNode)) {
    if (endOffset < 1) {
      range.setEndBefore(endNode);
    } else {
      range.setEndAfter(endNode);
    }
  } else {
    range.setEnd(endNode, endOffset);
  }

  setRangeToSelection(root, range, force, backward);
};

type DOMPosition = [node: Text | Element, offsetAtNode: number];

const findPosition = (
  root: Element,
  [path, offset]: Position,
  config: ParserConfig,
): DOMPosition | undefined => {
  return parse(
    (): DOMPosition | undefined => {
      let pathIndex = 0;
      let type: TokenType | void;
      while ((type = next())) {
        if (type === TOKEN_BLOCK) {
          if (pathIndex < path.length) {
            for (
              let blockIndex = path[pathIndex++]!;
              blockIndex > 0;
              blockIndex--
            ) {
              nextBlock();
            }
          }
        } else {
          const size = getNodeSize();
          if (offset <= size) {
            return [getDomNode<typeof type>(), offset];
          }
          offset -= size;
        }
      }
      return;
    },
    root,
    config,
  );
};

const serializePosition = (
  root: Element,
  node: Node,
  offsetAtNode: number,
  config: ParserConfig,
): Position => {
  let excludeEnd = true;
  if (root === node && !node.hasChildNodes()) {
    // for placeholder
    return [[], 0];
  }

  if (isElementNode(node) && !config._isVoid(node) && node.hasChildNodes()) {
    // If start/end of Range is not selectable node, it will have offset relative to its parent
    //      0  1       2               3
    // <div>aaaa<img /><span>bbbb</span></div>
    //
    // And there are other possible cases:
    // - Selection with Ctrl+A in Firefox
    // - getTargetRanges() when deleting contenteditable:false in Firefox
    // - Selection.setBaseAndExtent(element, 0, element, 0)
    const index = min(offsetAtNode, node.childNodes.length - 1);
    node = node.childNodes[index]!;
    excludeEnd = index === offsetAtNode;
    offsetAtNode = 0;
  }

  return parse(
    () => {
      if (readToken() !== TOKEN_BLOCK) {
        parentBlock();
      }

      const path = parse((): Path => {
        const blocks: Element[] = [];
        // TODO improve type
        let block: Element | null;
        while ((block = getDomNode<typeof TOKEN_BLOCK>()) && block !== root) {
          blocks.unshift(block);
          parentBlock();
        }

        if (!blocks.length) {
          return [];
        }

        let i = 0;
        let sib: Element = blocks[blocks.length - 1]!;
        while ((sib = sib.previousElementSibling!)) {
          i++;
        }
        return [i];
      });

      let offset = 0;
      while (next()) {
        const comp = compareDomPosition(node, getDomNode());
        if (
          comp === 0 || // same object
          comp & DOCUMENT_POSITION_CONTAINED_BY
        ) {
          if (excludeEnd) {
            break;
          }
        } else if (comp & DOCUMENT_POSITION_FOLLOWING) {
          break;
        }
        offset += getNodeSize();
      }
      return [path, offset + offsetAtNode];
    },
    root,
    config,
    node,
  );
};

/**
 * @internal
 */
export const serializeRange = (
  root: Element,
  config: ParserConfig,
  { startOffset, startContainer, endOffset, endContainer }: AbstractRange,
): PositionRange => {
  const start = serializePosition(root, startContainer, startOffset, config);
  return [
    start,
    startContainer === endContainer && startOffset === endOffset
      ? start
      : serializePosition(root, endContainer, endOffset, config),
  ];
};

/**
 * @internal
 */
export const getEmptySelectionSnapshot = (): SelectionSnapshot => {
  return [
    [[], 0],
    [[], 0],
  ];
};

/**
 * @internal
 */
export const takeSelectionSnapshot = (
  root: Element,
  config: ParserConfig,
): SelectionSnapshot => {
  const selection = getDOMSelection(root);
  const domRange = getSelectionRangeInEditor(selection, root);
  if (!domRange) {
    return getEmptySelectionSnapshot();
  }

  const range = serializeRange(root, config, domRange);
  const comp = compareDomPosition(selection.anchorNode!, selection.focusNode!);

  // https://stackoverflow.com/questions/9180405/detect-direction-of-user-selection-with-javascript
  return (
    comp === 0 // same object
      ? selection.anchorOffset > selection.focusOffset
      : comp & DOCUMENT_POSITION_PRECEDING
  )
    ? [range[1], range[0]]
    : range;
};

/**
 * @internal
 */
export const domToFragment = (
  root: Node,
  config: ParserConfig,
  serializeText: (text: string) => TextNode,
  serializeVoid: (node: Element) => InlineNode | void,
): Fragment => {
  return parse(
    () => {
      let type: TokenType | void;
      let row: InlineNode[] | null = null;
      let text = "";
      let hasContent = false;

      const rows: BlockNode[] = [];

      const completeText = () => {
        if (text) {
          if (!row) {
            row = [];
          }
          row.push(serializeText(text));
          text = "";
        }
      };
      const completeRow = () => {
        completeText();
        if (!row && hasContent) {
          row = [];
        }
        if (row) {
          rows.push({ children: row });
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
            text += getDomNode<typeof type>().data;
          } else if (type === TOKEN_VOID) {
            completeText();
            const docNode = serializeVoid(getDomNode<typeof type>());
            if (docNode) {
              row!.push(docNode);
            }
          } else if (type === TOKEN_SOFT_BREAK) {
            completeRow();
          }
        }
      }
      completeRow();

      if (!rows.length) {
        rows.push({ children: [] });
      }

      return rows;
    },
    root,
    config,
  );
};

/**
 * @internal
 */
export const getPointedCaretPosition = (
  document: Document,
  root: Element,
  { clientX, clientY }: MouseEvent,
  config: ParserConfig,
): Position | void => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Document/caretPositionFromPoint
  // https://developer.mozilla.org/en-US/docs/Web/API/Document/caretRangeFromPoint
  //          caretPositionFromPoint caretRangeFromPoint
  // Chrome:  128                    4
  // Firefox: 20                     -
  // Safari:  26.2                   5
  if (document.caretPositionFromPoint) {
    const position = document.caretPositionFromPoint(clientX, clientY);
    if (position) {
      return serializePosition(
        root,
        position.offsetNode,
        position.offset,
        config,
      );
    }
  } else if (document.caretRangeFromPoint) {
    const range = document.caretRangeFromPoint(clientX, clientY);
    if (range) {
      return serializePosition(
        root,
        range.startContainer,
        range.startOffset,
        config,
      );
    }
  }
};
