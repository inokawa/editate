[**API**](../API.md)

***

# Type Alias: InferInlineNode\<T\>

> **InferInlineNode**\<`T`\> = `T` *extends* `Parent` ? `Exclude`\<[`InferBlockNode`](InferBlockNode.md)\<`T`\>\[`"children"`\]\[`number`\], `Parent`\> : `T`

Defined in: [doc/types-infer.ts:31](https://github.com/inokawa/editate/blob/44215fcf4ae4e6409e32a411c0f3465296f1888b/src/doc/types-infer.ts#L31)

## Type Parameters

### T

`T` *extends* `Node`
