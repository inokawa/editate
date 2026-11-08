[**API**](../API.md)

***

# Function: SetBlockAttr()

> **SetBlockAttr**\<`T`, `N`, `K`\>(`editor`, `key`, `value`, `range?`): `void`

Defined in: [commands.ts:155](https://github.com/inokawa/editate/blob/77fa3f457c4bbeaf1b3e868da8266d56da9d0255/src/commands.ts#L155)

Set attr to block nodes in the selection or specified range.

## Type Parameters

### T

`T` *extends* `DocNode`

### N

`N` *extends* `object` & `BlockNode` \| `object` & `BlockNode` \| `object` & `DocNode` \| `object` & `DocNode`

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
