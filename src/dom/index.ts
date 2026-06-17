import { type TokenType, type Parser, TOKEN_BLOCK } from "./parser.js";
import type { DomPosition, SelectionSnapshot, Path } from "../doc/types.js";
import { min } from "../utils.js";
import { isElementNode } from "./utils.js";

export {
  createParser,
  TOKEN_TEXT,
  TOKEN_VOID,
  TOKEN_SOFT_BREAK,
  TOKEN_BLOCK,
} from "./parser.js";
export { defaultIsBlockNode } from "./default.js";

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

/**
 * @internal
 */
export const setSelectionToDOM = (
  document: Document,
  root: Element,
  parse: Parser,
  [anchor, focus]: SelectionSnapshot,
  posDiff: number, // TODO remove
  force?: boolean,
): void => {
  const selection = getDOMSelection(root);

  if (force || getSelectionRangeInEditor(selection, root)) {
    const isCollapsed = posDiff === 0;
    const backward = posDiff > 0;
    const start = backward ? focus : anchor;
    const end = backward ? anchor : focus;

    const domStart = findPosition(root, parse, start);
    const domEnd = isCollapsed ? domStart : findPosition(root, parse, end);

    const range = document.createRange();

    const [startNode, startOffset] = domStart;
    const [endNode, endOffset] = domEnd;

    // embed or br
    if (isElementNode(startNode) && root !== startNode) {
      if (startOffset < 1) {
        range.setStartBefore(startNode);
      } else {
        range.setStartAfter(startNode);
      }
    } else {
      range.setStart(startNode, startOffset);
    }

    // embed or br
    if (isElementNode(endNode) && root !== endNode) {
      if (endOffset < 1) {
        range.setEndBefore(endNode);
      } else {
        range.setEndAfter(endNode);
      }
    } else {
      range.setEnd(endNode, endOffset);
    }

    selection.removeAllRanges();
    selection.addRange(range);
    if (backward) {
      selection.collapseToEnd();
      selection.extend(range.startContainer, range.startOffset);
    }
  }
};

/**
 * @internal
 */
export type DomPoint = [node: Node, offsetAtNode: number];

/**
 * @internal
 */
export const findPosition = (
  root: Element,
  parse: Parser,
  [path, offset]: DomPosition,
): DomPoint => {
  return parse(
    ({
      _next: next,
      _nextBlock: nextBlock,
      _domNode: domNode,
      _nodeSize: nodeSize,
    }): DomPoint => {
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
          const size = nodeSize();
          if (offset <= size) {
            return [domNode<typeof type>(), offset];
          }
          offset -= size;
        }
      }

      // special path for empty content with empty selection, necessary for placeholder
      return [root, 0];
    },
    root,
  );
};

/**
 * @internal
 */
export const serializePosition = (
  root: Element,
  parse: Parser,
  node: DomPoint[0],
  offsetAtNode: DomPoint[1],
): DomPosition => {
  let excludeEnd = true;
  if (root === node && !node.hasChildNodes()) {
    // for placeholder
    return [[0], 0];
  }

  if (isElementNode(node) && node.hasChildNodes()) {
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
    ({
      _next: next,
      _moveTo: moveTo,
      _parentBlock: parentBlock,
      _prevBlock: prevBlock,
      _domNode: domNode,
      _nodeSize: nodeSize,
      _readToken: readToken,
    }) => {
      moveTo(node);
      if (readToken() !== TOKEN_BLOCK) {
        parentBlock();
      }

      const path = parse((): Path => {
        const p: number[] = [];
        while (readToken() && domNode() !== root) {
          let i = 0;
          while (true) {
            prevBlock();
            if (!readToken()) {
              break;
            }
            i++;
          }
          p.unshift(i);
          parentBlock();
        }

        if (!p.length) {
          return [0];
        }

        return p;
      });

      let offset = 0;
      while (next()) {
        const comp = compareDomPosition(node, domNode());
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
        offset += nodeSize();
      }
      return [path, offset + offsetAtNode];
    },
    root,
  );
};

/**
 * @internal
 */
export const serializeRange = (
  root: Element,
  parse: Parser,
  { startOffset, startContainer, endOffset, endContainer }: AbstractRange,
): [DomPosition, DomPosition] => {
  const start = serializePosition(root, parse, startContainer, startOffset);
  return [
    start,
    startContainer === endContainer && startOffset === endOffset
      ? start
      : serializePosition(root, parse, endContainer, endOffset),
  ];
};

/**
 * @internal
 */
export const takeSelectionSnapshot = (
  root: Element,
  parse: Parser,
): SelectionSnapshot => {
  const selection = getDOMSelection(root);
  const domRange = getSelectionRangeInEditor(selection, root);
  if (!domRange) {
    return [
      [[0], 0],
      [[0], 0],
    ];
  }

  const range = serializeRange(root, parse, domRange);
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
export const getPointedCaretPosition = (
  root: Element,
  parse: Parser,
  { clientX, clientY }: MouseEvent,
): DomPosition | void => {
  const document = getCurrentDocument(root);
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
        parse,
        position.offsetNode,
        position.offset,
      );
    }
  } else if (document.caretRangeFromPoint) {
    const range = document.caretRangeFromPoint(clientX, clientY);
    if (range) {
      return serializePosition(
        root,
        parse,
        range.startContainer,
        range.startOffset,
      );
    }
  }
};
