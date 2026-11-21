[**API**](../API.md)

***

# Function: LeavesInRange()

> **LeavesInRange**\<`T`\>(`editor`, `range?`): `Generator`\<[`InferInlineNode`](../type-aliases/InferInlineNode.md)\<`T`\>, `void`, `void`\>

Defined in: [queries.ts:16](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/queries.ts#L16)

Get leaf nodes that intersect with the selection or specified range. An empty leaf is included wherever the range reaches it.

## Type Parameters

### T

`T` *extends* `DocNode`

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)\<`T`\>

### range?

`Range` = `...`

## Returns

`Generator`\<[`InferInlineNode`](../type-aliases/InferInlineNode.md)\<`T`\>, `void`, `void`\>
