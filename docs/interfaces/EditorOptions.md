[**API**](../API.md)

***

# Interface: EditorOptions\<T, S\>

Defined in: [editor.ts:103](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L103)

Options of [createEditor](../functions/createEditor.md).

## Type Parameters

### T

`T` *extends* `DocNode`

### S

`S` *extends* `StandardSchemaV1`\<`T`, `T`\> \| `void` = `void`

## Properties

### schema?

> `optional` **schema?**: `S`

Defined in: [editor.ts:110](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L110)

Optional [Standard Schema](https://github.com/standard-schema/standard-schema) to validate unsafe edits.

***

### doc

> **doc**: `T`

Defined in: [editor.ts:114](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L114)

Initial document.

***

### readonly?

> `optional` **readonly?**: `boolean`

Defined in: [editor.ts:118](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L118)

The state editable or not.

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
