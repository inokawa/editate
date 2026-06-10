export type Parser = <T>(scopeFn: () => T, root?: Node, startNode?: Node) => T;
