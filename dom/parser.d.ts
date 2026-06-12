interface ParserContext {
}
export type Parser = <T>(scopeFn: (ctx: ParserContext) => T, root?: Node, startNode?: Node) => T;
export {};
