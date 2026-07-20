import { getLeafAt, getNodeSize, iterLeaves } from "./doc/node.js";
import { hasIntersection, isCollapsed, toRange } from "./doc/position.js";
import type { InferInlineNode } from "./doc/types-infer.js";
import type { DocNode, Range } from "./doc/types.js";
import type { Editor } from "./editor.js";

/**
 * Get leaf nodes that intersect with the selection or specified range.
 */
export function* LeavesInRange<T extends DocNode>(
  editor: Editor<T>,
  range: Range = toRange(editor.selection),
): Generator<InferInlineNode<T>, void, void> {
  if (isCollapsed(range)) {
    const n = getLeafAt(editor.doc, range[0])?.[0];
    if (n) {
      yield n as InferInlineNode<T>;
    }
  } else {
    for (const [n, o] of iterLeaves(editor.doc, range)) {
      if (hasIntersection(range, [o, o + getNodeSize(n)])) {
        yield n;
      }
    }
  }
}
