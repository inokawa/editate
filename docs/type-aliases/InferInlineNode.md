[**API**](../API.md)

***

# Type Alias: InferInlineNode\<T\>

> **InferInlineNode**\<`T`\> = `T` *extends* `Parent` ? `Exclude`\<[`InferBlockNode`](InferBlockNode.md)\<`T`\>\[`"children"`\]\[`number`\], `Parent`\> : `T`

Defined in: [doc/types-infer.ts:31](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/doc/types-infer.ts#L31)

## Type Parameters

### T

`T` *extends* `Node`
