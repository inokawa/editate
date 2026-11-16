[**API**](../API.md)

***

# Function: mapPosition()

> **mapPosition**(`position`, `op`, `stickBefore?`): `number`

Defined in: [doc/operation.ts:254](https://github.com/inokawa/editate/blob/12d33bccfeca058ef7302c87a94e740df476d8a4/src/doc/operation.ts#L254)

Remap a position through the given operation.

## Parameters

### position

`number`

### op

[`Operation`](../type-aliases/Operation.md)

### stickBefore?

`boolean`

`true` to keep the position in place when content is inserted at it, instead of moving it after the inserted content.

## Returns

`number`
