[**API**](../API.md)

***

# Function: LeavesInRange()

> **LeavesInRange**\<`T`\>(`editor`, `range?`): `Generator`\<[`InferInlineNode`](../type-aliases/InferInlineNode.md)\<`T`\>, `void`, `void`\>

Defined in: [queries.ts:10](https://github.com/inokawa/editate/blob/a7f675be7afb0d57e1b64b4f27cdfc3905458d01/src/queries.ts#L10)

Get leaf nodes that intersect with the selection or specified range.

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
