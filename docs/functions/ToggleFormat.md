[**API**](../API.md)

***

# Function: ToggleFormat()

> **ToggleFormat**\<`T`\>(`editor`, `key`, `range?`): `void`

Defined in: [commands.ts:102](https://github.com/inokawa/editate/blob/0810ace32d66275e904514e9febc6b53ae2e180f/src/commands.ts#L102)

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
