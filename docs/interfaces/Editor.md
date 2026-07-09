[**API**](../API.md)

***

# Interface: Editor\<T\>

Defined in: [editor.ts:179](https://github.com/inokawa/editate/blob/3aaa0d3290473e1eb077dff1cd2673a227e22ec2/src/editor.ts#L179)

The editor instance.

## Type Parameters

### T

`T` *extends* `DocNode` = `DocNode`

## Methods

### apply()

> **apply**(`op`): `this`

Defined in: [editor.ts:191](https://github.com/inokawa/editate/blob/3aaa0d3290473e1eb077dff1cd2673a227e22ec2/src/editor.ts#L191)

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

Defined in: [editor.ts:197](https://github.com/inokawa/editate/blob/3aaa0d3290473e1eb077dff1cd2673a227e22ec2/src/editor.ts#L197)

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

Defined in: [editor.ts:201](https://github.com/inokawa/editate/blob/3aaa0d3290473e1eb077dff1cd2673a227e22ec2/src/editor.ts#L201)

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

Defined in: [editor.ts:206](https://github.com/inokawa/editate/blob/3aaa0d3290473e1eb077dff1cd2673a227e22ec2/src/editor.ts#L206)

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

Defined in: [editor.ts:214](https://github.com/inokawa/editate/blob/3aaa0d3290473e1eb077dff1cd2673a227e22ec2/src/editor.ts#L214)

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

Defined in: [editor.ts:221](https://github.com/inokawa/editate/blob/3aaa0d3290473e1eb077dff1cd2673a227e22ec2/src/editor.ts#L221)

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

Defined in: [editor.ts:225](https://github.com/inokawa/editate/blob/3aaa0d3290473e1eb077dff1cd2673a227e22ec2/src/editor.ts#L225)

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

Defined in: [editor.ts:180](https://github.com/inokawa/editate/blob/3aaa0d3290473e1eb077dff1cd2673a227e22ec2/src/editor.ts#L180)

***

### selection

> **selection**: `Selection`

Defined in: [editor.ts:181](https://github.com/inokawa/editate/blob/3aaa0d3290473e1eb077dff1cd2673a227e22ec2/src/editor.ts#L181)

***

### readonly

> **readonly**: `boolean`

Defined in: [editor.ts:186](https://github.com/inokawa/editate/blob/3aaa0d3290473e1eb077dff1cd2673a227e22ec2/src/editor.ts#L186)

The getter/setter for the editor's read-only state.
`true` to read-only. `false` to editable.

***

### input

> **input**: (`element`) => () => `void`

Defined in: [editor.ts:230](https://github.com/inokawa/editate/blob/3aaa0d3290473e1eb077dff1cd2673a227e22ec2/src/editor.ts#L230)

A function to make DOM editable.

#### Parameters

##### element

`HTMLElement`

#### Returns

A function to stop subscribing DOM changes and restores previous DOM state.

() => `void`
