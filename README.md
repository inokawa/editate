# edix

![npm](https://img.shields.io/npm/v/edix) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/edix) ![npm](https://img.shields.io/npm/dw/edix) [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/inokawa/edix) [![check](https://github.com/inokawa/edix/actions/workflows/check.yml/badge.svg)](https://github.com/inokawa/edix/actions/workflows/check.yml) [![demo](https://github.com/inokawa/edix/actions/workflows/demo.yml/badge.svg)](https://github.com/inokawa/edix/actions/workflows/demo.yml)

> An experimental, framework agnostic, small (5kB+) [contenteditable](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable) state manager.

## Motivation

Web editing is so hard even today. There are excellent libraries to make complex rich text editor, but they are too much for small purposes. Native [textarea](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) element is accessible and easy to use, but it's hardly customizable.

[contenteditable](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable) attribute is a primitive for rich text editing, [that was designed for Internet Explorer and copied by other browsers](https://blog.whatwg.org/the-road-to-html-5-contenteditable). As you may know it has [so many problems](https://github.com/grammarly/contenteditable). It has no clear spec, it has many edge case bugs, and has cross browser/OS/input device problems. And it doesn't work well with declarative frontend frameworks... However, at least the core of contenteditable is stable and it works in all browsers except the inconsistencies. This library aims to fill that gap, fix contenteditable to fit modern web development.

## Demo

- [React Storybook](https://inokawa.github.io/edix/)
- [Framework examples](#other-examples)

## Install

```sh
npm install edix
```

`typescript >=5.0` is recommended.

### Supported browsers

Browser versions supporting [beforeinput event](https://developer.mozilla.org/en-US/docs/Web/API/Element/beforeinput_event#browser_compatibility) are supported.

Mobile browsers are also supported, but with some issues (https://github.com/inokawa/edix/issues/97).

## Getting started

1. Define your contents declaratively. There are rules you have to follow:
   - You must render `<br/>` in empty row (limitation of contenteditable).
   - If `singleline` option is
     - `false` or undefined, direct children of the root are treated as rows. They must be elements, not text.
     - `true`, direct children of the root are treated as inline nodes.
   - (TODO)

2. Initialize `Editor` with `createPlainEditor`/`createEditor`.
3. Call `Editor.input` on mount, with `HTMLElement` which is the root of editable contents.
4. Update your state with `onChange`, which will be called on edit.
5. Call returned function from `Editor.input` on unmount for cleanup.

Here is an example for React.

### Plain text

```tsx
import { useState, useEffect, useRef } from "react";
import { createPlainEditor } from "edix";

export const App = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("Hello world.");

  useEffect(() => {
    // 2. init
    const editor = createPlainEditor({
      text: text,
      onChange: (v) => {
        // 4. update state
        setText(v);
      },
    });
    // 3. bind to DOM
    const cleanup = editor.input(ref.current);
    return () => {
      // 5. cleanup DOM
      cleanup();
    };
  }, []);

  // 1. render contents from state
  return (
    <div
      ref={ref}
      style={{
        backgroundColor: "white",
        border: "solid 1px darkgray",
        padding: 8,
      }}
    >
      {text.split("\n").map((t, i) => (
        <div key={i}>{t ? t : <br />}</div>
      ))}
    </div>
  );
};
```

### Rich text

[Standard Schema](https://github.com/standard-schema/standard-schema) is supported.

```tsx
import { useState, useEffect, useRef, useMemo } from "react";
import { createEditor, ToggleFormat, ToggleBlockAttr } from "edix";
import * as z from "zod";

const schema = z.strictObject({
  children: z.array(
    z.strictObject({
      align: z.enum(["left", "right"]).optional(),
      children: z.array(
        z.strictObject({
          text: z.string(),
          bold: z.boolean().optional(),
          italic: z.boolean().optional(),
        }),
      ),
    }),
  ),
});

export const App = () => {
  const ref = useRef<HTMLDivElement>(null);

  type Doc = z.infer<typeof schema>;
  const [doc, setDoc] = useState<Doc>({
    children: [
      {
        children: [
          { text: "Hello", bold: true },
          { text: " " },
          { text: "World", italic: true },
          { text: "." },
        ],
      },
    ],
  });

  const editor = useMemo(
    () =>
      createEditor({
        doc,
        schema,
        onChange: setDoc,
      }),
    [],
  );

  useEffect(() => {
    return editor.input(ref.current);
  }, []);

  return (
    <div>
      <div>
        <button
          onClick={() => {
            editor.apply(ToggleFormat, "bold");
          }}
        >
          bold
        </button>
        <button
          onClick={() => {
            editor.apply(ToggleFormat, "italic");
          }}
        >
          italic
        </button>
        <button
          onClick={() => {
            editor.apply(ToggleBlockAttr, "align", "right", undefined);
          }}
        >
          align
        </button>
      </div>
      <div
        ref={ref}
        style={{
          backgroundColor: "white",
          border: "solid 1px darkgray",
          padding: 8,
        }}
      >
        {doc.children.map((b, i) => (
          <div key={i} style={{ textAlign: b.align }}>
            {b.children.map((n, j) => (
              <span
                key={j}
                style={{
                  fontWeight: n.bold ? "bold" : undefined,
                  fontStyle: n.italic ? "italic" : undefined,
                }}
              >
                {n.text || <br />}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Other examples

- React ([Demo](https://inokawa.github.io/edix/react), [Source](./examples/react))
- Vue ([Demo](https://inokawa.github.io/edix/vue), [Source](./examples/vue))
- Svelte ([Demo](https://inokawa.github.io/edix/svelte), [Source](./examples/svelte))
- Solid ([Demo](https://inokawa.github.io/edix/solid), [Source](./examples/solid))
- Angular ([Demo](https://inokawa.github.io/edix/angular), [Source](./examples/angular))
- Preact ([Demo](https://inokawa.github.io/edix/preact), [Source](./examples/preact))
- Vanilla ([Demo](https://inokawa.github.io/edix/vanilla), [Source](./examples/vanilla))

...and more! Contribution welcome!

## Documentation

- [API reference](./docs/API.md)
- [Storybook examples](./stories) for more usages
- [DeepWiki](https://deepwiki.com/inokawa/edix)

## Contribute

All contributions are welcome.
If you find a problem, feel free to create an [issue](https://github.com/inokawa/edix/issues) or a [PR](https://github.com/inokawa/edix/pulls). If you have a question, ask in [discussions](https://github.com/inokawa/edix/discussions).

### Making a Pull Request

1. Fork this repo.
2. Run `npm install`.
3. Commit your fix.
4. Make a PR and confirm all the CI checks passed.

## Inspirations

- [ProseMirror](https://prosemirror.net/)
- [Slate](https://github.com/ianstormtaylor/slate)
- [Lexical](https://github.com/facebook/lexical)
- [Quill](https://github.com/slab/quill)
- [Tiptap](https://github.com/ueberdosis/tiptap)
- [Draft.js](https://github.com/facebookarchive/draft-js)
- [rich-textarea](https://github.com/inokawa/rich-textarea) (my early project)
- [use-editable](https://github.com/FormidableLabs/use-editable)
- [@react-libraries/markdown-editor](https://github.com/ReactLibraries/markdown-editor)
- [VS Code](https://github.com/microsoft/vscode)
- [Language Server Protocol](https://github.com/microsoft/language-server-protocol)
- [urql](https://github.com/urql-graphql/urql)
- [TanStack DB](https://github.com/tanstack/db)
- [Hono](https://github.com/honojs/hono)
- [Textbus](https://github.com/textbus/textbus)
- [vistree](https://github.com/mizchi/vistree)
- Proposed [EditContext API](https://github.com/w3c/edit-context)
- Proposed [Richer Text Fields](https://open-ui.org/components/richer-text-fields.explainer/) in [Open UI](https://open-ui.org/)
