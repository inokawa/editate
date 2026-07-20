[**API**](../API.md)

***

# Function: Format()

> **Format**\<`T`, `N`, `K`\>(`editor`, `key`, `value`, `range?`): `void`

Defined in: [commands.ts:86](https://github.com/inokawa/editate/blob/a7f675be7afb0d57e1b64b4f27cdfc3905458d01/src/commands.ts#L86)

Format content in the selection or specified range.

## Type Parameters

### T

`T` *extends* `DocNode`

### N

`N` *extends* `Omit`\<[`InferTextNode`](../type-aliases/InferTextNode.md)\<`T`\>, `"text"`\>

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
