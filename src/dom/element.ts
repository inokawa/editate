/** @internal */
export const HIDDEN_ELEMENT = 1;
/** @internal */
export const EMBEDDED_ELEMENT = 2;
type ElementType = typeof HIDDEN_ELEMENT | typeof EMBEDDED_ELEMENT;

type TagName = Uppercase<
  | keyof HTMLElementTagNameMap
  | keyof SVGElementTagNameMap
  | keyof MathMLElementTagNameMap
>;

/**
 * @internal
 */
export const ELEMENT_TO_TYPE_MAP = new Map<string, ElementType>([
  ["TEMPLATE", HIDDEN_ELEMENT],
  ["STYLE", HIDDEN_ELEMENT],
  ["SCRIPT", HIDDEN_ELEMENT],
  ["COLGROUP", HIDDEN_ELEMENT],
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories
  // https://html.spec.whatwg.org/multipage/dom.html#embedded-content-category
  ["EMBED", EMBEDDED_ELEMENT],
  ["IMG", EMBEDDED_ELEMENT],
  ["PICTURE", EMBEDDED_ELEMENT],
  ["AUDIO", EMBEDDED_ELEMENT],
  ["VIDEO", EMBEDDED_ELEMENT],
  ["SVG", EMBEDDED_ELEMENT],
  ["CANVAS", EMBEDDED_ELEMENT],
  ["MATH", EMBEDDED_ELEMENT],
  ["IFRAME", EMBEDDED_ELEMENT],
  ["OBJECT", EMBEDDED_ELEMENT],
] satisfies [TagName, ElementType][]);
