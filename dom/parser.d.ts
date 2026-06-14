interface ParserContext {
}
export interface Parser {
    <T>(scopeFn: (ctx: ParserContext) => T, root?: Node): T;
}
export {};
