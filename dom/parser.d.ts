interface ParserContext {
}
export interface Parser {
    <T>(scopeFn: (ctx: ParserContext) => T, root: Node, startNode?: Node): T;
    <T>(scopeFn: (ctx: ParserContext) => T): T;
}
export {};
