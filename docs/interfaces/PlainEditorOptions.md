[**API**](../API.md)

***

# Interface: PlainEditorOptions

Defined in: [presets/plain.ts:8](https://github.com/inokawa/editate/blob/ff326faf39e28307d1c4cd189dd4dfbf2a46580b/src/presets/plain.ts#L8)

## Extends

- `Omit`\<[`EditorOptions`](EditorOptions.md)\<`PlainDoc`\>, `"doc"` \| `"schema"` \| `"onChange"`\>

## Properties

### text

> **text**: `string`

Defined in: [presets/plain.ts:15](https://github.com/inokawa/editate/blob/ff326faf39e28307d1c4cd189dd4dfbf2a46580b/src/presets/plain.ts#L15)

Initial document text.

***

### singleline?

> `optional` **singleline?**: `boolean`

Defined in: [presets/plain.ts:19](https://github.com/inokawa/editate/blob/ff326faf39e28307d1c4cd189dd4dfbf2a46580b/src/presets/plain.ts#L19)

TODO

***

### onChange

> **onChange**: (`text`) => `void`

Defined in: [presets/plain.ts:23](https://github.com/inokawa/editate/blob/ff326faf39e28307d1c4cd189dd4dfbf2a46580b/src/presets/plain.ts#L23)

Callback invoked when document changes.

#### Parameters

##### text

`string`

#### Returns

`void`

***

### readonly?

> `optional` **readonly?**: `boolean`

Defined in: [editor.ts:122](https://github.com/inokawa/editate/blob/ff326faf39e28307d1c4cd189dd4dfbf2a46580b/src/editor.ts#L122)

The state editable or not.

#### Inherited from

`Omit.readonly`

***

### isBlock?

> `optional` **isBlock?**: (`node`) => `boolean`

Defined in: [editor.ts:126](https://github.com/inokawa/editate/blob/ff326faf39e28307d1c4cd189dd4dfbf2a46580b/src/editor.ts#L126)

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

Defined in: [editor.ts:132](https://github.com/inokawa/editate/blob/ff326faf39e28307d1c4cd189dd4dfbf2a46580b/src/editor.ts#L132)

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

Defined in: [editor.ts:138](https://github.com/inokawa/editate/blob/ff326faf39e28307d1c4cd189dd4dfbf2a46580b/src/editor.ts#L138)

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
