[**API**](../API.md)

***

# Interface: PlainEditorOptions

Defined in: [presets/plain.ts:8](https://github.com/inokawa/editate/blob/f728245a4c1d491fa7adf0b75a08dec4c4ce63dd/src/presets/plain.ts#L8)

## Extends

- `Omit`\<[`EditorOptions`](EditorOptions.md)\<`PlainDoc`\>, `"doc"` \| `"schema"` \| `"onChange"`\>

## Properties

### text

> **text**: `string`

Defined in: [presets/plain.ts:15](https://github.com/inokawa/editate/blob/f728245a4c1d491fa7adf0b75a08dec4c4ce63dd/src/presets/plain.ts#L15)

Initial document text.

***

### singleline?

> `optional` **singleline?**: `boolean`

Defined in: [presets/plain.ts:19](https://github.com/inokawa/editate/blob/f728245a4c1d491fa7adf0b75a08dec4c4ce63dd/src/presets/plain.ts#L19)

TODO

***

### onChange

> **onChange**: (`text`) => `void`

Defined in: [presets/plain.ts:23](https://github.com/inokawa/editate/blob/f728245a4c1d491fa7adf0b75a08dec4c4ce63dd/src/presets/plain.ts#L23)

Callback invoked when document changes.

#### Parameters

##### text

`string`

#### Returns

`void`

***

### readonly?

> `optional` **readonly?**: `boolean`

Defined in: [editor.ts:118](https://github.com/inokawa/editate/blob/f728245a4c1d491fa7adf0b75a08dec4c4ce63dd/src/editor.ts#L118)

The state editable or not.

#### Inherited from

`Omit.readonly`

***

### isBlock?

> `optional` **isBlock?**: (`node`) => `boolean`

Defined in: [editor.ts:122](https://github.com/inokawa/editate/blob/f728245a4c1d491fa7adf0b75a08dec4c4ce63dd/src/editor.ts#L122)

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

Defined in: [editor.ts:128](https://github.com/inokawa/editate/blob/f728245a4c1d491fa7adf0b75a08dec4c4ce63dd/src/editor.ts#L128)

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

Defined in: [editor.ts:134](https://github.com/inokawa/editate/blob/f728245a4c1d491fa7adf0b75a08dec4c4ce63dd/src/editor.ts#L134)

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
