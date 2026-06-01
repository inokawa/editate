[**API**](../API.md)

***

# Function: ToggleBlockAttr()

> **ToggleBlockAttr**\<`T`, `N`, `K`\>(`editor`, `key`, `onValue`, `offValue`, `offset?`): `void`

Defined in: [commands.ts:151](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/commands.ts#L151)

Toggle attr of block node at the caret or specified position.

## Type Parameters

### T

`T` *extends* `DocNode`

### N

`N` *extends* `DocNode` & BlockNode & InlineNode

### K

`K` *extends* `string`

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)\<`T`\>

### key

`K`

### onValue

`N`\[`K`\]

### offValue

`N`\[`K`\]

### offset?

`number` = `...`

## Returns

`void`
