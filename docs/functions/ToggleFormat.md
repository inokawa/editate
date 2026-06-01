[**API**](../API.md)

***

# Function: ToggleFormat()

> **ToggleFormat**\<`T`\>(`editor`, `key`, `range?`): `void`

Defined in: [commands.ts:101](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/commands.ts#L101)

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
