[**API**](../API.md)

***

# Function: BlocksInRange()

> **BlocksInRange**\<`T`\>(`editor`, `range?`): `Generator`\<\[[`InferLeafBlockNode`](../type-aliases/InferLeafBlockNode.md)\<`T`\>, `number`, `Range`\], `void`, `void`\>

Defined in: [queries.ts:37](https://github.com/inokawa/editate/blob/77fa3f457c4bbeaf1b3e868da8266d56da9d0255/src/queries.ts#L37)

Get leaf block nodes that intersect with the selection or specified range, with their offsets. An empty block is included wherever the range reaches it.

## Type Parameters

### T

`T` *extends* `DocNode`

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)\<`T`\>

### range?

`Range` = `...`

## Returns

`Generator`\<\[[`InferLeafBlockNode`](../type-aliases/InferLeafBlockNode.md)\<`T`\>, `number`, `Range`\], `void`, `void`\>
