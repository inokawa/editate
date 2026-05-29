[**API**](../API.md)

***

# Function: ToggleFormat()

> **ToggleFormat**\<`T`\>(`editor`, `key`, `range?`): `void`

Defined in: [commands.ts:101](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/commands.ts#L101)

Toggle formatting in the selection or specified range.

## Type Parameters

### T

`T` *extends* `DocNode`

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)\<`T`\>

### key

`Extract`\<`ToggleableKey`\<`Omit`\<`InferInlineNode`\<`T`\>, `"text"`\>\>, `string`\>

### range?

`Range` = `...`

## Returns

`void`
