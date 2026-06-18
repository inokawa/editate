[**API**](../API.md)

***

# Function: InsertNode()

> **InsertNode**\<`T`\>(`editor`, `node`, `position?`): `void`

Defined in: [commands.ts:42](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/commands.ts#L42)

Insert node at the caret or specified position.

## Type Parameters

### T

`T` *extends* `DocNode`

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)\<`T`\>

### node

`Exclude`\<`InferInlineNode`\<`T`\>, `TextNode`\>

### position?

`number` = `...`

## Returns

`void`
