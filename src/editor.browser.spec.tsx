import { describe, expect, it, onTestFinished, vi } from "vitest";
import { cdp, commands, page, server, userEvent } from "vitest/browser";
// Types the cdp session as playwright's
import type {} from "@vitest/browser-playwright";
import {
  createRef,
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type Ref,
} from "react";
import { createRoot } from "react-dom/client";
import * as v from "valibot";
import {
  createEditor,
  createPlainEditor,
  Delete,
  getLeafAt,
  InsertNode,
  InsertText,
  internalTransferPlugin,
  keymapPlugin,
  plainTransferPlugin,
  singlelinePlugin,
  ToggleBlockAttr,
  ToggleFormat,
} from "./index.js";
import {
  createParser,
  defaultIsBlockNode,
  getDOMSelection,
  getSelectionRangeInEditor,
  takeSelectionSnapshot,
  TOKEN_BLOCK,
  TOKEN_SOFT_BREAK,
  TOKEN_TEXT,
  TOKEN_VOID,
} from "./dom/index.js";
import type { TokenType } from "./dom/parser.js";
import type { DomPosition } from "./doc/types.js";
import type { KeyString } from "./keyboard.js";

declare module "vitest/browser" {
  interface BrowserCommands {
    mouseDrag: (
      from: [x: number, y: number],
      to: [x: number, y: number],
    ) => Promise<void>;
  }
}

const microtask = () => Promise.resolve();

// Every action below ends with a task boundary, so the browser settles it (selectionchange etc.) before the next action, like real interaction does
const settle = () => new Promise((resolve) => setTimeout(resolve));

// Sends keys through user-event, one key per call so that each key settles like real typing
const send = async (keys: string) => {
  await userEvent.keyboard(keys);
  await settle();
};

// Letters are sent as the lowercase key, so they are typed uppercase only with Shift like a real keyboard
const press = (key: KeyString) => {
  const names = key.split("+");
  const modifiers = names
    .slice(0, -1)
    .map((m) => (m === "Mod" ? "ControlOrMeta" : m === "Ctrl" ? "Control" : m));
  const name = names[names.length - 1]!;
  return send(
    modifiers.map((m) => `{${m}>}`).join("") +
      (name.length > 1
        ? `{${name}}`
        : // "[" and "{" open a key descriptor in user-event syntax
          name === "[" || name === "{"
          ? name + name
          : name.toLowerCase()) +
      modifiers
        .toReversed()
        .map((m) => `{/${m}}`)
        .join(""),
  );
};

const type = async (text: string) => {
  for (const t of text.split("")) {
    await send(t);
  }
};

const loop = async (count: number, fn: () => Promise<void>) => {
  for (let i = 1; i <= count; i++) {
    await fn();
  }
};

const click = async (name: string) => {
  await userEvent.click(page.getByRole("button", { name }));
  await settle();
};

const dblClick = async (
  element: HTMLElement,
  position: { x: number; y: number },
) => {
  await userEvent.dblClick(element, { position });
  await settle();
};

// Composition through CDP, so chromium only
const compose = async (
  text: string,
  [selectionStart, selectionEnd]: [number, number] = [0, 0],
) => {
  await cdp().send("Input.imeSetComposition", {
    text,
    selectionStart,
    selectionEnd,
  });
  await settle();
};

const commit = async (text: string) => {
  await cdp().send("Input.insertText", { text });
  await settle();
};

const render = (element: ReactElement): HTMLElement => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(element);
  onTestFinished(() => {
    root.unmount();
    container.remove();
  });
  return container;
};

const getEditable = (container: HTMLElement): Promise<HTMLElement> => {
  return vi.waitFor(() => {
    const editable = container.querySelector<HTMLElement>(
      '[contenteditable="true"]',
    );
    if (!editable) throw new Error("editable is not rendered");
    return editable;
  });
};

const readClipboard = async (
  type: "text/plain" | "text/html",
): Promise<string | null> => {
  for (const item of await navigator.clipboard.read()) {
    if (item.types.includes(type)) {
      const blob = await item.getType(type);
      return await blob.text();
    }
  }
  return null;
};

const NON_EDITABLE_PLACEHOLDER = "$";

const getText = (
  element: HTMLElement,
  { blockTag, selected }: { blockTag?: string; selected?: boolean } = {},
): string[] => {
  const document = element.ownerDocument;
  let target: Node = element;
  if (selected) {
    const selection = document.getSelection()!;
    target = selection.getRangeAt(0)!.cloneContents();
  }

  const parse = createParser(
    document,
    blockTag ? (n) => n.tagName === blockTag.toUpperCase() : defaultIsBlockNode,
  );

  return parse(({ _next: next, _domNode: domNode }) => {
    let type: TokenType | void;
    let row: string[] | null = null;
    let text = "";
    let hasContent = false;

    const rows: string[] = [];

    const completeText = () => {
      if (text) {
        if (!row) {
          row = [];
        }
        row.push(text);
        text = "";
      }
    };
    const completeRow = () => {
      completeText();
      if (!row && hasContent) {
        row = [];
      }
      if (row) {
        rows.push(row.join(""));
      }
      row = null;
      hasContent = false;
    };

    while ((type = next())) {
      if (type === TOKEN_BLOCK) {
        completeRow();
      } else {
        hasContent = true;

        if (type === TOKEN_TEXT) {
          text += domNode<typeof type>().data;
        } else if (type === TOKEN_VOID) {
          completeText();
          if (!row) {
            row = [];
          }
          row.push(NON_EDITABLE_PLACEHOLDER);
        } else if (type === TOKEN_SOFT_BREAK) {
          completeRow();
        }
      }
    }
    completeRow();

    if (!rows.length) {
      rows.push("");
    }

    return rows;
  }, target);
};

const getSelection = (
  element: HTMLElement,
  { blockTag }: { blockTag?: string } = {},
): [number, number] => {
  const lines = getText(element, { blockTag });
  const selection = takeSelectionSnapshot(
    element,
    createParser(
      element.ownerDocument,
      blockTag
        ? (n) => n.tagName === blockTag.toUpperCase()
        : defaultIsBlockNode,
    ),
  );

  const transformPos = ([path, offset]: DomPosition): number => {
    const p = path.length ? path[0]! : 0;
    for (let i = 0; i < p; i++) {
      const length = lines[i]!.length;
      offset += length;
      if (i !== lines.length - 1) {
        offset++;
      }
    }
    return offset;
  };
  return [transformPos(selection[0]), transformPos(selection[1])];
};

const ANCHOR = "^";
const FOCUS = "|";

// The rows of getText joined with "\n", with the selection of getSelection marked like assert_selection of Chromium: ANCHOR at the anchor and FOCUS at the focus, or only FOCUS for a caret
// Nothing is marked when the selection is outside the editable
// https://chromium.googlesource.com/chromium/src/+/main/third_party/blink/web_tests/editing/assert_selection.js
const getState = (
  element: HTMLElement,
  config: { blockTag?: string } = {},
): string => {
  const text = getText(element, config).join("\n");
  if (text.includes(ANCHOR) || text.includes(FOCUS)) {
    throw new Error(`text contains a marker: ${text}`);
  }
  if (!getSelectionRangeInEditor(getDOMSelection(element), element)) {
    return text;
  }
  const [anchor, focus] = getSelection(element, config);
  const mark = (t: string, offset: number, marker: string) =>
    t.slice(0, offset) + marker + t.slice(offset);
  if (anchor === focus) {
    return mark(text, focus, FOCUS);
  }
  // mark the later offset first so the earlier one stays valid
  return anchor < focus
    ? mark(mark(text, focus, FOCUS), anchor, ANCHOR)
    : mark(mark(text, anchor, ANCHOR), focus, FOCUS);
};

const getSelectedRect = (element: HTMLElement): DOMRect => {
  const selection = element.ownerDocument.getSelection()!;
  return selection.getRangeAt(0)!.getBoundingClientRect();
};

const moveSelectionToOrigin = async (element: HTMLElement) => {
  const selection = element.ownerDocument.getSelection()!;
  selection.setBaseAndExtent(element, 0, element, 0);
  await settle();
};

const browser = server.browser;

type PlainEditor = ReturnType<typeof createPlainEditor>;

const PlainEditor = ({
  initialText,
  style,
}: {
  initialText: string;
  style?: CSSProperties;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(initialText);
  useEffect(() => {
    return createPlainEditor({ text, onChange: setText }).input(ref.current!);
  }, []);
  return (
    <div ref={ref} style={style}>
      {text.split("\n").map((t, i) => (
        <div key={i}>{t ? t : <br />}</div>
      ))}
    </div>
  );
};

const SinglelinePlainEditor = ({ initialText }: { initialText: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(initialText);
  useEffect(() => {
    return createPlainEditor({
      text,
      singleline: true,
      onChange: setText,
    }).input(ref.current!);
  }, []);
  return <div ref={ref}>{text ? text : <br />}</div>;
};

const SpanAsBlockEditor = ({ initialText }: { initialText: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(initialText);
  useEffect(() => {
    return createPlainEditor({
      text,
      isBlock: (node) => !!node.dataset["line"],
      onChange: setText,
    }).input(ref.current!);
  }, []);
  return (
    <div ref={ref}>
      {text.split("\n").map((t, i) => (
        <span key={i} data-line style={{ display: "block" }}>
          {t ? t : <br />}
        </span>
      ))}
    </div>
  );
};

// With `async`, the marks are computed in a later task
const HighlightEditor = ({
  initialText,
  initialSearch,
  async,
  ref: editorRef,
}: {
  initialText: string;
  initialSearch: string;
  async?: boolean;
  ref?: Ref<PlainEditor>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(initialText);
  const [searchText, setSearchText] = useState(initialSearch);
  const editor = useMemo(
    () => createPlainEditor({ text, onChange: setText }),
    [],
  );
  useImperativeHandle(editorRef, () => editor, []);
  useEffect(() => {
    return editor.input(ref.current!);
  }, []);

  const [markedText, setMarkedText] = useState(async ? "" : text);
  useEffect(() => {
    if (!async) return;
    const timer = setTimeout(() => setMarkedText(text));
    return () => {
      clearTimeout(timer);
    };
  }, [async, text]);
  const marks = (async ? markedText : text)
    .split("\n")
    .map((l) =>
      searchText
        ? [...l.matchAll(new RegExp(searchText, "g"))].map(
            (m): [start: number, end: number] => [
              m.index,
              m.index + m[0].length,
            ],
          )
        : [],
    );

  return (
    <div>
      <label>
        search word
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </label>
      <div ref={ref}>
        {text.split("\n").map((l, i) => {
          if (!l)
            return (
              <div key={i}>
                <br />
              </div>
            );
          const segments: ReactElement[] = [];
          let prev = 0;
          for (const [start, end] of marks[i] ?? []) {
            segments.push(
              <span key={segments.length}>{l.slice(prev, start)}</span>,
            );
            segments.push(
              <mark key={segments.length}>{l.slice(start, end)}</mark>,
            );
            prev = end;
          }
          segments.push(<span key={segments.length}>{l.slice(prev)}</span>);
          return <div key={i}>{segments}</div>;
        })}
      </div>
    </div>
  );
};

const TokenizedEditor = ({ initialText }: { initialText: string }) => {
  const ref = useRef<HTMLPreElement>(null);
  const [text, setText] = useState(initialText);
  useEffect(() => {
    return createPlainEditor({ text, onChange: setText }).input(ref.current!);
  }, []);
  return (
    <pre ref={ref}>
      {text.split("\n").map((r, i) => (
        <div key={i}>
          {r ? (
            r.split(/(\W+)/).map((t, j) => <span key={j}>{t}</span>)
          ) : (
            <br />
          )}
        </div>
      ))}
    </pre>
  );
};

const CommandEditor = ({ initialText }: { initialText: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(initialText);
  const editor = useMemo(
    () => createPlainEditor({ text, onChange: setText }),
    [],
  );
  useEffect(() => {
    return editor.input(ref.current!);
  }, []);
  return (
    <div>
      <button
        onClick={() => {
          editor.exec(InsertText, "text");
        }}
      >
        insert
      </button>
      <button
        onClick={() => {
          editor.exec(Delete);
        }}
      >
        delete selection
      </button>
      <button
        onClick={() => {
          document.getSelection()?.modify("move", "forward", "character");
          ref.current?.focus();
        }}
      >
        move forward
      </button>
      <button
        onClick={() => {
          document.getSelection()?.modify("extend", "forward", "character");
          ref.current?.focus();
        }}
      >
        move focus forward
      </button>
      <div ref={ref}>
        {text.split("\n").map((t, i) => (
          <div key={i}>{t ? t : <br />}</div>
        ))}
      </div>
    </div>
  );
};

const ReadonlyEditor = ({
  initialText,
  ref: editorRef,
}: {
  initialText: string;
  ref: Ref<PlainEditor>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(initialText);
  const editor = useMemo(
    () => createPlainEditor({ text, singleline: true, onChange: setText }),
    [],
  );
  useImperativeHandle(editorRef, () => editor, []);
  useEffect(() => {
    return editor.input(ref.current!);
  }, []);
  return <div ref={ref}>{text ? text : <br />}</div>;
};

// An empty editable is rendered without <br> to show the placeholder with :empty selector
const PlaceholderEditor = ({ initialText }: { initialText: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(initialText);
  useEffect(() => {
    return createPlainEditor({
      text,
      singleline: true,
      onChange: setText,
    }).input(ref.current!);
  }, []);
  return (
    <>
      <div ref={ref} aria-placeholder="Enter some text...">
        {text}
      </div>
      <style>{`
[contenteditable]:empty:before {
  content: attr(aria-placeholder) / "";
  pointer-events: none;
  color: gray;
}
`}</style>
    </>
  );
};

const richSchema = v.strictObject({
  children: v.array(
    v.strictObject({
      align: v.optional(v.picklist(["left", "right"])),
      children: v.array(
        v.strictObject({
          text: v.string(),
          bold: v.optional(v.boolean()),
          italic: v.optional(v.boolean()),
        }),
      ),
    }),
  ),
});
type RichDoc = v.InferOutput<typeof richSchema>;

const RichTextEditor = ({ initialDoc }: { initialDoc: RichDoc }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState(initialDoc);
  const editor = useMemo(() => {
    const e = createEditor({ doc, schema: richSchema }).exec(
      plainTransferPlugin,
    );
    e.on("change", () => {
      setDoc(e.doc);
    });
    return e;
  }, []);
  useEffect(() => {
    return editor.input(ref.current!);
  }, []);
  return (
    <div>
      <button
        onClick={() => {
          editor.exec(ToggleFormat, "italic");
        }}
      >
        italic
      </button>
      <button
        onClick={() => {
          editor.exec(ToggleBlockAttr, "align", "right", undefined);
        }}
      >
        align
      </button>
      <div ref={ref}>
        {doc.children.map((b, i) => (
          <div key={i} style={{ textAlign: b.align }}>
            {b.children.map((n, j) => (
              <span
                key={j}
                style={{ fontStyle: n.italic ? "italic" : undefined }}
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

const tagSchema = v.strictObject({
  children: v.array(
    v.union([
      v.strictObject({ text: v.string() }),
      v.strictObject({
        type: v.literal("tag"),
        label: v.string(),
        value: v.string(),
      }),
    ]),
  ),
});
type TagDoc = v.InferOutput<typeof tagSchema>;

const CHARACTERS = ["Han Solo", "Luke Skywalker"];

// The text just before the caret, which the suggestion is derived from
const getQuery = (doc: TagDoc, caret: number): string => {
  const leaf = getLeafAt(doc, caret, true);
  return leaf && "text" in leaf[0] ? leaf[0].text.slice(0, leaf[1]) : "";
};

// The keymap handlers return false while the suggestion is closed, so the keys fall through
const ComboboxEditor = ({ initialDoc }: { initialDoc: TagDoc }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState(initialDoc);
  const [caret, setCaret] = useState(0);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(-1);

  const query = getQuery(doc, caret);

  const onPrev = useEffectEvent((): void | false => {
    if (!open) return false;
    setIndex((prev) => (prev <= 0 ? CHARACTERS.length - 1 : prev - 1));
    return;
  });
  const onNext = useEffectEvent((): void | false => {
    if (!open) return false;
    setIndex((prev) => (prev >= CHARACTERS.length - 1 ? 0 : prev + 1));
    return;
  });
  const onComplete = useEffectEvent((): void | false => {
    if (!open || index === -1) return false;
    const item = CHARACTERS[index]!;
    const start = caret - query.length;
    if (query) {
      editor.exec(Delete, [start, caret]);
    }
    editor.exec(InsertNode, { type: "tag", label: item, value: item }, start);
    setOpen(false);
    setIndex(-1);
    return;
  });

  const editor = useMemo(() => {
    const e = createEditor({ doc, schema: tagSchema })
      .exec(internalTransferPlugin)
      .exec(plainTransferPlugin, { voidToString: (node) => node.label })
      .exec(singlelinePlugin)
      .exec(keymapPlugin, {
        ArrowUp: onPrev,
        ArrowDown: onNext,
        Enter: onComplete,
      });
    e.on("change", () => {
      const at = Math.min(...e.selection);
      setDoc(e.doc);
      setCaret(at);
      setOpen(!!getQuery(e.doc, at).trim());
      setIndex(-1);
    });
    e.on("selectionchange", () => {
      setCaret(Math.min(...e.selection));
    });
    return e;
  }, []);
  useEffect(() => {
    return editor.input(ref.current!);
  }, []);

  return (
    <div ref={ref}>
      {doc.children.map((t, j) =>
        "text" in t ? (
          t.text || <br />
        ) : (
          <span key={j} contentEditable={false}>
            {t.label}
          </span>
        ),
      )}
    </div>
  );
};

const TagEditor = ({ initialDoc }: { initialDoc: TagDoc }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState(initialDoc);
  const editor = useMemo(() => {
    const e = createEditor({ doc, schema: tagSchema })
      .exec(internalTransferPlugin)
      .exec(plainTransferPlugin, { voidToString: (node) => node.label })
      .exec(singlelinePlugin);
    e.on("change", () => {
      setDoc(e.doc);
    });
    return e;
  }, []);
  useEffect(() => {
    return editor.input(ref.current!);
  }, []);
  return (
    <div ref={ref}>
      {doc.children.map((t, j) =>
        "text" in t ? (
          t.text || <br />
        ) : (
          <span key={j} contentEditable={false}>
            {t.label}
          </span>
        ),
      )}
    </div>
  );
};

const mediaSchema = v.strictObject({
  children: v.array(
    v.strictObject({
      children: v.array(
        v.union([
          v.strictObject({ text: v.string() }),
          v.strictObject({ type: v.literal("image"), src: v.string() }),
          v.strictObject({ type: v.literal("video"), src: v.string() }),
        ]),
      ),
    }),
  ),
});
type MediaDoc = v.InferOutput<typeof mediaSchema>;

// Not to depend on the network
const IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";
const VIDEO = "data:video/mp4,";

const MediaEditor = ({ initialDoc }: { initialDoc: MediaDoc }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState(initialDoc);
  const editor = useMemo(() => {
    const e = createEditor({ doc, schema: mediaSchema })
      .exec(internalTransferPlugin)
      .exec(plainTransferPlugin);
    e.on("change", () => {
      setDoc(e.doc);
    });
    return e;
  }, []);
  useEffect(() => {
    return editor.input(ref.current!);
  }, []);
  return (
    <div ref={ref}>
      {doc.children.map((b, i) => (
        <div key={i}>
          {b.children.map((t, j) =>
            "text" in t ? (
              t.text || <br />
            ) : t.type === "image" ? (
              <img key={j} src={t.src} />
            ) : (
              // safari needs contentEditable="false", and chromium doesn't delete a video without controls with Backspace
              <video
                key={j}
                src={t.src}
                controls
                contentEditable="false"
                suppressContentEditableWarning
              />
            ),
          )}
        </div>
      ))}
    </div>
  );
};

describe("common", () => {
  describe("feature detection", () => {
    it("newest", async () => {
      const container = render(
        <PlainEditor initialText={"Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒"} />,
      );

      // check if editor contents are rendered
      await expect.element(page.getByText("Hello world.")).toBeInTheDocument();
      // check if editable
      await getEditable(container);
    });

    it("beforeinput not implemented", async () => {
      const getTargetRanges = Object.getOwnPropertyDescriptor(
        InputEvent.prototype,
        "getTargetRanges",
      )!;
      Object.defineProperty(InputEvent.prototype, "getTargetRanges", {
        value: undefined,
        configurable: true,
      });
      onTestFinished(() => {
        Object.defineProperty(
          InputEvent.prototype,
          "getTargetRanges",
          getTargetRanges,
        );
      });

      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      onTestFinished(() => {
        warn.mockRestore();
      });
      const container = render(
        <PlainEditor initialText={"Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒"} />,
      );

      // check if editor contents are rendered
      await expect.element(page.getByText("Hello world.")).toBeInTheDocument();
      // check if not editable
      await vi.waitFor(() => {
        expect(warn).toHaveBeenCalledWith(
          "beforeinput event is not supported.",
        );
      });
      expect(container.querySelector('[contenteditable="true"]')).toBeNull();
    });
  });

  describe("type word", () => {
    describe("multiline", () => {
      it("on origin", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
        // Input
        await type("test");
        expect(getState(editable)).toBe(
          "test|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );
      });

      it("on 1st row", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // Move caret
        await press("ArrowRight");
        expect(getState(editable)).toBe("H|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
        // Input
        await type("test");
        expect(getState(editable)).toBe(
          "Htest|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );
      });

      it("on 2nd row", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // Move caret
        await press("ArrowRight");
        await press("ArrowDown");
        expect(getState(editable)).toBe("Hello world.\nこ|んにちは。\n👍❤️🧑‍🧑‍🧒");
        // Input
        await type("test");
        expect(getState(editable)).toBe(
          "Hello world.\nこtest|んにちは。\n👍❤️🧑‍🧑‍🧒",
        );
      });

      it.skipIf(browser !== "chromium")("with IME", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // insert with IME
        for (const t of ["s", "す", "すs", "すし", "寿司"]) {
          await compose(t);
        }
        await commit("寿司");
        expect(getState(editable)).toBe(
          "寿司|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );

        // cancel IME
        await compose("あ");
        await compose("");
        expect(getState(editable)).toBe(
          "寿司|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );

        // compose already inserted texts
        for (const t of ["", "鮨", "🍣"]) {
          await compose(t, [-2, 0]);
        }
        await commit("🍣");
        expect(getState(editable)).toBe(
          "🍣|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );
      });
    });

    describe("singleline", () => {
      it("on origin", async () => {
        const text = "Hello world.";
        const editable = await getEditable(
          render(<SinglelinePlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.");
        // Input
        await type("test");
        expect(getState(editable)).toBe("test|Hello world.");
      });

      it("on 1st row", async () => {
        const text = "Hello world.";
        const editable = await getEditable(
          render(<SinglelinePlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.");

        // Move caret
        await press("ArrowRight");
        expect(getState(editable)).toBe("H|ello world.");
        // Input
        await type("test");
        expect(getState(editable)).toBe("Htest|ello world.");
      });

      it.skipIf(browser !== "chromium")("with IME", async () => {
        const text = "Hello world.";
        const editable = await getEditable(
          render(<SinglelinePlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.");

        // insert with IME
        for (const t of ["s", "す", "すs", "すし", "寿司"]) {
          await compose(t);
        }
        await commit("寿司");
        expect(getState(editable)).toBe("寿司|Hello world.");

        // cancel IME
        await compose("あ");
        await compose("");
        expect(getState(editable)).toBe("寿司|Hello world.");

        // compose already inserted texts
        for (const t of ["", "鮨", "🍣"]) {
          await compose(t, [-2, 0]);
        }
        await commit("🍣");
        expect(getState(editable)).toBe("🍣|Hello world.");
      });
    });

    describe("span as block", () => {
      it("on origin", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<SpanAsBlockEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable, { blockTag: "span" })).toBe(
          "|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );
        // Input
        await type("test");
        expect(getState(editable, { blockTag: "span" })).toBe(
          "test|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );
      });

      it("on 1st row", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<SpanAsBlockEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable, { blockTag: "span" })).toBe(
          "|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );

        // Move caret
        await press("ArrowRight");
        expect(getState(editable, { blockTag: "span" })).toBe(
          "H|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );
        // Input
        await type("test");
        expect(getState(editable, { blockTag: "span" })).toBe(
          "Htest|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );
      });

      it("on 2nd row", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<SpanAsBlockEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable, { blockTag: "span" })).toBe(
          "|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );

        // Move caret
        await press("ArrowRight");
        await press("ArrowDown");
        expect(getState(editable, { blockTag: "span" })).toBe(
          "Hello world.\nこ|んにちは。\n👍❤️🧑‍🧑‍🧒",
        );
        // Input
        await type("test");
        expect(getState(editable, { blockTag: "span" })).toBe(
          "Hello world.\nこtest|んにちは。\n👍❤️🧑‍🧑‍🧒",
        );
      });
    });
  });

  describe("replace range", () => {
    it("replace chars", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );

      editable.focus();

      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // Move caret
      await press("ArrowRight");
      expect(getState(editable)).toBe("H|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      // Expand selection
      await loop(3, () => press("Shift+ArrowRight"));
      expect(getState(editable)).toBe("H^ell|o world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      // Input
      await type("a");
      expect(getState(editable)).toBe("Ha|o world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
    });

    it("replace linebreak", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );

      editable.focus();

      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      // Move caret
      await loop(1, () => press("ArrowRight"));
      expect(getState(editable)).toBe("H|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      // Expand selection
      await press("Shift+ArrowDown");
      expect(getState(editable)).toBe("H^ello world.\nこ|んにちは。\n👍❤️🧑‍🧑‍🧒");
      // Input
      await type("a");

      expect(getState(editable)).toBe("Ha|んにちは。\n👍❤️🧑‍🧑‍🧒");
    });

    it("replace all", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );

      editable.focus();

      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // Select All
      await press("Mod+A");
      expect(getState(editable)).toBe("^Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒|");
      // Input
      await type("a");

      expect(getState(editable)).toBe("a|");
    });

    it("replace all with linebreak", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );

      editable.focus();

      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // Select All
      await press("Mod+A");
      expect(getState(editable)).toBe("^Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒|");

      // Enter
      await press("Enter");
      expect(getState(editable)).toBe("\n|");
    });

    it("replace with the same text", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );

      editable.focus();

      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // Select text
      await press("ArrowRight");
      await press("Shift+ArrowRight");
      expect(getState(editable)).toBe("H^e|llo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // replace
      await type("e");

      expect(getState(editable)).toBe("H^e|llo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      // Selection is synchronized to DOM asynchronously
      await expect
        .poll(() => getState(editable))
        .toBe("He|llo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
    });
  });

  describe("Keydown", () => {
    describe("Arrow keys", () => {
      it("multiline", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        await press("ArrowRight");
        expect(getState(editable)).toBe("H|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        await press("ArrowDown");
        expect(getState(editable)).toBe("Hello world.\nこ|んにちは。\n👍❤️🧑‍🧑‍🧒");

        await press("ArrowLeft");
        expect(getState(editable)).toBe("Hello world.\n|こんにちは。\n👍❤️🧑‍🧑‍🧒");

        await press("ArrowUp");
        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      });

      it("singleline", async () => {
        const text = "Hello world.";
        const editable = await getEditable(
          render(<SinglelinePlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.");

        await press("ArrowRight");
        expect(getState(editable)).toBe("H|ello world.");

        await press("ArrowDown");
        expect(getState(editable)).toBe("Hello world.|");

        await press("ArrowLeft");
        expect(getState(editable)).toBe("Hello world|.");

        await press("ArrowUp");
        expect(getState(editable)).toBe("|Hello world.");
      });
    });

    describe("Enter", () => {
      it("split text", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        await loop(3, () => press("ArrowRight"));
        expect(getState(editable)).toBe("Hel|lo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // Split
        await press("Enter");
        expect(getState(editable)).toBe(
          "Hel\n|lo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );

        // Split again
        await press("Enter");
        expect(getState(editable)).toBe(
          "Hel\n\n|lo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );

        // Insert empty line
        await press("ArrowUp");
        await press("Enter");
        expect(getState(editable)).toBe(
          "Hel\n\n|\nlo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );

        // Remove empty line
        await press("Backspace");
        await press("ArrowDown");
        expect(getState(editable)).toBe(
          "Hel\n\n|lo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );

        // Join
        await press("Backspace");
        expect(getState(editable)).toBe(
          "Hel\n|lo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );

        // Join again
        await press("Backspace");
        expect(getState(editable)).toBe("Hel|lo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      });

      it("split span", async () => {
        const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        const editable = await getEditable(
          render(<HighlightEditor initialText={text} initialSearch="dolor" />),
        );

        editable.focus();

        expect(getState(editable)).toBe(
          "|Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        );

        await loop(14, () => press("ArrowRight"));
        expect(getState(editable)).toBe(
          "Lorem ipsum do|lor sit amet, consectetur adipiscing elit.",
        );

        // Split
        await press("Enter");
        expect(getState(editable)).toBe(
          "Lorem ipsum do\n|lor sit amet, consectetur adipiscing elit.",
        );

        // Split again
        await press("Enter");
        expect(getState(editable)).toBe(
          "Lorem ipsum do\n\n|lor sit amet, consectetur adipiscing elit.",
        );

        // Insert empty line
        await press("ArrowUp");
        await press("Enter");
        expect(getState(editable)).toBe(
          "Lorem ipsum do\n\n|\nlor sit amet, consectetur adipiscing elit.",
        );

        // Remove empty line
        await press("Backspace");
        await press("ArrowDown");
        expect(getState(editable)).toBe(
          "Lorem ipsum do\n\n|lor sit amet, consectetur adipiscing elit.",
        );

        // Join
        await press("Backspace");
        expect(getState(editable)).toBe(
          "Lorem ipsum do\n|lor sit amet, consectetur adipiscing elit.",
        );

        // Join again
        await press("Backspace");
        expect(getState(editable)).toBe(
          "Lorem ipsum do|lor sit amet, consectetur adipiscing elit.",
        );
      });

      it("handle empty spans", async () => {
        // The rows are split into spans, including empty ones at row edges
        const text = `import React, { useState } from "react";

function Example() {`;
        const editable = await getEditable(
          render(<TokenizedEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe(
          '|import React, { useState } from "react";\n\nfunction Example() {',
        );

        await loop(10, () => press("ArrowRight"));
        expect(getState(editable)).toBe(
          'import Rea|ct, { useState } from "react";\n\nfunction Example() {',
        );

        // Split
        await press("Enter");
        expect(getState(editable)).toBe(
          'import Rea\n|ct, { useState } from "react";\n\nfunction Example() {',
        );

        // Split again
        await press("Enter");
        expect(getState(editable)).toBe(
          'import Rea\n\n|ct, { useState } from "react";\n\nfunction Example() {',
        );

        // Insert empty line
        await press("ArrowUp");
        await press("Enter");
        expect(getState(editable)).toBe(
          'import Rea\n\n|\nct, { useState } from "react";\n\nfunction Example() {',
        );

        // Remove empty line
        await press("Backspace");
        await press("ArrowDown");
        expect(getState(editable)).toBe(
          'import Rea\n\n|ct, { useState } from "react";\n\nfunction Example() {',
        );

        // Join
        await press("Backspace");
        expect(getState(editable)).toBe(
          'import Rea\n|ct, { useState } from "react";\n\nfunction Example() {',
        );

        // Join again
        await press("Backspace");
        expect(getState(editable)).toBe(
          'import Rea|ct, { useState } from "react";\n\nfunction Example() {',
        );
      });

      it("split edge cases", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // Split at first
        await press("Enter");
        expect(getState(editable)).toBe(
          "\n|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );

        // Join
        await press("Backspace");
        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // Move to last
        const lastLineIndex = initialValue.length - 1;
        for (let i = 0; i <= lastLineIndex + 1; i++) {
          await press("ArrowDown");
        }
        expect(getState(editable)).toBe("Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒|");

        // Split at last
        await press("Enter");
        expect(getState(editable)).toBe(
          "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒\n|",
        );

        // Join
        await press("Backspace");
        expect(getState(editable)).toBe("Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒|");

        // Split at line start and delete selected text
        const editableRect = editable.getBoundingClientRect();
        const rowRect = editable.children[1]!.getBoundingClientRect();
        await dblClick(editable, {
          x: rowRect.left - editableRect.left + 4,
          y: rowRect.top - editableRect.top + rowRect.height / 2,
        });
        const selectedText = getText(editable, { selected: true });
        const expectedText = "こんにちは";
        expect(selectedText).toEqual([expectedText]);
        expect(getState(editable)).toBe("Hello world.\n^こんにちは|。\n👍❤️🧑‍🧑‍🧒");
        await press("Enter");
        expect(getState(editable)).toBe("Hello world.\n\n|。\n👍❤️🧑‍🧑‍🧒");
      });

      it("treat soft break as hard break", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        await loop(3, () => press("ArrowRight"));
        expect(getState(editable)).toBe("Hel|lo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // Soft break
        await press("Shift+Enter");
        expect(getState(editable)).toBe(
          "Hel\n|lo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );

        // Soft break again
        await press("Shift+Enter");
        expect(getState(editable)).toBe(
          "Hel\n\n|lo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );

        // Insert empty line
        await press("ArrowUp");
        await press("Enter");
        expect(getState(editable)).toBe(
          "Hel\n\n|\nlo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );

        // Remove empty line
        await press("Backspace");
        await press("ArrowDown");
        expect(getState(editable)).toBe(
          "Hel\n\n|lo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );

        // Remove soft break
        await press("Backspace");
        expect(getState(editable)).toBe(
          "Hel\n|lo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );

        // Remove soft break again
        await press("Backspace");
        expect(getState(editable)).toBe("Hel|lo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        await loop(9, () => press("ArrowRight"));
        expect(getState(editable)).toBe("Hello world.|\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // Soft break at EOL
        await press("Shift+Enter");
        expect(getState(editable)).toBe(
          "Hello world.\n|\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );

        // Remove soft break
        await press("Backspace");
        expect(getState(editable)).toBe("Hello world.|\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      });

      it("singleline", async () => {
        const text = "Hello world.";
        const editable = await getEditable(
          render(<SinglelinePlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.");

        await loop(2, () => press("ArrowRight"));
        expect(getState(editable)).toBe("He|llo world.");

        // Press enter
        await press("Enter");

        // NOP
        expect(getState(editable)).toBe("He|llo world.");
      });
    });

    describe("Backspace", () => {
      it("delete char", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // Move caret
        await loop(2, () => press("ArrowRight"));
        expect(getState(editable)).toBe("He|llo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // delete
        await press("Backspace");

        expect(getState(editable)).toBe("H|llo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      });

      it("delete chars", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // Move caret
        await press("ArrowRight");
        expect(getState(editable)).toBe("H|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
        // Expand selection
        await loop(3, () => press("Shift+ArrowRight"));
        expect(getState(editable)).toBe("H^ell|o world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // delete
        await press("Backspace");

        expect(getState(editable)).toBe("H|o world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      });

      it("delete linebreak", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
        // Move caret
        await loop(1, () => press("ArrowRight"));
        expect(getState(editable)).toBe("H|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
        // Expand selection
        await press("Shift+ArrowDown");
        expect(getState(editable)).toBe("H^ello world.\nこ|んにちは。\n👍❤️🧑‍🧑‍🧒");

        // delete
        await press("Backspace");

        expect(getState(editable)).toBe("H|んにちは。\n👍❤️🧑‍🧑‍🧒");
      });

      it("delete all", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // Select All
        await press("Mod+A");
        expect(getState(editable)).toBe("^Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒|");

        // delete
        await press("Backspace");

        expect(getState(editable)).toBe("|");
      });
    });

    describe("Delete", () => {
      it("delete char", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // Move caret
        await loop(2, () => press("ArrowRight"));
        expect(getState(editable)).toBe("He|llo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // delete
        await press("Delete");

        expect(getState(editable)).toBe("He|lo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      });

      it("delete chars", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // Move caret
        await press("ArrowRight");
        expect(getState(editable)).toBe("H|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
        // Expand selection
        await loop(3, () => press("Shift+ArrowRight"));
        expect(getState(editable)).toBe("H^ell|o world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // delete
        await press("Delete");

        expect(getState(editable)).toBe("H|o world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      });

      it("delete linebreak", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
        // Move caret
        await loop(1, () => press("ArrowRight"));
        expect(getState(editable)).toBe("H|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
        // Expand selection
        await press("Shift+ArrowDown");
        expect(getState(editable)).toBe("H^ello world.\nこ|んにちは。\n👍❤️🧑‍🧑‍🧒");

        // delete
        await press("Delete");

        expect(getState(editable)).toBe("H|んにちは。\n👍❤️🧑‍🧑‍🧒");
      });

      it("delete all", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // Select All
        await press("Mod+A");
        expect(getState(editable)).toBe("^Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒|");

        // delete
        await press("Delete");

        expect(getState(editable)).toBe("|");
      });
    });

    describe("User defined shortcuts", () => {
      it("combobox", async () => {
        // Arrow keys and Enter are taken over by the suggestion while it is open
        const editable = await getEditable(
          render(
            <ComboboxEditor
              initialDoc={{
                children: [
                  {
                    type: "tag",
                    label: "Luke Skywalker",
                    value: "Luke Skywalker",
                  },
                ],
              }}
            />,
          ),
        );

        editable.focus();

        expect(getState(editable)).toBe("|$");
        await type("a");

        // Enter(but no-op)
        await press("Enter");
        expect(getState(editable)).toBe("a|$");

        // Select item with Enter
        await press("ArrowDown");
        await press("Enter");
        // the query is consumed and the selected item is inserted as a node
        expect(getState(editable)).toBe("$|$");

        // Delete all
        await press("Mod+A");
        await press("Backspace");
        expect(getState(editable)).toBe("|");
        await type("e");

        // Select item with Enter
        await press("ArrowUp");
        await press("Enter");
        expect(getState(editable)).toBe("$|");
      });
    });
  });

  describe("Cut", () => {
    it("noop (collapsed selection)", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );

      editable.focus();

      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // Move caret
      await loop(2, () => press("ArrowRight"));
      expect(getState(editable)).toBe("He|llo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // The clipboard is shared in this file
      if (browser === "chromium") {
        await navigator.clipboard.writeText("");
      }

      // cut
      await press("Mod+X");

      expect(getState(editable)).toBe("He|llo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // https://github.com/microsoft/playwright/issues/13037#issuecomment-1078208810
      if (browser !== "chromium") return;
      expect(await readClipboard("text/plain")).toEqual(null);
      expect(await readClipboard("text/html")).toEqual(null);
    });

    it("cut chars", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );

      editable.focus();

      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // Move caret
      await press("ArrowRight");
      expect(getState(editable)).toBe("H|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      // Expand selection
      await loop(3, () => press("Shift+ArrowRight"));
      expect(getState(editable)).toBe("H^ell|o world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // cut
      await press("Mod+X");

      expect(getState(editable)).toBe("H|o world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // https://github.com/microsoft/playwright/issues/13037#issuecomment-1078208810
      if (browser !== "chromium") return;
      expect(await readClipboard("text/plain")).toEqual("ell");
      expect(await readClipboard("text/html")).toEqual(null);
    });

    it("cut linebreak", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );

      editable.focus();

      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      // Move caret
      await loop(1, () => press("ArrowRight"));
      expect(getState(editable)).toBe("H|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      // Expand selection
      await press("Shift+ArrowDown");
      expect(getState(editable)).toBe("H^ello world.\nこ|んにちは。\n👍❤️🧑‍🧑‍🧒");

      // cut
      await press("Mod+X");

      expect(getState(editable)).toBe("H|んにちは。\n👍❤️🧑‍🧑‍🧒");

      // https://github.com/microsoft/playwright/issues/13037#issuecomment-1078208810
      if (browser !== "chromium") return;
      expect(await readClipboard("text/plain")).toEqual("ello world.\nこ");
      expect(await readClipboard("text/html")).toEqual(null);
    });

    it("cut all", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );

      editable.focus();

      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // Select All
      await press("Mod+A");
      expect(getState(editable)).toBe("^Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒|");

      // cut
      await press("Mod+X");

      expect(getState(editable)).toBe("|");

      // https://github.com/microsoft/playwright/issues/13037#issuecomment-1078208810
      if (browser !== "chromium") return;
      expect(await readClipboard("text/plain")).toEqual(
        "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
      );
      expect(await readClipboard("text/html")).toEqual(null);
    });
  });

  // https://github.com/microsoft/playwright/issues/13037#issuecomment-1078208810
  describe.skipIf(browser !== "chromium")("Copy", () => {
    it("copy selected", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );

      editable.focus();

      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      await press("ArrowRight");
      await press("Shift+ArrowRight");
      await press("Shift+ArrowDown");
      await press("Mod+C");

      expect(await readClipboard("text/plain")).toEqual("ello world.\nこ");
      expect(await readClipboard("text/html")).toEqual(null);
    });

    it("copy all", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );

      editable.focus();

      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      // The clipboard is shared in this file
      await navigator.clipboard.writeText("");
      expect(await readClipboard("text/plain")).toEqual(null);
      expect(await readClipboard("text/html")).toEqual(null);

      await press("Mod+A");
      await press("Mod+C");

      expect(await readClipboard("text/plain")).toEqual(
        "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
      );
      expect(await readClipboard("text/html")).toEqual(null);
    });
  });

  // https://github.com/microsoft/playwright/issues/13037#issuecomment-1078208810
  describe.skipIf(browser !== "chromium")("Paste", () => {
    describe("multiline", () => {
      it("paste text", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // Move caret
        await loop(2, () => press("ArrowRight"));
        expect(getState(editable)).toBe("He|llo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // paste
        const pastedText = "Paste text.";
        await navigator.clipboard.writeText(pastedText);
        await press("Mod+V");
        expect(getState(editable)).toBe(
          "HePaste text.|llo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );
      });

      it("paste linebreak", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // Move caret
        await loop(2, () => press("ArrowRight"));
        expect(getState(editable)).toBe("He|llo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // paste
        const pastedText = "Paste \ntext.";
        await navigator.clipboard.writeText(pastedText);
        await press("Mod+V");
        expect(getState(editable)).toBe(
          "HePaste \ntext.|llo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒",
        );
      });
    });

    describe("singleline", () => {
      it("paste text", async () => {
        const text = "Hello world.";
        const editable = await getEditable(
          render(<SinglelinePlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.");

        // Move caret
        await loop(2, () => press("ArrowRight"));
        expect(getState(editable)).toBe("He|llo world.");

        // paste
        const pastedText = "Paste text.";
        await navigator.clipboard.writeText(pastedText);
        await press("Mod+V");
        expect(getState(editable)).toBe("HePaste text.|llo world.");
      });

      it("paste linebreak", async () => {
        const text = "Hello world.";
        const editable = await getEditable(
          render(<SinglelinePlainEditor initialText={text} />),
        );

        editable.focus();

        expect(getState(editable)).toBe("|Hello world.");

        // Move caret
        await loop(2, () => press("ArrowRight"));
        expect(getState(editable)).toBe("He|llo world.");

        // paste
        const pastedText = "Paste \ntext.";
        await navigator.clipboard.writeText(pastedText);
        await press("Mod+V");
        expect(getState(editable)).toBe("HePaste text.|llo world.");
      });
    });
  });

  describe("Drag and Drop", () => {
    const dragSelectionTo = async (
      editable: HTMLElement,
      { line = 0, char = 0 }: { line?: number; char?: number },
    ) => {
      const selectedTextLength = getText(editable, { selected: true }).join(
        "",
      ).length;
      const selected = getSelectedRect(editable);
      const x = selected.x + selected.width / 2;
      const y = selected.y + selected.height / 2;
      await commands.mouseDrag(
        [x, y],
        [
          x + char * (selected.width / selectedTextLength),
          y + selected.height * line,
        ],
      );
    };

    it("move chars", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );

      editable.focus();

      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      {
        // Select [0,1]-[0,4]
        await press("ArrowRight");
        const selLength = 3;
        await loop(selLength, () => press("Shift+ArrowRight"));
        expect(getState(editable)).toBe("H^ell|o world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // drop text to next line
        await dragSelectionTo(editable, { line: 1 });
        expect(getState(editable)).toBe("Ho world.\nこ^ell|んにちは。\n👍❤️🧑‍🧑‍🧒");
      }

      // reset
      await press("Mod+Z");
      await moveSelectionToOrigin(editable);
      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      {
        // Select [1,2]-[1,4]
        await press("ArrowDown");
        const selStart = 2;
        await loop(selStart, () => press("ArrowRight"));
        const selLength = 2;
        await loop(selLength, () => press("Shift+ArrowRight"));
        expect(getState(editable)).toBe("Hello world.\nこん^にち|は。\n👍❤️🧑‍🧑‍🧒");

        // drop text to swap
        await dragSelectionTo(editable, { char: -2 });
        expect(getState(editable)).toBe("Hello world.\nこ^にち|んは。\n👍❤️🧑‍🧑‍🧒");
      }

      // reset
      await press("Mod+Z");
      await moveSelectionToOrigin(editable);
      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      {
        // Select [1,1]-[1,3]
        await press("ArrowDown");
        const selStart = 1;
        await loop(selStart, () => press("ArrowRight"));
        const selLength = 2;
        await loop(selLength, () => press("Shift+ArrowRight"));
        expect(getState(editable)).toBe("Hello world.\nこ^んに|ちは。\n👍❤️🧑‍🧑‍🧒");

        // drop text to swap
        await dragSelectionTo(editable, { char: 2 });
        expect(getState(editable)).toBe("Hello world.\nこち^んに|は。\n👍❤️🧑‍🧑‍🧒");
      }
    });

    it.todo("drop external");
  });

  describe("undo and redo", () => {
    it("one char", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );

      editable.focus();

      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      await type("z");
      expect(getState(editable)).toBe("z|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // undo
      await press("Mod+Z");
      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // redo
      await press("Mod+Shift+Z");
      expect(getState(editable)).toBe("z|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
    });
  });

  describe("keep selection on render", () => {
    it("command", async () => {
      // Clicking a button moves focus out of the editable before the command runs
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<CommandEditor initialText={text} />),
      );

      editable.focus();

      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // Move caret
      await click("move forward");
      expect(getState(editable)).toBe("H|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // insert
      await click("insert");
      // the editor returns focus to the editable in the next animation frame
      await expect
        .poll(() => getState(editable))
        .toBe("Htext|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // undo
      // TODO undo with button
      await press("Mod+Z");
      expect(getState(editable)).toBe("H|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // delete
      await click("move focus forward");
      await click("delete selection");
      // the editor returns focus to the editable in the next animation frame
      await expect
        .poll(() => getState(editable))
        .toBe("H|llo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
    });

    it("type in input", async () => {
      const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
      const editor = createRef<PlainEditor>();
      const editable = await getEditable(
        render(
          <HighlightEditor
            initialText={text}
            initialSearch="dolor"
            ref={editor}
          />,
        ),
      );

      editable.focus();

      expect(getState(editable)).toBe(
        "|Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      );

      const searchInput = page
        .getByRole("textbox", { name: "search word" })
        .element() as HTMLInputElement;
      const searchValue = searchInput.value;
      searchInput.focus();

      // type on input
      const word = "hello";
      await type(word);
      expect(searchInput.value).toEqual(searchValue + word);

      // should keep selection on input
      expect(document.activeElement).toBe(searchInput);
      expect(editor.current!.selection).toEqual([0, 0]);
    });

    it("richtext", async () => {
      // Clicking a button moves focus out of the editable before the command runs
      const editable = await getEditable(
        render(
          <RichTextEditor
            initialDoc={{
              children: [
                {
                  children: [
                    { text: "Hello", bold: true },
                    { text: " " },
                    { text: "World", italic: true },
                    { text: "." },
                  ],
                },
                { children: [{ text: "こんにちは。" }] },
                { children: [{ text: "👍❤️🧑‍🧑‍🧒" }] },
              ],
            }}
          />,
        ),
      );
      const getRow = (i: number) => editable.children[i] as HTMLElement;
      const getItalicTexts = (row: HTMLElement) =>
        Array.from(row.children as HTMLCollectionOf<HTMLElement>)
          .filter((e) => e.style.fontStyle === "italic")
          .map((e) => e.textContent);
      expect(getRow(0).style.textAlign).toBe("");
      expect(getItalicTexts(getRow(1))).toEqual([]);

      editable.focus();

      expect(getState(editable)).toBe("|Hello World.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      {
        // Set block attr
        await click("align");
        // the editor returns focus to the editable in the next animation frame
        await expect
          .poll(() => getState(editable))
          .toBe("|Hello World.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
        expect(getRow(0).style.textAlign).toBe("right");

        // Select texts
        await press("Shift+ArrowRight");
        expect(getState(editable)).toBe("^H|ello World.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

        // Unset block attr
        await click("align");
        // the editor returns focus to the editable in the next animation frame
        await expect
          .poll(() => getState(editable))
          .toBe("^H|ello World.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
        expect(getRow(0).style.textAlign).toBe("");
      }

      {
        // Move caret
        await press("ArrowLeft");
        await press("ArrowDown");
        await press("ArrowRight");
        expect(getState(editable)).toBe("Hello World.\nこ|んにちは。\n👍❤️🧑‍🧑‍🧒");

        // Select texts
        await press("Shift+ArrowRight");
        await press("Shift+ArrowRight");
        expect(getState(editable)).toBe("Hello World.\nこ^んに|ちは。\n👍❤️🧑‍🧑‍🧒");

        // Set text format
        await click("italic");
        // the editor returns focus to the editable in the next animation frame
        await expect
          .poll(() => getState(editable))
          .toBe("Hello World.\nこ^んに|ちは。\n👍❤️🧑‍🧑‍🧒");
        expect(getItalicTexts(getRow(1))).toEqual(["んに"]);

        // Unset text format
        await click("italic");
        // the editor returns focus to the editable in the next animation frame
        await expect
          .poll(() => getState(editable))
          .toBe("Hello World.\nこ^んに|ちは。\n👍❤️🧑‍🧑‍🧒");
        expect(getItalicTexts(getRow(1))).toEqual([]);
      }
    });
  });

  describe("rtl", () => {
    it("edit", async () => {
      const text = `היום התחלתי לכתוב מסמך חדש בעורך הזה.
עורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.
המסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.`;
      const editable = await getEditable(
        render(<PlainEditor initialText={text} style={{ direction: "rtl" }} />),
      );

      editable.focus();

      expect(getState(editable)).toBe(
        "|היום התחלתי לכתוב מסמך חדש בעורך הזה.\nעורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.\nהמסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.",
      );

      {
        // Move caret. ArrowLeft runs forward through the model here, ArrowRight back
        const len = 4;
        await loop(len, () => press("ArrowLeft"));
        expect(getState(editable)).toBe(
          "היום| התחלתי לכתוב מסמך חדש בעורך הזה.\nעורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.\nהמסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.",
        );

        await loop(len, () => press("ArrowRight"));
        expect(getState(editable)).toBe(
          "|היום התחלתי לכתוב מסמך חדש בעורך הזה.\nעורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.\nהמסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.",
        );
      }
      await loop(3, () => press("ArrowLeft"));
      expect(getState(editable)).toBe(
        "היו|ם התחלתי לכתוב מסמך חדש בעורך הזה.\nעורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.\nהמסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.",
      );

      // Delete. the character before the caret in the model sits to its visual right
      await press("Backspace");
      expect(getState(editable)).toBe(
        "הי|ם התחלתי לכתוב מסמך חדש בעורך הזה.\nעורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.\nהמסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.",
      );

      await press("Delete");
      expect(getState(editable)).toBe(
        "הי| התחלתי לכתוב מסמך חדש בעורך הזה.\nעורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.\nהמסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.",
      );

      {
        // Insert. latin into hebrew, so the caret ends past an opposite-direction run
        const word = "test";
        await type(word);
        expect(getState(editable)).toBe(
          "היtest| התחלתי לכתוב מסמך חדש בעורך הזה.\nעורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.\nהמסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.",
        );
      }
    });

    it("selection direction", async () => {
      const text = `היום התחלתי לכתוב מסמך חדש בעורך הזה.
עורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.
המסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.`;
      const editable = await getEditable(
        render(<PlainEditor initialText={text} style={{ direction: "rtl" }} />),
      );

      editable.focus();

      expect(getState(editable)).toBe(
        "|היום התחלתי לכתוב מסמך חדש בעורך הזה.\nעורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.\nהמסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.",
      );

      const at = 6;
      await loop(at, () => press("ArrowLeft"));
      expect(getState(editable)).toBe(
        "היום ה|תחלתי לכתוב מסמך חדש בעורך הזה.\nעורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.\nהמסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.",
      );

      // chromium and webkit extend visually, firefox logically
      await press("Shift+ArrowRight");
      const [, probed] = getSelection(editable);
      const back = probed < at ? "Shift+ArrowRight" : "Shift+ArrowLeft";
      const forth = probed < at ? "Shift+ArrowLeft" : "Shift+ArrowRight";
      await press("Shift+ArrowLeft");
      expect(getState(editable)).toBe(
        "היום ה|תחלתי לכתוב מסמך חדש בעורך הזה.\nעורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.\nהמסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.",
      );

      // the anchor stays put, and a focus behind it is reported backward
      await loop(3, () => press(back));
      expect(getState(editable)).toBe(
        "היו|ם ה^תחלתי לכתוב מסמך חדש בעורך הזה.\nעורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.\nהמסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.",
      );

      await loop(3, () => press(forth));
      expect(getState(editable)).toBe(
        "היום ה|תחלתי לכתוב מסמך חדש בעורך הזה.\nעורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.\nהמסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.",
      );

      await loop(3, () => press(forth));
      expect(getState(editable)).toBe(
        "היום ה^תחל|תי לכתוב מסמך חדש בעורך הזה.\nעורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.\nהמסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.",
      );
    });

    // a hebrew letter carrying niqqud is one caret stop spanning several units
    it("combining marks", async () => {
      const text = `היום התחלתי לכתוב מסמך חדש בעורך הזה.
עורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.
המסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.`;
      const editable = await getEditable(
        render(<PlainEditor initialText={text} style={{ direction: "rtl" }} />),
      );

      editable.focus();

      expect(getState(editable)).toBe(
        "|היום התחלתי לכתוב מסמך חדש בעורך הזה.\nעורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.\nהמסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.",
      );

      await loop(2, () => press("ArrowDown"));
      expect(getState(editable)).toBe(
        "היום התחלתי לכתוב מסמך חדש בעורך הזה.\nעורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.\n|המסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.",
      );
      await loop(37, () => press("ArrowLeft"));
      expect(getState(editable)).toBe(
        "היום התחלתי לכתוב מסמך חדש בעורך הזה.\nעורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.\nהמסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁ|לוֹם.",
      );
      // insert
      await type("a");
      expect(getState(editable)).toBe(
        "היום התחלתי לכתוב מסמך חדש בעורך הזה.\nעורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.\nהמסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁa|לוֹם.",
      );
      // delete
      await press("Backspace");
      expect(getState(editable)).toBe(
        "היום התחלתי לכתוב מסמך חדש בעורך הזה.\nעורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.\nהמסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁ|לוֹם.",
      );
    });
  });

  describe("emoji", () => {
    it("surrogate pair", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );

      editable.focus();

      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // move to after emoji
      await loop(1, () => press("ArrowRight"));
      expect(getState(editable)).toBe("H|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      // insert
      await type("a");
      expect(getState(editable)).toBe("Ha|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      // delete
      await press("Backspace");
      expect(getState(editable)).toBe("H|ello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
    });

    it("variation selector", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );

      editable.focus();

      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // move to after emoji
      await loop(2, () => press("ArrowRight"));
      expect(getState(editable)).toBe("He|llo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      // insert
      await type("a");
      expect(getState(editable)).toBe("Hea|llo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      // delete
      await press("Backspace");
      expect(getState(editable)).toBe("He|llo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
    });

    it("zero width joiner", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );

      editable.focus();

      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // move to after emoji
      await loop(3, () => press("ArrowRight"));
      expect(getState(editable)).toBe("Hel|lo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      // insert
      await type("a");
      expect(getState(editable)).toBe("Hela|lo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
      // delete
      await press("Backspace");
      expect(getState(editable)).toBe("Hel|lo world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
    });
  });

  it("readonly", async () => {
    const editor = createRef<PlainEditor>();
    const editable = await getEditable(
      render(<ReadonlyEditor initialText={"Hello world."} ref={editor} />),
    );

    const isReadonly = () => editable.contentEditable;

    expect(isReadonly()).toEqual("true");

    // Enable readonly mode
    editor.current!.readonly = true;
    // the readonly event is published in a microtask
    await microtask();

    expect(isReadonly()).toEqual("false");

    // Disable readonly mode
    editor.current!.readonly = false;
    // the readonly event is published in a microtask
    await microtask();

    expect(isReadonly()).toEqual("true");
  });

  it("placeholder", async () => {
    const editable = await getEditable(
      render(<PlaceholderEditor initialText={""} />),
    );
    // The resolved content differs between browsers, but it's "none" in all of them if not rendered
    const isPlaceholderShown = () =>
      getComputedStyle(editable, "::before").content !== "none";

    editable.focus();

    expect(getState(editable)).toBe("|");
    expect(isPlaceholderShown()).toBe(true);

    // Input
    await type("a");

    expect(getState(editable)).toBe("a|");
    expect(isPlaceholderShown()).toBe(false);

    await press("Backspace");
    expect(getState(editable)).toBe("|");
    expect(isPlaceholderShown()).toBe(true);
  });

  describe("keep state on render", () => {
    it("sync", async () => {
      const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
      const editable = await getEditable(
        render(<HighlightEditor initialText={text} initialSearch="dolor" />),
      );
      const initialValue = [text];

      editable.focus();

      expect(getState(editable)).toBe(
        "|Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      );

      const searchInput = page
        .getByRole("textbox", { name: "search word" })
        .element() as HTMLInputElement;
      const searchValue = searchInput.value;
      const searchValueLength = searchValue.length;
      expect(searchValueLength).toBeGreaterThan(1);

      const markedOffset = initialValue[0]!.indexOf(searchValue);

      // type just before node
      await loop(markedOffset, () => press("ArrowRight"));
      expect(getState(editable)).toBe(
        "Lorem ipsum |dolor sit amet, consectetur adipiscing elit.",
      );

      // insert
      await type("a");
      expect(getState(editable)).toBe(
        "Lorem ipsum a|dolor sit amet, consectetur adipiscing elit.",
      );

      // delete
      await press("Backspace");
      expect(getState(editable)).toBe(
        "Lorem ipsum |dolor sit amet, consectetur adipiscing elit.",
      );

      // type on node
      await press("ArrowRight");
      expect(getState(editable)).toBe(
        "Lorem ipsum d|olor sit amet, consectetur adipiscing elit.",
      );

      // insert
      await type("a");
      expect(getState(editable)).toBe(
        "Lorem ipsum da|olor sit amet, consectetur adipiscing elit.",
      );

      // delete
      await press("Backspace");
      expect(getState(editable)).toBe(
        "Lorem ipsum d|olor sit amet, consectetur adipiscing elit.",
      );

      // type just after node
      await loop(searchValueLength - 1, () => press("ArrowRight"));
      expect(getState(editable)).toBe(
        "Lorem ipsum dolor| sit amet, consectetur adipiscing elit.",
      );

      // insert
      await type("a");
      expect(getState(editable)).toBe(
        "Lorem ipsum dolora| sit amet, consectetur adipiscing elit.",
      );

      // delete
      await press("Backspace");
      expect(getState(editable)).toBe(
        "Lorem ipsum dolor| sit amet, consectetur adipiscing elit.",
      );
    });

    it("async", async () => {
      // The marks are re-rendered in a later task than the edit, like a linter does
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<HighlightEditor initialText={text} initialSearch="o" async />),
      );

      editable.focus();

      expect(getState(editable)).toBe("|Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      const markedOffset = await vi.waitFor(() => {
        const marks = editable.querySelectorAll("mark");
        if (marks.length < 2) throw new Error("marks are not rendered");
        const secondMark = marks[1]!;
        if (
          editable.firstChild !== secondMark.parentNode ||
          secondMark.textContent!.length !== 1
        )
          throw new Error("unexpected mark");
        let offset = 0;
        let n: Node = secondMark;
        while ((n = n.previousSibling!)) {
          offset += n.textContent!.length;
        }
        return offset;
      });

      // type just before node
      await loop(markedOffset, () => press("ArrowRight"));
      expect(getState(editable)).toBe("Hello w|orld.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // insert
      await type("a");
      expect(getState(editable)).toBe("Hello wa|orld.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // delete
      await press("Backspace");
      expect(getState(editable)).toBe("Hello w|orld.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // type just after node
      await press("ArrowRight");
      expect(getState(editable)).toBe("Hello wo|rld.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // insert
      await type("a");
      expect(getState(editable)).toBe("Hello woa|rld.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");

      // delete
      await press("Backspace");
      expect(getState(editable)).toBe("Hello wo|rld.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
    });
  });
});

describe("structured", () => {
  describe("smoke node", () => {
    it("contenteditable: false", async () => {
      const editable = await getEditable(
        render(
          <TagEditor
            initialDoc={{
              children: [
                { text: "Hello " },
                { type: "tag", label: "Apple", value: "1" },
                { text: " world " },
                { type: "tag", label: "Orange", value: "2" },
              ],
            }}
          />,
        ),
      );
      const initialValue = ["Hello $ world $"];

      editable.focus();

      expect(getState(editable)).toBe("|Hello $ world $");

      const nodeOffset = initialValue[0]!.indexOf(NON_EDITABLE_PLACEHOLDER);

      // type just before node
      await loop(nodeOffset, () => press("ArrowRight"));
      expect(getState(editable)).toBe("Hello |$ world $");

      // insert
      await type("a");
      expect(getState(editable)).toBe("Hello a|$ world $");

      // delete
      await press("Backspace");
      expect(getState(editable)).toBe("Hello |$ world $");

      // type just after node
      await press("ArrowRight");
      expect(getState(editable)).toBe("Hello $| world $");

      // insert
      await type("a");
      expect(getState(editable)).toBe("Hello $a| world $");

      // delete
      await press("Backspace");
      expect(getState(editable)).toBe("Hello $| world $");

      // delete custom node
      await press("Backspace");
      expect(getState(editable)).toBe("Hello | world $");

      // undo
      await press("Mod+Z");
      await moveSelectionToOrigin(editable);
      expect(getState(editable)).toBe("|Hello $ world $");

      // delete selected custom node and texts
      await loop(nodeOffset - 1, () => press("ArrowRight"));
      await press("Shift+ArrowRight");
      await press("Shift+ArrowRight");
      await press("Shift+ArrowRight");
      await press("Backspace");
      expect(getState(editable)).toBe("Hello|world $");

      // undo
      await press("Mod+Z");
      await moveSelectionToOrigin(editable);
      expect(getState(editable)).toBe("|Hello $ world $");
      // replace selected custom node
      await loop(nodeOffset, () => press("ArrowRight"));
      await press("Shift+ArrowRight");
      await type("Z");
      expect(getState(editable)).toBe("Hello Z| world $");
    });

    it("img", async () => {
      const editable = await getEditable(
        render(
          <MediaEditor
            initialDoc={{
              children: [
                {
                  children: [
                    { text: "Hello " },
                    {
                      type: "image",
                      src: IMAGE,
                    },
                    { text: " world " },
                    {
                      type: "image",
                      src: IMAGE,
                    },
                  ],
                },
                {
                  children: [
                    { text: "Hello " },
                    {
                      type: "video",
                      src: VIDEO,
                    },
                    { text: " world " },
                  ],
                },
              ],
            }}
          />,
        ),
      );
      const initialValue = ["Hello $ world $", "Hello $ world "];

      editable.focus();

      expect(getState(editable)).toBe("|Hello $ world $\nHello $ world ");

      const nodeOffset = initialValue[0]!.indexOf(NON_EDITABLE_PLACEHOLDER);

      // type just before node
      await loop(nodeOffset, () => press("ArrowRight"));
      expect(getState(editable)).toBe("Hello |$ world $\nHello $ world ");

      // insert
      await type("a");
      expect(getState(editable)).toBe("Hello a|$ world $\nHello $ world ");

      // delete
      await press("Backspace");
      expect(getState(editable)).toBe("Hello |$ world $\nHello $ world ");

      // type just after node
      await press("ArrowRight");
      expect(getState(editable)).toBe("Hello $| world $\nHello $ world ");

      // insert
      await type("a");
      expect(getState(editable)).toBe("Hello $a| world $\nHello $ world ");

      // delete
      await press("Backspace");
      expect(getState(editable)).toBe("Hello $| world $\nHello $ world ");

      // delete custom node
      await press("Backspace");
      expect(getState(editable)).toBe("Hello | world $\nHello $ world ");

      // undo
      await press("Mod+Z");
      await moveSelectionToOrigin(editable);
      expect(getState(editable)).toBe("|Hello $ world $\nHello $ world ");

      // delete selected custom node and texts
      await loop(nodeOffset - 1, () => press("ArrowRight"));
      await press("Shift+ArrowRight");
      await press("Shift+ArrowRight");
      await press("Shift+ArrowRight");
      await press("Backspace");
      expect(getState(editable)).toBe("Hello|world $\nHello $ world ");

      // undo
      await press("Mod+Z");
      await moveSelectionToOrigin(editable);
      expect(getState(editable)).toBe("|Hello $ world $\nHello $ world ");
      // replace selected custom node
      await loop(nodeOffset, () => press("ArrowRight"));
      await press("Shift+ArrowRight");
      await type("Z");
      expect(getState(editable)).toBe("Hello Z| world $\nHello $ world ");
    });

    it("video", async () => {
      const editable = await getEditable(
        render(
          <MediaEditor
            initialDoc={{
              children: [
                {
                  children: [
                    { text: "Hello " },
                    {
                      type: "image",
                      src: IMAGE,
                    },
                    { text: " world " },
                    {
                      type: "image",
                      src: IMAGE,
                    },
                  ],
                },
                {
                  children: [
                    { text: "Hello " },
                    {
                      type: "video",
                      src: VIDEO,
                    },
                    { text: " world " },
                  ],
                },
              ],
            }}
          />,
        ),
      );
      const initialValue = ["Hello $ world $", "Hello $ world "];

      editable.focus();

      expect(getState(editable)).toBe("|Hello $ world $\nHello $ world ");

      const offsetAtLine = initialValue[1]!.indexOf(NON_EDITABLE_PLACEHOLDER);
      const nodeOffset = initialValue[0]!.length + 1 + offsetAtLine;

      // type just before node
      await loop(nodeOffset, () => press("ArrowRight"));
      expect(getState(editable)).toBe("Hello $ world $\nHello |$ world ");

      // insert
      await type("a");
      expect(getState(editable)).toBe("Hello $ world $\nHello a|$ world ");

      // delete
      await press("Backspace");
      expect(getState(editable)).toBe("Hello $ world $\nHello |$ world ");

      // type just after node
      await press("ArrowRight");
      expect(getState(editable)).toBe("Hello $ world $\nHello $| world ");

      // insert
      await type("a");
      expect(getState(editable)).toBe("Hello $ world $\nHello $a| world ");

      // delete
      await press("Backspace");
      expect(getState(editable)).toBe("Hello $ world $\nHello $| world ");

      // delete custom node
      await press("Backspace");
      expect(getState(editable)).toBe("Hello $ world $\nHello | world ");
    });
  });
});
