[**API**](../API.md)

***

# Interface: Editor\<T\>

Defined in: [editor.ts:174](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L174)

The editor instance.

## Type Parameters

### T

`T` *extends* `DocNode` = `DocNode`

## Methods

### apply()

> **apply**(`op`): `this`

Defined in: [editor.ts:186](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L186)

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

Defined in: [editor.ts:192](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L192)

Executes a function with editor bound as context.

##### Type Parameters

###### A

`A` *extends* `unknown`[]

##### Parameters

###### fn

`EditorCommand`\<`A`, `T`\>

EditorCommand or EditorQuery

###### args

...`A`

arguments of the function

##### Returns

`this`

#### Call Signature

> **exec**\<`A`, `V`\>(`fn`, ...`args`): `V`

Defined in: [editor.ts:193](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L193)

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

Defined in: [editor.ts:198](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L198)

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

Defined in: [editor.ts:206](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L206)

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

Defined in: [editor.ts:213](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L213)

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

Defined in: [editor.ts:217](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L217)

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

Defined in: [editor.ts:175](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L175)

***

### selection

> **selection**: `Selection`

Defined in: [editor.ts:176](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L176)

***

### readonly

> **readonly**: `boolean`

Defined in: [editor.ts:181](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L181)

The getter/setter for the editor's read-only state.
`true` to read-only. `false` to editable.

***

### input

> **input**: (`element`) => () => `void`

Defined in: [editor.ts:222](https://github.com/inokawa/editate/blob/5cda532dc434747839fdedefcca192367ddd3088/src/editor.ts#L222)

A function to make DOM editable.

#### Parameters

##### element

`HTMLElement`

#### Returns

A function to stop subscribing DOM changes and restores previous DOM state.

() => `void`
