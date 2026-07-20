[**API**](../API.md)

***

# Function: SetVoidAttr()

> **SetVoidAttr**\<`T`, `N`, `K`\>(`editor`, `key`, `value`, `offset?`): `void`

Defined in: [commands.ts:174](https://github.com/inokawa/editate/blob/a7f675be7afb0d57e1b64b4f27cdfc3905458d01/src/commands.ts#L174)

Set attr to a void node at the caret or specified position.

## Type Parameters

### T

`T` *extends* `DocNode`

### N

`N` *extends* `InlineNode`

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
