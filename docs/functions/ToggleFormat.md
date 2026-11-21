[**API**](../API.md)

***

# Function: ToggleFormat()

> **ToggleFormat**\<`T`\>(`editor`, `key`, `range?`): `void`

Defined in: [commands.ts:128](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/commands.ts#L128)

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
