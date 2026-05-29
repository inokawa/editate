[**API**](../API.md)

***

# Interface: PlainEditorOptions

Defined in: [presets/plain.ts:7](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/presets/plain.ts#L7)

## Extends

- `Omit`\<[`EditorOptions`](EditorOptions.md)\<`PlainDoc`\>, `"doc"` \| `"schema"` \| `"onChange"`\>

## Properties

### text

> **text**: `string`

Defined in: [presets/plain.ts:14](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/presets/plain.ts#L14)

Initial document text.

***

### singleline?

> `optional` **singleline?**: `boolean`

Defined in: [presets/plain.ts:18](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/presets/plain.ts#L18)

TODO

***

### onChange

> **onChange**: (`text`) => `void`

Defined in: [presets/plain.ts:22](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/presets/plain.ts#L22)

Callback invoked when document changes.

#### Parameters

##### text

`string`

#### Returns

`void`

***

### readonly?

> `optional` **readonly?**: `boolean`

Defined in: [editor.ts:118](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L118)

The state editable or not.

#### Inherited from

`Omit.readonly`

***

### isBlock?

> `optional` **isBlock?**: (`node`) => `boolean`

Defined in: [editor.ts:122](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L122)

TODO

#### Parameters

##### node

`HTMLElement`

#### Returns

`boolean`

#### Inherited from

`Omit.isBlock`

***

### onError?

> `optional` **onError?**: (`message`) => `void`

Defined in: [editor.ts:128](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L128)

Callback invoked when errors happen.

#### Parameters

##### message

`string`

#### Returns

`void`

#### Default

```ts
console.error
```

#### Inherited from

`Omit.onError`
