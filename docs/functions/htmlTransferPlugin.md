[**API**](../API.md)

***

# Function: htmlTransferPlugin()

> **htmlTransferPlugin**\<`T`\>(`editor`, `options`): `void`

Defined in: [plugins/transfer/htmlTransfer.ts:150](https://github.com/inokawa/editate/blob/44215fcf4ae4e6409e32a411c0f3465296f1888b/src/plugins/transfer/htmlTransfer.ts#L150)

A plugin to handle copying / pasting HTML

Under [Trusted Types](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API), pasted HTML is parsed through a policy named `editate`.

## Type Parameters

### T

`T` *extends* `DocNode`

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)\<`T`\>

### options

#### serializers

`HtmlSerializers`\<`T`\>

## Returns

`void`
