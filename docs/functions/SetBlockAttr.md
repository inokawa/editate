[**API**](../API.md)

***

# Function: SetBlockAttr()

> **SetBlockAttr**\<`T`, `N`, `K`\>(`editor`, `key`, `value`, `path?`): `void`

Defined in: [commands.ts:122](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/commands.ts#L122)

Set attr to a block node at the caret or specified position.

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

### value

`N`\[`K`\]

### path?

`Path` = `...`

## Returns

`void`
