[**API**](../API.md)

***

# Function: Format()

> **Format**\<`T`, `N`, `K`\>(`editor`, `key`, `value`, `range?`): `void`

Defined in: [commands.ts:87](https://github.com/inokawa/editate/blob/67dafbb210b8f5568792788537128c9e23f2a4cc/src/commands.ts#L87)

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
