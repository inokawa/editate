[**API**](../API.md)

***

# Function: SetBlockAttr()

> **SetBlockAttr**\<`T`, `N`, `K`\>(`editor`, `key`, `value`, `offset?`): `void`

Defined in: [commands.ts:133](https://github.com/inokawa/editate/blob/f728245a4c1d491fa7adf0b75a08dec4c4ce63dd/src/commands.ts#L133)

Set attr to a block node at the caret or specified position.

## Type Parameters

### T

`T` *extends* `DocNode`

### N

`N` *extends* `DocNode` \| `object` & `DocNode`

### K

`K` *extends* `string`

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)\<`T`\>

### key

`K`

### value

`ExtractAttrValue`\<`N`, `K`\>

### offset?

`number` = `...`

## Returns

`void`
