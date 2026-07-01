[**API**](../API.md)

***

# Function: ToggleBlockAttr()

> **ToggleBlockAttr**\<`T`, `N`, `K`\>(`editor`, `key`, `onValue`, `offValue`, `offset?`): `void`

Defined in: [commands.ts:162](https://github.com/inokawa/editate/blob/3570f29556b1df8ef9302ca8b08012a032554651/src/commands.ts#L162)

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
