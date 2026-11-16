[**API**](../API.md)

***

# Type Alias: InferInlineNode\<T\>

> **InferInlineNode**\<`T`\> = `T` *extends* `Parent` ? `Exclude`\<[`InferBlockNode`](InferBlockNode.md)\<`T`\>\[`"children"`\]\[`number`\], `Parent`\> : `T`

Defined in: [doc/types-infer.ts:31](https://github.com/inokawa/editate/blob/12d33bccfeca058ef7302c87a94e740df476d8a4/src/doc/types-infer.ts#L31)

## Type Parameters

### T

`T` *extends* `Node`
