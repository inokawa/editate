[**API**](../API.md)

***

# Interface: EditorOptions\<T, S\>

Defined in: [editor.ts:103](https://github.com/inokawa/editate/blob/f728245a4c1d491fa7adf0b75a08dec4c4ce63dd/src/editor.ts#L103)

Options of [createEditor](../functions/createEditor.md).

## Type Parameters

### T

`T` *extends* `DocNode`

### S

`S` *extends* `StandardSchemaV1`\<`T`, `T`\> \| `void` = `void`

## Properties

### schema?

> `optional` **schema?**: `S`

Defined in: [editor.ts:110](https://github.com/inokawa/editate/blob/f728245a4c1d491fa7adf0b75a08dec4c4ce63dd/src/editor.ts#L110)

Optional [Standard Schema](https://github.com/standard-schema/standard-schema) to validate unsafe edits.

***

### doc

> **doc**: `T`

Defined in: [editor.ts:114](https://github.com/inokawa/editate/blob/f728245a4c1d491fa7adf0b75a08dec4c4ce63dd/src/editor.ts#L114)

Initial document.

***

### readonly?

> `optional` **readonly?**: `boolean`

Defined in: [editor.ts:118](https://github.com/inokawa/editate/blob/f728245a4c1d491fa7adf0b75a08dec4c4ce63dd/src/editor.ts#L118)

The state editable or not.

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
