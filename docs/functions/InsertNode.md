[**API**](../API.md)

***

# Function: InsertNode()

> **InsertNode**\<`T`\>(`editor`, `node`, `position?`): `void`

Defined in: [commands.ts:43](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/commands.ts#L43)

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
