import type { DocNode, InlineNode, InferNode } from "../../doc/types.js";
import { docToString } from "../../doc/utils.js";
import type { CopyHook } from "./types.js";

/**
 * An extension to handle copying to plain text.
 */
export const plainCopy = <T extends DocNode>(
  serializer?: (node: InferNode<T>) => string,
): CopyHook => {
  return (dataTransfer, data) => {
    dataTransfer.setData(
      "text/plain",
      docToString(
        { children: data },
        serializer as ((node: InlineNode) => string) | undefined,
      ),
    );
  };
};
