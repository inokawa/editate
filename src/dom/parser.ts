let walker: TreeWalker | null = null;
let node: Node | null = null;
let _token: TokenType | null = null;
let config: ParserConfig | null = null;
let parse: Parser | null = null;

interface ParserConfig {
  readonly _document: Document;
  readonly _isBlock: (node: Element) => boolean;
  readonly _isVoid: (node: Element) => boolean;
}

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
const TOKEN_EMPTY_BLOCK_ANCHOR = 5;
const TOKEN_INVALID_SOFT_BREAK = 6;

/**
 * @internal
 */
export type TokenType =
  | typeof TOKEN_NULL
  | typeof TOKEN_TEXT
  | typeof TOKEN_VOID
  | typeof TOKEN_SOFT_BREAK
  | typeof TOKEN_BLOCK
  | typeof TOKEN_EMPTY_BLOCK_ANCHOR
  | typeof TOKEN_INVALID_SOFT_BREAK;

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;

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
export const getDomNode = <
  T extends TokenType | void,
>(): T extends typeof TOKEN_TEXT
  ? Text
  : T extends TokenType
    ? Element
    : Text | Element => {
  return node as any;
};

/**
 * @internal
 */
export const getNodeSize = (): number => {
  const token = readToken();
  return token === TOKEN_TEXT
    ? (node as Text).data.length
    : token === TOKEN_VOID
      ? 1
      : 0;
};

/**
 * @internal
 */
export const readToken = (): TokenType => {
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
              : TOKEN_INVALID_SOFT_BREAK
            : TOKEN_TEXT);
      }
    } else if (isElementNode(node)) {
      if (node.tagName === "BR") {
        return (_token = isValidSoftBreak()
          ? // Especially Shift+Enter in Firefox
            TOKEN_SOFT_BREAK
          : // Returning <div><br/></div> is necessary to anchor selection
            TOKEN_EMPTY_BLOCK_ANCHOR);
      } else if (config!._isVoid(node)) {
        return (_token = TOKEN_VOID);
      } else if (config!._isBlock(node)) {
        return (_token = TOKEN_BLOCK);
      }
    }
  }
  return (_token = TOKEN_NULL);
};

const nextNode = (): Node | null => {
  _token = null;
  return (node = walker!.nextNode());
};

/**
 * @internal
 */
export const nextBlock = () => {
  while ((_token = null) || (node = walker!.nextSibling())) {
    if (readToken() === TOKEN_BLOCK) {
      return;
    }
  }
};

/**
 * @internal
 */
export const parentBlock = () => {
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
  return parse!(() => {
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

/**
 * @internal
 */
export const readNext = (): Exclude<TokenType, typeof TOKEN_NULL> | void => {
  while (true) {
    if (readToken() === TOKEN_VOID) {
      const current = node!;
      // don't use TreeWalker.nextSibling() to support case like <body><p><a><img /></a></p><p>hello</p></body>
      while (nextNode()) {
        if (!current.contains(node)) {
          break;
        }
      }
    } else {
      nextNode();
    }

    if (!node) {
      break;
    }

    const t = readToken();
    if (t) {
      return t;
    }
  }
};

/**
 * @internal
 */
export const createParser = (initConfig: ParserConfig): Parser => {
  const parser: Parser = (scopeFn, root, startNode) => {
    const prevConfig = config;
    const prevParse = parse;
    const prevWalker = walker;
    const prevNode = node;
    const prevToken = _token;
    try {
      if (!walker) {
        config = initConfig;
        parse = parser;
        walker = config._document.createTreeWalker(
          root!,
          SHOW_TEXT | SHOW_ELEMENT,
        );
      }
      if (startNode) {
        walker!.currentNode = node = startNode;
      }
      return scopeFn();
    } finally {
      config = prevConfig;
      parse = prevParse;
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

export type Parser = <T>(scopeFn: () => T, root?: Node, startNode?: Node) => T;
