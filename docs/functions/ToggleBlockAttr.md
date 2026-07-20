[**API**](../API.md)

***

# Function: ToggleBlockAttr()

> **ToggleBlockAttr**\<`T`, `N`, `K`\>(`editor`, `key`, `onValue`, `offValue`, `offset?`): `void`

Defined in: [commands.ts:151](https://github.com/inokawa/editate/blob/a7f675be7afb0d57e1b64b4f27cdfc3905458d01/src/commands.ts#L151)

Toggle attr of block node at the caret or specified position.

## Type Parameters

### T

`T` *extends* `DocNode`

### N

`N` *extends* `DocNode`

### K

`K` *extends* `string`

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)\<`T`\>

### key

`K`

### onValue

`ExtractAttrValue`\<`N`, `K`\>

### offValue

`ExtractAttrValue`\<`N`, `K`\>

### offset?

`number` = `...`

## Returns

`void`
