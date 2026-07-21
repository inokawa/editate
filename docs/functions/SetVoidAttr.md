[**API**](../API.md)

***

# Function: SetVoidAttr()

> **SetVoidAttr**\<`T`, `N`, `K`\>(`editor`, `key`, `value`, `offset?`): `void`

Defined in: [commands.ts:173](https://github.com/inokawa/editate/blob/f728245a4c1d491fa7adf0b75a08dec4c4ce63dd/src/commands.ts#L173)

Set attr to a void node at the caret or specified position.

## Type Parameters

### T

`T` *extends* `DocNode`

### N

`N` *extends* `VoidNode`

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
