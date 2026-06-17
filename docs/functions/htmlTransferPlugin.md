[**API**](../API.md)

***

# Function: htmlTransferPlugin()

> **htmlTransferPlugin**\<`T`\>(`editor`, `options`): `void`

Defined in: [plugins/transfer/htmlTransfer.ts:60](https://github.com/inokawa/editate/blob/67dafbb210b8f5568792788537128c9e23f2a4cc/src/plugins/transfer/htmlTransfer.ts#L60)

A plugin to handle copying / pasting HTML

## Type Parameters

### T

`T` *extends* `DocNode`

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)\<`T`\>

### options

#### serializeText

(`t`) => `Extract`\<`InferInlineNode`\<`T`\>, `TextNode`\>

#### serializers?

(`node`) => `void` \| `Exclude`\<`InferInlineNode`\<`T`\>, `TextNode`\>[]

## Returns

`void`
