[**API**](../API.md)

***

# Function: internalTransferPlugin()

> **internalTransferPlugin**(`editor`, `options?`): `void`

Defined in: [plugins/transfer/internalTransfer.ts:13](https://github.com/inokawa/editate/blob/44215fcf4ae4e6409e32a411c0f3465296f1888b/src/plugins/transfer/internalTransfer.ts#L13)

A plugin to handle copying / pasting between editor instances

Any website can write data of `options.mime` type to the clipboard, and it's pasted as is, so validate it with [EditorOptions.schema](../interfaces/EditorOptions.md#schema).

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)

### options?

#### mime?

`string`

A MIME type to store the copied fragment in clipboard. Give an app specific one if the schema is not shared with other editate based apps.

## Returns

`void`

## Default Value

`"application/x-editate-editor"`
