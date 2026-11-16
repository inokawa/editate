[**API**](../API.md)

***

# Function: LockedInRange()

> **LockedInRange**(`editor`, `range?`): `boolean`

Defined in: [plugins/blockLock.ts:71](https://github.com/inokawa/editate/blob/12d33bccfeca058ef7302c87a94e740df476d8a4/src/plugins/blockLock.ts#L71)

Check if the selection or specified range touches a locked block, which means editing operations on it will be cancelled.

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)

### range?

`Range` = `...`

## Returns

`boolean`
