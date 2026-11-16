[**API**](../API.md)

***

# Function: internalTransferPlugin()

> **internalTransferPlugin**(`editor`, `options?`): `void`

Defined in: [plugins/transfer/internalTransfer.ts:11](https://github.com/inokawa/editate/blob/12d33bccfeca058ef7302c87a94e740df476d8a4/src/plugins/transfer/internalTransfer.ts#L11)

A plugin to handle copying / pasting between editor instances

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
