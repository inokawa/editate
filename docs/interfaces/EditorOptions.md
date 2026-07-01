[**API**](../API.md)

***

# Interface: EditorOptions\<T, S\>

Defined in: [editor.ts:107](https://github.com/inokawa/editate/blob/3570f29556b1df8ef9302ca8b08012a032554651/src/editor.ts#L107)

Options of [createEditor](../functions/createEditor.md).

## Type Parameters

### T

`T` *extends* `DocNode`

### S

`S` *extends* `StandardSchemaV1`\<`T`, `T`\> \| `void` = `void`

## Properties

### schema?

> `optional` **schema?**: `S`

Defined in: [editor.ts:114](https://github.com/inokawa/editate/blob/3570f29556b1df8ef9302ca8b08012a032554651/src/editor.ts#L114)

Optional [Standard Schema](https://github.com/standard-schema/standard-schema) to validate unsafe edits.

***

### doc

> **doc**: `T`

Defined in: [editor.ts:118](https://github.com/inokawa/editate/blob/3570f29556b1df8ef9302ca8b08012a032554651/src/editor.ts#L118)

Initial document.

***

### readonly?

> `optional` **readonly?**: `boolean`

Defined in: [editor.ts:122](https://github.com/inokawa/editate/blob/3570f29556b1df8ef9302ca8b08012a032554651/src/editor.ts#L122)

The state editable or not.

***

### isBlock?

> `optional` **isBlock?**: (`node`) => `boolean`

Defined in: [editor.ts:126](https://github.com/inokawa/editate/blob/3570f29556b1df8ef9302ca8b08012a032554651/src/editor.ts#L126)

TODO

#### Parameters

##### node

`HTMLElement`

#### Returns

`boolean`

***

### onWarn?

> `optional` **onWarn?**: (`message`) => `void`

Defined in: [editor.ts:132](https://github.com/inokawa/editate/blob/3570f29556b1df8ef9302ca8b08012a032554651/src/editor.ts#L132)

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

Defined in: [editor.ts:138](https://github.com/inokawa/editate/blob/3570f29556b1df8ef9302ca8b08012a032554651/src/editor.ts#L138)

Callback invoked when errors happen.

#### Parameters

##### message

`string`

#### Returns

`never`

#### Default

`throw new Error(message)`
