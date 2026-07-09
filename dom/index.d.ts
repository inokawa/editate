import { Parser } from './parser.js';
import { DomSelection } from '../doc/types.js';
export { createParser, TOKEN_TEXT, TOKEN_VOID, TOKEN_SOFT_BREAK, TOKEN_BLOCK, } from './parser.js';
export { defaultIsBlockNode } from './default.js';
export declare const selectionToRange: (root: Element, parse: Parser, [anchor, focus]: DomSelection, posDiff: number) => Range;
