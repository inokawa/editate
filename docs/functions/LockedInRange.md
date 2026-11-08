[**API**](../API.md)

***

# Function: LockedInRange()

> **LockedInRange**(`editor`, `range?`): `boolean`

Defined in: [plugins/blockLock.ts:71](https://github.com/inokawa/editate/blob/77fa3f457c4bbeaf1b3e868da8266d56da9d0255/src/plugins/blockLock.ts#L71)

Check if the selection or specified range touches a locked block, which means editing operations on it will be cancelled.

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)

### range?

`Range` = `...`

## Returns

`boolean`
