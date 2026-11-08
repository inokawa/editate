[**API**](../API.md)

***

# Function: blockLockPlugin()

> **blockLockPlugin**\<`T`\>(`editor`, `options`): `void`

Defined in: [plugins/blockLock.ts:17](https://github.com/inokawa/editate/blob/77fa3f457c4bbeaf1b3e868da8266d56da9d0255/src/plugins/blockLock.ts#L17)

A plugin to make specific blocks read-only.

Locked blocks can still be selected and copied, but operations editing them are cancelled with their transaction, except ones that unlock the block.

## Type Parameters

### T

`T` *extends* `DocNode`

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)\<`T`\>

### options

#### isLocked

(`node`) => `boolean`

A function to check if the block is locked or not.

## Returns

`void`
