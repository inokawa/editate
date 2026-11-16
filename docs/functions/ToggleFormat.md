[**API**](../API.md)

***

# Function: ToggleFormat()

> **ToggleFormat**\<`T`\>(`editor`, `key`, `range?`): `void`

Defined in: [commands.ts:128](https://github.com/inokawa/editate/blob/12d33bccfeca058ef7302c87a94e740df476d8a4/src/commands.ts#L128)

Toggle formatting in the selection or specified range.

## Type Parameters

### T

`T` *extends* `DocNode`

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)\<`T`\>

### key

`Extract`\<`ToggleableKey`\<[`InferTextNode`](../type-aliases/InferTextNode.md)\<`T`\>\>, `string`\>

### range?

`Range` = `...`

## Returns

`void`
