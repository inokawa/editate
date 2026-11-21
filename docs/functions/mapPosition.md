[**API**](../API.md)

***

# Function: mapPosition()

> **mapPosition**(`position`, `op`, `stickBefore?`): `number`

Defined in: [doc/operation.ts:254](https://github.com/inokawa/editate/blob/44215fcf4ae4e6409e32a411c0f3465296f1888b/src/doc/operation.ts#L254)

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
