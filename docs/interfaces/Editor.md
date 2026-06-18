[**API**](../API.md)

***

# Interface: Editor\<T\>

Defined in: [editor.ts:177](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L177)

The editor instance.

## Type Parameters

### T

`T` *extends* `DocNode` = `DocNode`

## Methods

### apply()

> **apply**(`op`): `this`

Defined in: [editor.ts:189](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L189)

Dispatches editing operations.

#### Parameters

##### op

[`Operation`](../type-aliases/Operation.md) \| [`Operation`](../type-aliases/Operation.md)[]

[Operation](../type-aliases/Operation.md)

#### Returns

`this`

***

### exec()

#### Call Signature

> **exec**\<`A`\>(`fn`, ...`args`): `this`

Defined in: [editor.ts:195](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L195)

Executes a function with editor bound as context.

##### Type Parameters

###### A

`A` *extends* `unknown`[]

##### Parameters

###### fn

`EditorCommandOrPlugin`\<`A`, `T`\>

EditorCommandOrPlugin or EditorQuery

###### args

...`A`

arguments of the function

##### Returns

`this`

#### Call Signature

> **exec**\<`A`, `V`\>(`fn`, ...`args`): `V`

Defined in: [editor.ts:196](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L196)

##### Type Parameters

###### A

`A` *extends* `unknown`[]

###### V

`V`

##### Parameters

###### fn

`EditorQuery`\<`A`, `V`, `T`\>

###### args

...`A`

##### Returns

`V`

***

### on()

> **on**\<`K`\>(`key`, `callback`): () => `void`

Defined in: [editor.ts:201](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L201)

A function to subscribe editor events.

#### Type Parameters

##### K

`K` *extends* keyof `EditorEventMap`

#### Parameters

##### key

`K`

##### callback

`EditorEventMap`\[`K`\]

#### Returns

cleanup function

() => `void`

***

### hook()

> **hook**\<`K`\>(`key`, `callback`): () => `void`

Defined in: [editor.ts:209](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L209)

A function to register editor hooks.

#### Type Parameters

##### K

`K` *extends* keyof `EditorHookMap`

#### Parameters

##### key

`K`

##### callback

`EditorHookMap`\[`K`\]

#### Returns

cleanup function

() => `void`

***

### get()

> **get**\<`V`\>(`key`): `V`

Defined in: [editor.ts:216](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L216)

Get a value from the context.

#### Type Parameters

##### V

`V`

#### Parameters

##### key

[`EditorContext`](../type-aliases/EditorContext.md)\<`V`\>

#### Returns

`V`

***

### set()

> **set**\<`V`\>(`key`, `value`): `this`

Defined in: [editor.ts:220](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L220)

Set a value for the context.

#### Type Parameters

##### V

`V`

#### Parameters

##### key

[`EditorContext`](../type-aliases/EditorContext.md)\<`V`\>

##### value

`V`

#### Returns

`this`

## Properties

### doc

> `readonly` **doc**: `T`

Defined in: [editor.ts:178](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L178)

***

### selection

> **selection**: `Selection`

Defined in: [editor.ts:179](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L179)

***

### readonly

> **readonly**: `boolean`

Defined in: [editor.ts:184](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L184)

The getter/setter for the editor's read-only state.
`true` to read-only. `false` to editable.

***

### input

> **input**: (`element`) => () => `void`

Defined in: [editor.ts:225](https://github.com/inokawa/editate/blob/331552c72bf8fd93436719e1a6e937094f6fd4fa/src/editor.ts#L225)

A function to make DOM editable.

#### Parameters

##### element

`HTMLElement`

#### Returns

A function to stop subscribing DOM changes and restores previous DOM state.

() => `void`
