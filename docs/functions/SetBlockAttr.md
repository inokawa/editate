[**API**](../API.md)

***

# Function: SetBlockAttr()

> **SetBlockAttr**\<`T`, `N`, `K`\>(`editor`, `key`, `value`, `range?`): `void`

Defined in: [commands.ts:157](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/commands.ts#L157)

Set attr to block nodes in the selection or specified range.

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

### value

`ExtractAttrValue`\<`N`, `K`\>

### range?

`Range` = `...`

## Returns

`void`
