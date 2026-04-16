import type { DocNode } from "../doc/types.js";
import type { Editor } from "../editor.js";

export type EditorPlugin<A extends unknown[], T extends DocNode> = (
  this: Editor<T>,
  ...args: A
) => void;
