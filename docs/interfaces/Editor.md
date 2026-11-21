[**API**](../API.md)

***

# Interface: Editor\<T\>

Defined in: [editor.ts:188](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/editor.ts#L188)

The editor instance.

## Type Parameters

### T

`T` *extends* `DocNode` = `DocNode`

## Methods

### apply()

> **apply**(`op`): `this`

Defined in: [editor.ts:200](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/editor.ts#L200)

Applies editing operations as a transaction, which is discarded if one of them is cancelled or throws, or the result is rejected by the schema.

#### Parameters

##### op

[`Operation`](../type-aliases/Operation.md) \| readonly [`Operation`](../type-aliases/Operation.md)[]

[Operation](../type-aliases/Operation.md)

#### Returns

`this`

***

### exec()

#### Call Signature

> **exec**\<`A`\>(`fn`, ...`args`): `this`

Defined in: [editor.ts:206](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/editor.ts#L206)

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

Defined in: [editor.ts:210](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/editor.ts#L210)

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

Defined in: [editor.ts:215](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/editor.ts#L215)

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

Defined in: [editor.ts:223](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/editor.ts#L223)

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

Defined in: [editor.ts:230](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/editor.ts#L230)

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

Defined in: [editor.ts:234](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/editor.ts#L234)

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

Defined in: [editor.ts:189](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/editor.ts#L189)

***

### selection

> **selection**: `Selection`

Defined in: [editor.ts:190](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/editor.ts#L190)

***

### readonly

> **readonly**: `boolean`

Defined in: [editor.ts:195](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/editor.ts#L195)

The getter/setter for the editor's read-only state.
`true` to read-only. `false` to editable.

***

### input

> **input**: (`element`) => () => `void`

Defined in: [editor.ts:239](https://github.com/inokawa/editate/blob/ea4ae783901e2f8bcc03273ecd5fdcaeccad4574/src/editor.ts#L239)

A function to make DOM editable.

#### Parameters

##### element

`HTMLElement`

#### Returns

A function to stop subscribing DOM changes and restores previous DOM state.

() => `void`
