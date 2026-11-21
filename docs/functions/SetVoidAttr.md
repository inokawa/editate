[**API**](../API.md)

***

# Function: SetVoidAttr()

> **SetVoidAttr**\<`T`, `N`, `K`\>(`editor`, `key`, `value`, `offset?`): `void`

Defined in: [commands.ts:204](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/commands.ts#L204)

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
