import { getNodeSize, isBlockNode } from "../doc/node.js";
import type { DocNode, Node } from "../doc/types.js";
import type { Editor } from "../editor.js";

interface NodeIdPluginContext {
  id: (node: Node) => string;
}

const largest = (nodes: readonly Node[], start: number, end: number) => {
  let j = start;
  for (let i = start + 1; i < end; i++) {
    if (getNodeSize(nodes[i]!) > getNodeSize(nodes[j]!)) j = i;
  }
  return j;
};

/**
 * A plugin to give immutable document nodes stable identifiers suitable for renderer keys.
 *
 * An id belongs to a node object and follows the node across edits.
 * A node recreated by an operation takes over the id of the node it was derived from.
 */
export function nodeIdPlugin<T extends DocNode>(editor: Editor<T>) {
  let sequence = 0;
  let doc: DocNode = editor.doc;
  const ids = new WeakMap<Node, string>();

  const reconcile = (prev: readonly Node[], next: readonly Node[]) => {
    if (prev === next) return;
    let start = 0;
    let prevEnd = prev.length;
    let nextEnd = next.length;
    while (start < prevEnd && start < nextEnd && prev[start] === next[start]) {
      start++;
    }
    while (
      start < prevEnd &&
      start < nextEnd &&
      prev[prevEnd - 1] === next[nextEnd - 1]
    ) {
      prevEnd--;
      nextEnd--;
    }
    const kept = new Set<Node>(next.slice(start, nextEnd));
    const m = prevEnd - start;
    const n = nextEnd - start;
    for (let i = start; i < prevEnd && i < nextEnd; i++) {
      // A node split into several or several merged into one: the largest piece carries the identity.
      const p = prev[n === 1 ? largest(prev, start, prevEnd) : i]!;
      const q = next[m === 1 ? largest(next, start, nextEnd) : i]!;
      // A surviving or already identified node keeps its identity, with its descendants'.
      if (kept.has(p) || ids.has(q)) continue;
      const id = ids.get(p);
      if (id != null) {
        // Hand over the id instead of copying it, so that an id never points to two nodes.
        ids.delete(p);
        ids.set(q, id);
      }
      if (isBlockNode(p) && isBlockNode(q)) reconcile(p.children, q.children);
    }
  };

  editor.set<NodeIdPluginContext>(nodeIdPlugin, {
    id: (node) => {
      const next = editor.doc;
      if (next !== doc) {
        const prev = doc;
        doc = next;
        reconcile(prev.children, next.children);
      }
      let id = ids.get(node);
      if (id == null) ids.set(node, (id = String(++sequence)));
      return id;
    },
  });
}

/**
 * Get the stable identifier of the given node, which is assigned on the first call.
 */
export function NodeId(editor: Editor, node: Node) {
  return editor.get<NodeIdPluginContext>(nodeIdPlugin).id(node);
}
