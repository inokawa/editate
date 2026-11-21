[**API**](../API.md)

***

# Function: htmlTransferPlugin()

> **htmlTransferPlugin**\<`T`\>(`editor`, `options`): `void`

Defined in: [plugins/transfer/htmlTransfer.ts:156](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/plugins/transfer/htmlTransfer.ts#L156)

A plugin to handle copying / pasting HTML

Under [Trusted Types](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API), pasted HTML is parsed through a policy named `editate`. Allow the name in the `trusted-types` directive, with `'allow-duplicates'` if multiple copies of this library are loaded in a page.
Otherwise HTML may not be parsed, and the data is left to the paste hooks registered after this plugin.

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
