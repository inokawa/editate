[**API**](../API.md)

***

# Function: Format()

> **Format**\<`T`, `N`, `K`\>(`editor`, `key`, `value`, `range?`): `void`

Defined in: [commands.ts:85](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/commands.ts#L85)

Format content in the selection or specified range.

## Type Parameters

### T

`T` *extends* `DocNode`

### N

`N` *extends* `Omit`\<`InferInlineNode`\<`T`\>, `"text"`\>

### K

`K` *extends* `string`

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)\<`T`\>

### key

`K`

### value

`N`\[`K`\]

### range?

`Range` = `...`

## Returns

`void`
