import type { Fragment } from "../../doc/types.js";
import type { Parser } from "../../dom/parser.js";

export type PasteHook = (
  dataTransfer: DataTransfer,
  parser: Parser,
) => string | Fragment | null;
