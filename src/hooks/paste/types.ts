import type { Fragment } from "../../doc/types.js";
import type { ParserConfig } from "../../dom/parser.js";

export type PasteHook = (
  dataTransfer: DataTransfer,
  config: ParserConfig,
) => string | Fragment | null;
