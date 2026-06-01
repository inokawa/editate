[**API**](../API.md)

***

# Interface: Editor\<T\>

Defined in: [editor.ts:179](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L179)

The editor instance.

## Type Parameters

### T

`T` *extends* `DocNode` = `DocNode`

## Methods

### apply()

> **apply**(`op`): `this`

Defined in: [editor.ts:191](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L191)

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

Defined in: [editor.ts:197](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L197)

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

Defined in: [editor.ts:198](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L198)

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

Defined in: [editor.ts:203](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L203)

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

Defined in: [editor.ts:211](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L211)

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

Defined in: [editor.ts:218](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L218)

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

Defined in: [editor.ts:222](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L222)

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

Defined in: [editor.ts:180](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L180)

***

### selection

> **selection**: `Selection`

Defined in: [editor.ts:181](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L181)

***

### readonly

> **readonly**: `boolean`

Defined in: [editor.ts:186](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L186)

The getter/setter for the editor's read-only state.
`true` to read-only. `false` to editable.

***

### input

> **input**: (`element`) => () => `void`

Defined in: [editor.ts:227](https://github.com/inokawa/editate/blob/ce6b010f119c8164ca856f84509db1367eebcdde/src/editor.ts#L227)

A function to make DOM editable.

#### Parameters

##### element

`HTMLElement`

#### Returns

A function to stop subscribing DOM changes and restores previous DOM state.

() => `void`
