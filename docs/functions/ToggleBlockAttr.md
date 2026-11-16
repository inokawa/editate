[**API**](../API.md)

***

# Function: ToggleBlockAttr()

> **ToggleBlockAttr**\<`T`, `N`, `K`\>(`editor`, `key`, `onValue`, `offValue`, `range?`): `void`

Defined in: [commands.ts:173](https://github.com/inokawa/editate/blob/12d33bccfeca058ef7302c87a94e740df476d8a4/src/commands.ts#L173)

Toggle attr of block nodes in the selection or specified range.

## Type Parameters

### T

`T` *extends* `DocNode`

### N

`N` *extends* `BlockNode` \| `DocNode`

### K

`K` *extends* `string`

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)\<`T`\>

### key

`K`

### onValue

`ExtractAttrValue`\<`N`, `K`\>

### offValue

`ExtractAttrValue`\<`N`, `K`\>

### range?

`Range` = `...`

## Returns

`void`
