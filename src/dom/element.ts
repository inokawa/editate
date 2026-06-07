/** @internal */
export const LINE_BREAK_ELEMENT = 1;
/** @internal */
export const HIDDEN_ELEMENT = 2;
/** @internal */
export const VOID_ELEMENT = 3;
type ElementType =
  | typeof LINE_BREAK_ELEMENT
  | typeof HIDDEN_ELEMENT
  | typeof VOID_ELEMENT;

type TagName = Uppercase<
  | keyof HTMLElementTagNameMap
  | keyof SVGElementTagNameMap
  | keyof MathMLElementTagNameMap
>;

/**
 * @internal
 */
export const ELEMENT_TO_TYPE_MAP = new Map<string, ElementType>([
  ["BR", LINE_BREAK_ELEMENT],
  ["WBR", LINE_BREAK_ELEMENT],
  // https://html.spec.whatwg.org/multipage/rendering.html#hidden-elements
  ["AREA", HIDDEN_ELEMENT],
  ["BASE", HIDDEN_ELEMENT],
  // "BASEFONT",
  ["DATALIST", HIDDEN_ELEMENT],
  ["HEAD", HIDDEN_ELEMENT],
  ["LINK", HIDDEN_ELEMENT],
  ["META", HIDDEN_ELEMENT],
  // "NOEMBED",
  // "NOFRAMES",
  // "PARAM",
  ["RP", HIDDEN_ELEMENT],
  ["SCRIPT", HIDDEN_ELEMENT],
  ["STYLE", HIDDEN_ELEMENT],
  ["TEMPLATE", HIDDEN_ELEMENT],
  ["TITLE", HIDDEN_ELEMENT],
  // https://html.spec.whatwg.org/multipage/rendering.html#tables-2
  ["COLGROUP", HIDDEN_ELEMENT],
  // https://html.spec.whatwg.org/#void-elements
  // https://html.spec.whatwg.org/multipage/rendering.html#the-hr-element-2
  ["HR", VOID_ELEMENT],
  // https://html.spec.whatwg.org/multipage/dom.html#embedded-content-category
  // https://html.spec.whatwg.org/multipage/rendering.html#replaced-elements
  ["AUDIO", VOID_ELEMENT],
  ["CANVAS", VOID_ELEMENT],
  ["EMBED", VOID_ELEMENT],
  ["IFRAME", VOID_ELEMENT],
  ["IMG", VOID_ELEMENT],
  ["OBJECT", VOID_ELEMENT],
  ["PICTURE", VOID_ELEMENT],
  ["VIDEO", VOID_ELEMENT],
  ["SVG", VOID_ELEMENT],
  ["MATH", VOID_ELEMENT],
  // https://html.spec.whatwg.org/multipage/rendering.html#widgets
  ["BUTTON", VOID_ELEMENT],
  ["INPUT", VOID_ELEMENT],
  ["METER", VOID_ELEMENT],
  ["PROGRESS", VOID_ELEMENT],
  ["SELECT", VOID_ELEMENT],
  ["TEXTAREA", VOID_ELEMENT],
] satisfies [TagName, ElementType][]);
