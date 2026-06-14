const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const DOCUMENT_FRAGMENT_NODE = 11;

/**
 * @internal
 */
export const isTextNode = (node: Node): node is Text => {
  return node.nodeType === TEXT_NODE;
};

/**
 * @internal
 */
export const isElementNode = (node: Node): node is Element => {
  return node.nodeType === ELEMENT_NODE;
};

/**
 * @internal
 */
export const isCommentNode = (node: Node): node is Comment => {
  return node.nodeType === COMMENT_NODE;
};

/**
 * @internal
 */
export const isDocumentFragment = (node: Node): node is DocumentFragment => {
  return node.nodeType === DOCUMENT_FRAGMENT_NODE;
};
