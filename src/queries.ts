import { getLeafAt, getNodeSize, iterLeafs } from "./doc/node.js";
import { hasIntersection, isCollapsed, toRange } from "./doc/position.js";
import type { InferInlineNode } from "./doc/types-infer.js";
import type { DocNode, Range } from "./doc/types.js";
import type { Editor } from "./editor.js";

/**
 * TODO
 */
export function* LeafsInRange<T extends DocNode>(
  editor: Editor<T>,
  range: Range = toRange(editor.selection),
): Generator<InferInlineNode<T>, void, void> {
  if (isCollapsed(range)) {
    const n = getLeafAt(editor.doc, range[0])?.[0];
    if (n) {
      yield n as InferInlineNode<T>;
    }
  } else {
    for (const [n, o] of iterLeafs(editor.doc, ...range)) {
      if (hasIntersection(range, [o, o + getNodeSize(n)])) {
        yield n;
      }
    }
  }
}
