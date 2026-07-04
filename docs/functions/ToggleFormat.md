[**API**](../API.md)

***

# Function: ToggleFormat()

> **ToggleFormat**\<`T`\>(`editor`, `key`, `range?`): `void`

Defined in: [commands.ts:103](https://github.com/inokawa/editate/blob/df4de2ad3f6def53d366037a34e4ef8fc1047ab2/src/commands.ts#L103)

Toggle formatting in the selection or specified range.

## Type Parameters

### T

`T` *extends* `DocNode`

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)\<`T`\>

### key

`Extract`\<`ToggleableKey`\<`Omit`\<[`InferTextNode`](../type-aliases/InferTextNode.md)\<`T`\>, `"text"`\>\>, `string`\>

### range?

`Range` = `...`

## Returns

`void`
