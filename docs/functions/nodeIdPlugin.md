[**API**](../API.md)

***

# Function: nodeIdPlugin()

> **nodeIdPlugin**\<`T`\>(`editor`): `void`

Defined in: [plugins/nodeId.ts:23](https://github.com/inokawa/editate/blob/44215fcf4ae4e6409e32a411c0f3465296f1888b/src/plugins/nodeId.ts#L23)

A plugin to give immutable document nodes stable identifiers suitable for renderer keys.

An id belongs to a node object and follows the node across edits.
A node recreated by an operation takes over the id of the node it was derived from.

## Type Parameters

### T

`T` *extends* `DocNode`

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)\<`T`\>

## Returns

`void`
