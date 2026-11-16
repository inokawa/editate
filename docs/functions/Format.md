[**API**](../API.md)

***

# Function: Format()

> **Format**\<`T`, `N`, `K`\>(`editor`, `key`, `value`, `range?`): `void`

Defined in: [commands.ts:110](https://github.com/inokawa/editate/blob/12d33bccfeca058ef7302c87a94e740df476d8a4/src/commands.ts#L110)

Format content in the selection or specified range.

## Type Parameters

### T

`T` *extends* `DocNode`

### N

`N` *extends* `TextNode`

### K

`K` *extends* `"text"`

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
