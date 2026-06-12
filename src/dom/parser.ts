import { isElementNode, isTextNode } from "./utils.js";

const LINE_BREAK_ELEMENT = 1;
const HIDDEN_ELEMENT = 2;
const STUB_ELEMENT = 3;
type ElementType =
  | typeof LINE_BREAK_ELEMENT
  | typeof HIDDEN_ELEMENT
  | typeof STUB_ELEMENT;

type TagName = Uppercase<
  | keyof HTMLElementTagNameMap
  | keyof SVGElementTagNameMap
  | keyof MathMLElementTagNameMap
>;

const ELEMENT_TO_TYPE_MAP = new Map<string, ElementType>([
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
  ["HR", STUB_ELEMENT],
  // https://html.spec.whatwg.org/multipage/dom.html#embedded-content-category
  // https://html.spec.whatwg.org/multipage/rendering.html#replaced-elements
  ["AUDIO", STUB_ELEMENT],
  ["CANVAS", STUB_ELEMENT],
  ["EMBED", STUB_ELEMENT],
  ["IFRAME", STUB_ELEMENT],
  ["IMG", STUB_ELEMENT],
  ["OBJECT", STUB_ELEMENT],
  ["PICTURE", STUB_ELEMENT],
  ["VIDEO", STUB_ELEMENT],
  ["SVG", STUB_ELEMENT],
  ["MATH", STUB_ELEMENT],
  // https://html.spec.whatwg.org/multipage/rendering.html#widgets
  ["BUTTON", STUB_ELEMENT],
  ["INPUT", STUB_ELEMENT],
  ["METER", STUB_ELEMENT],
  ["PROGRESS", STUB_ELEMENT],
  ["SELECT", STUB_ELEMENT],
  ["TEXTAREA", STUB_ELEMENT],
] satisfies [TagName, ElementType][]) as ReadonlyMap<string, ElementType>;

const SHOW_ELEMENT = 0x1;
const SHOW_TEXT = 0x4;

const TOKEN_NULL = 0;
/** @internal */
export const TOKEN_TEXT = 1;
/** @internal */
export const TOKEN_VOID = 2;
/** @internal */
export const TOKEN_SOFT_BREAK = 3;
/** @internal */
export const TOKEN_BLOCK = 4;
const TOKEN_ANCHORABLE = 5;
const TOKEN_HIDDEN = 6;

/**
 * @internal
 */
export type TokenType =
  | typeof TOKEN_NULL
  | typeof TOKEN_TEXT
  | typeof TOKEN_VOID
  | typeof TOKEN_SOFT_BREAK
  | typeof TOKEN_BLOCK
  | typeof TOKEN_ANCHORABLE
  | typeof TOKEN_HIDDEN;

type VisibleTokenType = Exclude<
  TokenType,
  typeof TOKEN_NULL | typeof TOKEN_HIDDEN
>;

type InferDomNode<T extends TokenType> = T extends typeof TOKEN_TEXT
  ? Text
  : T extends typeof TOKEN_NULL | typeof TOKEN_HIDDEN
    ? never
    : Element;

/**
 * @internal
 */
export const isHiddenNode = (node: Element): boolean => {
  return ELEMENT_TO_TYPE_MAP.get(node.tagName) === HIDDEN_ELEMENT;
};

interface ParserContext {
  /**
   * @internal
   */
  _next: () => VisibleTokenType | void;
  /**
   * @internal
   */
  _readToken: () => TokenType;
  /**
   * @internal
   */
  _domNode: <T extends TokenType | void = void>() => T extends TokenType
    ? InferDomNode<T>
    : Node;
  /**
   * @internal
   */
  _nodeSize: () => number;
  /**
   * @internal
   */
  _nextBlock: () => void;
  /**
   * @internal
   */
  _parentBlock: () => void;
}

/**
 * @internal
 */
export const createParser = (
  document: Document,
  isBlock: (node: Element) => boolean,
): Parser => {
  let walker: TreeWalker | null = null;
  let node: Node | null = null;
  let _token: TokenType | null = null;

  const readToken = (): TokenType => {
    if (_token != null) {
      return _token;
    }

    if (node) {
      if (isTextNode(node)) {
        const text = node.data;
        // Ignore empty text nodes some frameworks may generate
        if (text) {
          return (_token =
            // Especially Shift+Enter in Chrome
            text === "\n"
              ? isValidSoftBreak()
                ? TOKEN_SOFT_BREAK
                : TOKEN_ANCHORABLE
              : TOKEN_TEXT);
        }
      } else if (isElementNode(node)) {
        if ((node as HTMLElement).contentEditable === "false") {
          return (_token = TOKEN_VOID);
        } else {
          const elementType = ELEMENT_TO_TYPE_MAP.get(node.tagName);
          if (elementType != null) {
            return (_token =
              elementType === LINE_BREAK_ELEMENT
                ? isValidSoftBreak()
                  ? // Especially Shift+Enter in Firefox
                    TOKEN_SOFT_BREAK
                  : // Returning <div><br/></div> is necessary to anchor selection
                    TOKEN_ANCHORABLE
                : elementType === STUB_ELEMENT
                  ? TOKEN_VOID
                  : TOKEN_HIDDEN);
          } else if (isBlock!(node)) {
            return (_token = TOKEN_BLOCK);
          }
        }
      } else {
        // e.g. Comment
        return (_token = TOKEN_HIDDEN);
      }
    }
    return (_token = TOKEN_NULL);
  };

  const nextNode = (): Node | null => {
    const prevToken = readToken();
    _token = null;

    if (prevToken === TOKEN_VOID || prevToken === TOKEN_HIDDEN) {
      const current = node!;
      node = walker!.nextSibling();
      if (!node) {
        // to support case like <p><a><img /></a></p><p>hello</p> / <p><span contentEditable="false">nested<span>tag</span></span></p>
        while ((node = walker!.nextNode())) {
          if (!current.contains(node)) {
            break;
          }
        }
      }
      return node;
    } else {
      return (node = walker!.nextNode());
    }
  };

  const nextBlock = () => {
    while ((_token = null) || (node = walker!.nextSibling())) {
      if (readToken() === TOKEN_BLOCK) {
        return;
      }
    }
  };

  const parentBlock = () => {
    while ((_token = null) || (node = walker!.parentNode())) {
      if (readToken() === TOKEN_BLOCK) {
        return;
      }
    }
  };

  const isValidSoftBreak = (): boolean => {
    // This function will return false if there are no nodes after soft break.
    //
    // In contenteditable, Shift+Enter will insert soft break. \n in Chrome, <br/> in Firefox. Safari doesn't insert soft break.
    // And \n or <br/> has a special role that represents empty block in contenteditable.
    // We have to distinguish real soft breaks from empty blocks.
    //
    // There are many possible markups for soft break ([] means text node):
    // <div>[\n][abc]</div>         Shift+Enter at start of line in Chrome
    // <div><br/>[abc]</div>        Shift+Enter at start of line in Firefox
    // <div>[ab][\n][c]</div>       Shift+Enter at mid of line in Chrome
    // <div>[ab]<br/>[c]</div>      Shift+Enter at mid of line in Firefox
    // <div>[abc][\n][\n]</div>     Shift+Enter at end of line in Chrome
    // <div>[abc]<br/><br/></div>   Shift+Enter at end of line in Firefox
    // <div>[\n]<br/></div>         Shift+Enter at empty line in Chrome
    // <div><br/><br/></div>        Shift+Enter at empty line in Firefox
    //
    // And these do not include soft breaks:
    // <div><br/></div>             empty line
    // <div>[a]<br/></div>          type on empty line in Firefox
    const parent = node!.parentNode!;
    return parser(() => {
      // To avoid "RangeError: Maximum call stack size exceeded"
      _token = TOKEN_NULL;

      while (nextNode()) {
        if (readToken()) {
          return true;
        }
        if (!parent.contains(node)) {
          break;
        }
      }
      return false;
    });
  };

  const readNext = (): VisibleTokenType | void => {
    while (nextNode()) {
      const t = readToken();
      if (t && t !== TOKEN_HIDDEN) {
        return t;
      }
    }
  };

  const context: ParserContext = {
    _next: readNext,
    _readToken: readToken,
    _domNode: () => {
      return node as any;
    },
    _nodeSize: () => {
      const token = readToken();
      return token === TOKEN_TEXT
        ? (node as InferDomNode<typeof token>).data.length
        : token === TOKEN_VOID
          ? 1
          : 0;
    },
    _nextBlock: nextBlock,
    _parentBlock: parentBlock,
  };
  const parser: Parser = (scopeFn, root, startNode) => {
    const prevWalker = walker;
    const prevNode = node;
    const prevToken = _token;
    try {
      if (!walker) {
        walker = document.createTreeWalker(root!, SHOW_TEXT | SHOW_ELEMENT);
      }
      if (startNode) {
        walker!.currentNode = node = startNode;
      }
      return scopeFn(context);
    } finally {
      walker = prevWalker;
      node = prevNode;
      _token = prevToken;
      if (walker && prevNode) {
        walker.currentNode = prevNode;
      }
    }
  };
  return parser;
};

export type Parser = <T>(
  scopeFn: (ctx: ParserContext) => T,
  root?: Node,
  startNode?: Node,
) => T;
