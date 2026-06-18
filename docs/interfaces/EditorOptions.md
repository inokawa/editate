[**API**](../API.md)

***

# Interface: EditorOptions\<T, S\>

Defined in: [editor.ts:105](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L105)

Options of [createEditor](../functions/createEditor.md).

## Type Parameters

### T

`T` *extends* `DocNode`

### S

`S` *extends* `StandardSchemaV1`\<`T`, `T`\> \| `void` = `void`

## Properties

### schema?

> `optional` **schema?**: `S`

Defined in: [editor.ts:112](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L112)

Optional [Standard Schema](https://github.com/standard-schema/standard-schema) to validate unsafe edits.

***

### doc

> **doc**: `T`

Defined in: [editor.ts:116](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L116)

Initial document.

***

### readonly?

> `optional` **readonly?**: `boolean`

Defined in: [editor.ts:120](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L120)

The state editable or not.

***

### isBlock?

> `optional` **isBlock?**: (`node`) => `boolean`

Defined in: [editor.ts:124](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L124)

TODO

#### Parameters

##### node

`HTMLElement`

#### Returns

`boolean`

***

### onWarn?

> `optional` **onWarn?**: (`message`) => `void`

Defined in: [editor.ts:130](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L130)

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

Defined in: [editor.ts:136](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L136)

Callback invoked when errors happen.

#### Parameters

##### message

`string`

#### Returns

`never`

#### Default

`throw new Error(message)`
