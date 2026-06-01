[**API**](../API.md)

***

# Interface: EditorOptions\<T, S\>

Defined in: [editor.ts:106](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L106)

Options of [createEditor](../functions/createEditor.md).

## Type Parameters

### T

`T` *extends* `DocNode`

### S

`S` *extends* `StandardSchemaV1`\<`T`, `T`\> \| `void` = `void`

## Properties

### schema?

> `optional` **schema?**: `S`

Defined in: [editor.ts:113](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L113)

Optional [Standard Schema](https://github.com/standard-schema/standard-schema) to validate unsafe edits.

***

### doc

> **doc**: `T`

Defined in: [editor.ts:117](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L117)

Initial document.

***

### readonly?

> `optional` **readonly?**: `boolean`

Defined in: [editor.ts:121](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L121)

The state editable or not.

***

### isBlock?

> `optional` **isBlock?**: (`node`) => `boolean`

Defined in: [editor.ts:125](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L125)

TODO

#### Parameters

##### node

`HTMLElement`

#### Returns

`boolean`

***

### onWarn?

> `optional` **onWarn?**: (`message`) => `void`

Defined in: [editor.ts:131](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L131)

Callback invoked when errors happen.

#### Parameters

##### message

`string`

#### Returns

`void`

#### Default

```ts
console.warn
```

***

### onError?

> `optional` **onError?**: (`message`) => `never`

Defined in: [editor.ts:137](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L137)

Callback invoked when errors happen.

#### Parameters

##### message

`string`

#### Returns

`never`

#### Default

`throw new Error(message)`
