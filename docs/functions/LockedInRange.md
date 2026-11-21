[**API**](../API.md)

***

# Function: LockedInRange()

> **LockedInRange**(`editor`, `range?`): `boolean`

Defined in: [plugins/blockLock.ts:71](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/plugins/blockLock.ts#L71)

Check if the selection or specified range touches a locked block, which means editing operations on it will be cancelled.

## Parameters

### editor

[`Editor`](../interfaces/Editor.md)

### range?

`Range` = `...`

## Returns

`boolean`
