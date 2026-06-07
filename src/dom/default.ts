const SINGLE_LINE_CONTAINER_NAMES = new Set([
  // https://w3c.github.io/editing/docs/execCommand/#single-line-container
  // non-list single-line container
  "DIV",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "P",
  "PRE",
  // list single-line container
  "LI",
  "DT",
  "DD",

  // other elements for HTML paste
  "TR",
]);

/**
 * @internal
 */
export const defaultIsBlockNode = (node: Element): boolean => {
  return SINGLE_LINE_CONTAINER_NAMES.has(node.tagName);
};
