[**API**](../API.md)

***

# Interface: PlainEditorOptions

Defined in: [presets/plain.ts:7](https://github.com/inokawa/editate/blob/67dafbb210b8f5568792788537128c9e23f2a4cc/src/presets/plain.ts#L7)

## Extends

- `Omit`\<[`EditorOptions`](EditorOptions.md)\<`PlainDoc`\>, `"doc"` \| `"schema"` \| `"onChange"`\>

## Properties

### text

> **text**: `string`

Defined in: [presets/plain.ts:14](https://github.com/inokawa/editate/blob/67dafbb210b8f5568792788537128c9e23f2a4cc/src/presets/plain.ts#L14)

Initial document text.

***

### singleline?

> `optional` **singleline?**: `boolean`

Defined in: [presets/plain.ts:18](https://github.com/inokawa/editate/blob/67dafbb210b8f5568792788537128c9e23f2a4cc/src/presets/plain.ts#L18)

TODO

***

### onChange

> **onChange**: (`text`) => `void`

Defined in: [presets/plain.ts:22](https://github.com/inokawa/editate/blob/67dafbb210b8f5568792788537128c9e23f2a4cc/src/presets/plain.ts#L22)

Callback invoked when document changes.

#### Parameters

##### text

`string`

#### Returns

`void`

***

### readonly?

> `optional` **readonly?**: `boolean`

Defined in: [editor.ts:120](https://github.com/inokawa/editate/blob/67dafbb210b8f5568792788537128c9e23f2a4cc/src/editor.ts#L120)

The state editable or not.

#### Inherited from

`Omit.readonly`

***

### isBlock?

> `optional` **isBlock?**: (`node`) => `boolean`

Defined in: [editor.ts:124](https://github.com/inokawa/editate/blob/67dafbb210b8f5568792788537128c9e23f2a4cc/src/editor.ts#L124)

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

Defined in: [editor.ts:130](https://github.com/inokawa/editate/blob/67dafbb210b8f5568792788537128c9e23f2a4cc/src/editor.ts#L130)

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

Defined in: [editor.ts:136](https://github.com/inokawa/editate/blob/67dafbb210b8f5568792788537128c9e23f2a4cc/src/editor.ts#L136)

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
