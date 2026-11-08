[**API**](../API.md)

***

# Function: mapPosition()

> **mapPosition**(`position`, `op`, `stickBefore?`): `number`

Defined in: [doc/operation.ts:252](https://github.com/inokawa/editate/blob/77fa3f457c4bbeaf1b3e868da8266d56da9d0255/src/doc/operation.ts#L252)

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
