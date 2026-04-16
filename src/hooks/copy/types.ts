import type { Fragment } from "../../doc/types.js";

export type CopyHook = (
  dataTransfer: DataTransfer,
  doc: Fragment,
  element: Element,
) => void;
