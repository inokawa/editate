[**API**](../API.md)

***

# Interface: PlainEditorOptions

Defined in: [presets/plain.ts:7](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/presets/plain.ts#L7)

## Extends

- `Omit`\<[`EditorOptions`](EditorOptions.md)\<`PlainDoc`\>, `"doc"` \| `"schema"` \| `"onChange"`\>

## Properties

### text

> **text**: `string`

Defined in: [presets/plain.ts:14](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/presets/plain.ts#L14)

Initial document text.

***

### singleline?

> `optional` **singleline?**: `boolean`

Defined in: [presets/plain.ts:18](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/presets/plain.ts#L18)

TODO

***

### onChange

> **onChange**: (`text`) => `void`

Defined in: [presets/plain.ts:22](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/presets/plain.ts#L22)

Callback invoked when document changes.

#### Parameters

##### text

`string`

#### Returns

`void`

***

### readonly?

> `optional` **readonly?**: `boolean`

Defined in: [editor.ts:121](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L121)

The state editable or not.

#### Inherited from

`Omit.readonly`

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

#### Inherited from

`Omit.isBlock`

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

#### Inherited from

`Omit.onWarn`

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

#### Inherited from

`Omit.onError`
