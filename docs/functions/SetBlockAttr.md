[**API**](../API.md)

***

# Function: SetBlockAttr()

> **SetBlockAttr**\<`T`, `N`, `K`\>(`editor`, `key`, `value`, `offset?`): `void`

Defined in: [commands.ts:148](https://github.com/inokawa/editate/blob/08be6f5c1ac0bfde7172d49f43a249aebf0f3e4e/src/commands.ts#L148)

Set attr to a block node at the caret or specified position.

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

### value

`ExtractAttrValue`\<`N`, `K`\>

### offset?

`number` = `...`

## Returns

`void`
