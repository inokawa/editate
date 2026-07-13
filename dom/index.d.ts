import { Parser } from './parser.js';
import { DocNode, Selection as JsSelection } from '../doc/types.js';
export { createParser, TOKEN_TEXT, TOKEN_VOID, TOKEN_SOFT_BREAK, TOKEN_BLOCK, } from './parser.js';
export { defaultIsBlockNode } from './default.js';
export declare const selectionToRange: (root: Element, parse: Parser, doc: DocNode, sel: JsSelection) => Range;
