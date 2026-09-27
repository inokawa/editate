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
  takeSelectionSnapshot,
  TOKEN_BLOCK,
  TOKEN_SOFT_BREAK,
  TOKEN_TEXT,
  TOKEN_VOID,
} from "./dom/index.js";
import type { TokenType } from "./dom/parser.js";
import type { DomPosition } from "./doc/types.js";

declare module "vitest/browser" {
  interface BrowserCommands {
    press: (key: string) => Promise<void>;
    mouseDrag: (
      from: [x: number, y: number],
      to: [x: number, y: number],
    ) => Promise<void>;
  }
}

// selectionchange is dispatched in a queued task
const tick = () => new Promise((resolve) => setTimeout(resolve));

// editor events are published in a microtask
const microtask = () => Promise.resolve();

const press = async (key: string) => {
  await commands.press(key);
  await tick();
};

const type = async (text: string) => {
  for (const t of text.split("")) {
    await press(t);
  }
};

const loop = async (count: number, fn: () => Promise<void>) => {
  for (let i = 1; i <= count; i++) {
    await fn();
  }
};

const grapheme = (str: string): string[] => {
  return [
    ...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(str),
  ].map((s) => s.segment);
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

  const tranformPos = ([path, offset]: DomPosition): number => {
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
  return [tranformPos(selection[0]), tranformPos(selection[1])];
};

const getSelectedRect = (element: HTMLElement): DOMRect => {
  const selection = element.ownerDocument.getSelection()!;
  return selection.getRangeAt(0)!.getBoundingClientRect();
};

const moveSelectionToOrigin = (element: HTMLElement) => {
  const selection = element.ownerDocument.getSelection()!;
  selection.setBaseAndExtent(element, 0, element, 0);
};

const deleteAt = (
  value: readonly string[],
  length: number,
  [line, offset]: readonly [line: number, offset: number],
): string[] => {
  return value.map((r, i) =>
    i === line ? r.slice(0, offset) + r.slice(offset + length) : r,
  );
};

const insertAt = (
  value: readonly string[],
  text: string,
  [line, offset]: readonly [line: number, offset: number],
): string[] => {
  return value.map((r, i) =>
    i === line ? r.slice(0, offset) + text + r.slice(offset) : r,
  );
};

const replaceAt = (
  value: readonly string[],
  insertedText: string,
  deleteLength: number,
  pos: readonly [line: number, offset: number],
): string[] => {
  return insertAt(deleteAt(value, deleteLength, pos), insertedText, pos);
};

const insertLineBreakAt = (
  value: readonly string[],
  [line, offset]: readonly [line: number, offset: number],
): string[] => {
  return value.flatMap((r, i) => {
    if (i === line) {
      return [r.slice(0, offset), r.slice(offset)];
    }
    return r;
  });
};

const sumLines = (value: readonly string[], line: number): number => {
  let offset = 0;
  for (let i = 0; i <= line; i++) {
    offset += value[i]!.length;
    if (i !== value.length - 1) {
      offset++;
    }
  }
  return offset;
};

const browser = server.browser;

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

// Rows are split into spans around a search word, which is edited with an input outside the editable
const HighlightEditor = ({
  initialText,
  initialSearch,
}: {
  initialText: string;
  initialSearch: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(initialText);
  const [searchText, setSearchText] = useState(initialSearch);
  useEffect(() => {
    return createPlainEditor({ text, onChange: setText }).input(ref.current!);
  }, []);
  const reg = searchText ? new RegExp(`(${searchText})`) : null;
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
        {text.split("\n").map((r, i) => (
          <div key={i}>
            {r ? (
              (reg ? r.split(reg) : [r]).map((t, j) =>
                t === searchText ? (
                  <mark key={j}>{t}</mark>
                ) : (
                  <span key={j}>{t}</span>
                ),
              )
            ) : (
              <br />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Marks are computed from the text asynchronously like a linter, so they are rendered in a later task than the edit
const AsyncMarkEditor = ({ initialText }: { initialText: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(initialText);
  useEffect(() => {
    return createPlainEditor({ text, onChange: setText }).input(ref.current!);
  }, []);

  const [marks, setMarks] = useState<[line: number, offset: number][]>([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMarks(
        text
          .split("\n")
          .flatMap((l, line) =>
            [...l.matchAll(/o/g)].map((m): [number, number] => [line, m.index]),
          ),
      );
    });
    return () => {
      clearTimeout(timer);
    };
  }, [text]);

  return (
    <div ref={ref}>
      {text.split("\n").map((l, i) => {
        const texts: (ReactElement | string)[] = [];
        let prevEnd = 0;
        for (const [line, offset] of marks) {
          if (line !== i) continue;
          texts.push(l.slice(prevEnd, offset));
          texts.push(
            <span key={offset} data-mark>
              {l.slice(offset, offset + 1)}
            </span>,
          );
          prevEnd = offset + 1;
        }
        texts.push(l.slice(prevEnd));
        return <div key={i}>{l ? texts : <br />}</div>;
      })}
    </div>
  );
};

// Rows are split into spans like a syntax highlighter, including empty ones at row edges
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

// Commands are executed with clicks, which move focus out of the editable
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

type PlainEditor = ReturnType<typeof createPlainEditor>;

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

// Commands are executed with clicks, which move focus out of the editable
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

// Arrow keys and Enter are taken over by the suggestion while it is open
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
        const initialValue = text.split("\n");
        expect(getText(editable)).toEqual(initialValue);

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        // Input
        const word = "test";
        await type(word);
        expect(getText(editable)).toEqual(insertAt(initialValue, word, [0, 0]));
        const textLength = word.length;
        expect(getSelection(editable)).toEqual([textLength, textLength]);
      });

      it("on 1st row", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        // Move caret
        await press("ArrowRight");
        expect(getSelection(editable)).toEqual([1, 1]);

        // Input
        const word = "test";
        await type(word);
        expect(getText(editable)).toEqual(insertAt(initialValue, word, [0, 1]));
        const textLength = word.length;
        expect(getSelection(editable)).toEqual([
          1 + textLength,
          1 + textLength,
        ]);
      });

      it("on 2nd row", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        // Move caret
        await press("ArrowRight");
        await press("ArrowDown");
        expect(getSelection(editable)).toEqual([
          sumLines(initialValue, 0) + 1,
          sumLines(initialValue, 0) + 1,
        ]);

        // Input
        const word = "test";
        await type(word);
        expect(getText(editable)).toEqual(insertAt(initialValue, word, [1, 1]));
        const textLength = word.length;
        expect(getSelection(editable)).toEqual([
          sumLines(initialValue, 0) + 1 + textLength,
          sumLines(initialValue, 0) + 1 + textLength,
        ]);
      });

      it.skipIf(browser !== "chromium")("with IME", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        const client = cdp();

        // insert with IME
        for (const t of ["s", "す", "すs", "すし", "寿司"]) {
          await client.send("Input.imeSetComposition", {
            selectionStart: 0,
            selectionEnd: 0,
            text: t,
          });
        }
        await client.send("Input.insertText", { text: "寿司" });
        await tick();
        const value2 = insertAt(initialValue, "寿司", [0, 0]);
        const selection2 = ["寿司".length, "寿司".length];
        expect(getText(editable)).toEqual(value2);
        expect(getSelection(editable)).toEqual(selection2);

        // cancel IME
        await client.send("Input.imeSetComposition", {
          selectionStart: 0,
          selectionEnd: 0,
          text: "あ",
        });
        await client.send("Input.imeSetComposition", {
          selectionStart: 0,
          selectionEnd: 0,
          text: "",
        });
        await tick();
        expect(getText(editable)).toEqual(value2);

        // compose already inserted texts
        for (const t of ["", "鮨", "🍣"]) {
          await client.send("Input.imeSetComposition", {
            selectionStart: -2,
            selectionEnd: 0,
            text: t,
          });
        }
        await client.send("Input.insertText", { text: "🍣" });
        await tick();
        expect(getText(editable)).toEqual(insertAt(initialValue, "🍣", [0, 0]));
        expect(getSelection(editable)).toEqual(["🍣".length, "🍣".length]);
      });
    });

    describe("singleline", () => {
      it("on origin", async () => {
        const text = "Hello world.";
        const editable = await getEditable(
          render(<SinglelinePlainEditor initialText={text} />),
        );
        const initialValue = [text];
        expect(getText(editable)).toEqual(initialValue);

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        // Input
        const word = "test";
        await type(word);
        expect(getText(editable)).toEqual(insertAt(initialValue, word, [0, 0]));
        const textLength = word.length;
        expect(getSelection(editable)).toEqual([textLength, textLength]);
      });

      it("on 1st row", async () => {
        const text = "Hello world.";
        const editable = await getEditable(
          render(<SinglelinePlainEditor initialText={text} />),
        );
        const initialValue = [text];

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        // Move caret
        await press("ArrowRight");
        expect(getSelection(editable)).toEqual([1, 1]);

        // Input
        const word = "test";
        await type(word);
        expect(getText(editable)).toEqual(insertAt(initialValue, word, [0, 1]));
        const textLength = word.length;
        expect(getSelection(editable)).toEqual([
          1 + textLength,
          1 + textLength,
        ]);
      });

      it.skipIf(browser !== "chromium")("with IME", async () => {
        const text = "Hello world.";
        const editable = await getEditable(
          render(<SinglelinePlainEditor initialText={text} />),
        );
        const initialValue = [text];

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        const client = cdp();

        // insert with IME
        for (const t of ["s", "す", "すs", "すし", "寿司"]) {
          await client.send("Input.imeSetComposition", {
            selectionStart: 0,
            selectionEnd: 0,
            text: t,
          });
        }
        await client.send("Input.insertText", { text: "寿司" });
        await tick();
        const value2 = insertAt(initialValue, "寿司", [0, 0]);
        const selection2 = ["寿司".length, "寿司".length];
        expect(getText(editable)).toEqual(value2);
        expect(getSelection(editable)).toEqual(selection2);

        // cancel IME
        await client.send("Input.imeSetComposition", {
          selectionStart: 0,
          selectionEnd: 0,
          text: "あ",
        });
        await client.send("Input.imeSetComposition", {
          selectionStart: 0,
          selectionEnd: 0,
          text: "",
        });
        await tick();
        expect(getText(editable)).toEqual(value2);

        // compose already inserted texts
        for (const t of ["", "鮨", "🍣"]) {
          await client.send("Input.imeSetComposition", {
            selectionStart: -2,
            selectionEnd: 0,
            text: t,
          });
        }
        await client.send("Input.insertText", { text: "🍣" });
        await tick();
        expect(getText(editable)).toEqual(insertAt(initialValue, "🍣", [0, 0]));
        expect(getSelection(editable)).toEqual(["🍣".length, "🍣".length]);
      });
    });

    describe("span as block", () => {
      it("on origin", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<SpanAsBlockEditor initialText={text} />),
        );
        const initialValue = text.split("\n");
        expect(getText(editable, { blockTag: "span" })).toEqual(initialValue);

        editable.focus();

        expect(getSelection(editable, { blockTag: "span" })).toEqual([0, 0]);

        // Input
        const word = "test";
        await type(word);
        expect(getText(editable, { blockTag: "span" })).toEqual(
          insertAt(initialValue, word, [0, 0]),
        );
        const textLength = word.length;
        expect(getSelection(editable, { blockTag: "span" })).toEqual([
          textLength,
          textLength,
        ]);
      });

      it("on 1st row", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<SpanAsBlockEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable, { blockTag: "span" })).toEqual([0, 0]);

        // Move caret
        await press("ArrowRight");
        expect(getSelection(editable, { blockTag: "span" })).toEqual([1, 1]);

        // Input
        const word = "test";
        await type(word);
        expect(getText(editable, { blockTag: "span" })).toEqual(
          insertAt(initialValue, word, [0, 1]),
        );
        const textLength = word.length;
        expect(getSelection(editable, { blockTag: "span" })).toEqual([
          1 + textLength,
          1 + textLength,
        ]);
      });

      it("on 2nd row", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<SpanAsBlockEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable, { blockTag: "span" })).toEqual([0, 0]);

        // Move caret
        await press("ArrowRight");
        await press("ArrowDown");
        expect(getSelection(editable, { blockTag: "span" })).toEqual([
          sumLines(initialValue, 0) + 1,
          sumLines(initialValue, 0) + 1,
        ]);

        // Input
        const word = "test";
        await type(word);
        expect(getText(editable, { blockTag: "span" })).toEqual(
          insertAt(initialValue, word, [1, 1]),
        );
        const textLength = word.length;
        expect(getSelection(editable, { blockTag: "span" })).toEqual([
          sumLines(initialValue, 0) + 1 + textLength,
          sumLines(initialValue, 0) + 1 + textLength,
        ]);
      });
    });
  });

  describe("replace range", () => {
    it("replace chars", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      // Move caret
      await press("ArrowRight");
      expect(getSelection(editable)).toEqual([1, 1]);
      // Expand selection
      const selLength = 3;
      await loop(selLength, () => press("Shift+ArrowRight"));
      expect(getSelection(editable)).toEqual([1, 1 + selLength]);

      // Input
      const char = "a";
      const charLength = char.length;
      await type(char);
      expect(getText(editable)).toEqual(
        replaceAt(initialValue, char, selLength, [0, 1]),
      );
      expect(getSelection(editable)).toEqual([1 + charLength, 1 + charLength]);
    });

    it("replace linebreak", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      // Move caret
      const len = 1;
      await loop(len, () => press("ArrowRight"));
      expect(getSelection(editable)).toEqual([len, len]);
      // Expand selection
      await press("Shift+ArrowDown");
      expect(getSelection(editable)).toEqual([
        len,
        sumLines(initialValue, 0) + len,
      ]);

      // Input
      const char = "a";
      const charLength = char.length;
      await type(char);

      expect(getText(editable)).toEqual([
        initialValue[0]!.slice(0, len) + char + initialValue[1]!.slice(len),
        ...initialValue.slice(2),
      ]);
      expect(getSelection(editable)).toEqual([
        len + charLength,
        len + charLength,
      ]);
    });

    it("replace all", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      // Select All
      await press("ControlOrMeta+A");
      expect(getSelection(editable)).toEqual([
        0,
        sumLines(initialValue, initialValue.length - 1),
      ]);

      // Input
      const char = "a";
      const charLength = char.length;
      await type(char);

      expect(getText(editable)).toEqual([char]);
      expect(getSelection(editable)).toEqual([charLength, charLength]);
    });

    it("replace all with linebreak", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      // Select All
      await press("ControlOrMeta+A");
      expect(getSelection(editable)).toEqual([
        0,
        sumLines(initialValue, initialValue.length - 1),
      ]);

      // Enter
      await press("Enter");
      expect(getText(editable)).toEqual(["", ""]);
      expect(getSelection(editable)).toEqual([1, 1]);
    });

    it("replace with the same text", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      // Select text
      await press("ArrowRight");
      await press("Shift+ArrowRight");
      expect(getSelection(editable)).toEqual([1, 2]);

      // replace
      await type(initialValue[0]!.slice(1, 2));

      expect(getText(editable)).toEqual(initialValue);
      // Selection is synchronized to DOM asynchronously
      await expect.poll(() => getSelection(editable)).toEqual([2, 2]);
    });
  });

  describe("Keydown", () => {
    describe("Arrow keys", () => {
      it("multiline", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        await press("ArrowRight");
        expect(getSelection(editable)).toEqual([1, 1]);

        await press("ArrowDown");
        expect(getSelection(editable)).toEqual([
          sumLines(initialValue, 0) + 1,
          sumLines(initialValue, 0) + 1,
        ]);

        await press("ArrowLeft");
        expect(getSelection(editable)).toEqual([
          sumLines(initialValue, 0),
          sumLines(initialValue, 0),
        ]);

        await press("ArrowUp");
        expect(getSelection(editable)).toEqual([0, 0]);
      });

      it("singleline", async () => {
        const text = "Hello world.";
        const editable = await getEditable(
          render(<SinglelinePlainEditor initialText={text} />),
        );
        const textLength = text.length;

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        await press("ArrowRight");
        expect(getSelection(editable)).toEqual([1, 1]);

        await press("ArrowDown");
        expect(getSelection(editable)).toEqual([textLength, textLength]);

        await press("ArrowLeft");
        expect(getSelection(editable)).toEqual([
          textLength - 1,
          textLength - 1,
        ]);

        await press("ArrowUp");
        expect(getSelection(editable)).toEqual([0, 0]);
      });
    });

    describe("Enter", () => {
      it("split text", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        const offset = Math.floor(initialValue[0]!.length / 4);

        await loop(offset, () => press("ArrowRight"));
        expect(getSelection(editable)).toEqual([offset, offset]);

        // Split
        await press("Enter");
        const splittedValue = insertLineBreakAt(initialValue, [0, offset]);
        expect(getText(editable)).toEqual(splittedValue);
        expect(getSelection(editable)).toEqual([offset + 1, offset + 1]);

        // Split again
        await press("Enter");
        const splittedSplittedValue = insertLineBreakAt(splittedValue, [1, 0]);
        expect(getText(editable)).toEqual(splittedSplittedValue);
        expect(getSelection(editable)).toEqual([offset + 2, offset + 2]);

        // Insert empty line
        await press("ArrowUp");
        await press("Enter");
        expect(getText(editable)).toEqual(
          insertLineBreakAt(splittedSplittedValue, [1, 0]),
        );
        expect(getSelection(editable)).toEqual([offset + 2, offset + 2]);

        // Remove empty line
        await press("Backspace");
        await press("ArrowDown");
        expect(getText(editable)).toEqual(splittedSplittedValue);
        expect(getSelection(editable)).toEqual([offset + 2, offset + 2]);

        // Join
        await press("Backspace");
        expect(getText(editable)).toEqual(splittedValue);
        expect(getSelection(editable)).toEqual([offset + 1, offset + 1]);

        // Join again
        await press("Backspace");
        expect(getText(editable)).toEqual(initialValue);
        expect(getSelection(editable)).toEqual([offset, offset]);
      });

      it("split span", async () => {
        const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        const editable = await getEditable(
          render(<HighlightEditor initialText={text} initialSearch="dolor" />),
        );
        const initialValue = [text];
        expect(getText(editable)).toEqual(initialValue);

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        const offset = Math.floor(initialValue[0]!.length / 4);

        await loop(offset, () => press("ArrowRight"));
        expect(getSelection(editable)).toEqual([offset, offset]);

        // Split
        await press("Enter");
        const splittedValue = insertLineBreakAt(initialValue, [0, offset]);
        expect(getText(editable)).toEqual(splittedValue);
        expect(getSelection(editable)).toEqual([offset + 1, offset + 1]);

        // Split again
        await press("Enter");
        const splittedSplittedValue = insertLineBreakAt(splittedValue, [1, 0]);
        expect(getText(editable)).toEqual(splittedSplittedValue);
        expect(getSelection(editable)).toEqual([offset + 2, offset + 2]);

        // Insert empty line
        await press("ArrowUp");
        await press("Enter");
        expect(getText(editable)).toEqual(
          insertLineBreakAt(splittedSplittedValue, [1, 0]),
        );
        expect(getSelection(editable)).toEqual([offset + 2, offset + 2]);

        // Remove empty line
        await press("Backspace");
        await press("ArrowDown");
        expect(getText(editable)).toEqual(splittedSplittedValue);
        expect(getSelection(editable)).toEqual([offset + 2, offset + 2]);

        // Join
        await press("Backspace");
        expect(getText(editable)).toEqual(splittedValue);
        expect(getSelection(editable)).toEqual([offset + 1, offset + 1]);

        // Join again
        await press("Backspace");
        expect(getText(editable)).toEqual(initialValue);
        expect(getSelection(editable)).toEqual([offset, offset]);
      });

      it("handle empty spans", async () => {
        const text = `import React, { useState } from "react";

function Example() {`;
        const editable = await getEditable(
          render(<TokenizedEditor initialText={text} />),
        );
        const initialValue = text.split("\n");
        expect(getText(editable)).toEqual(initialValue);

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        const offset = Math.floor(initialValue[0]!.length / 4);

        await loop(offset, () => press("ArrowRight"));
        expect(getSelection(editable)).toEqual([offset, offset]);

        // Split
        await press("Enter");
        const splittedValue = insertLineBreakAt(initialValue, [0, offset]);
        expect(getText(editable)).toEqual(splittedValue);
        expect(getSelection(editable)).toEqual([offset + 1, offset + 1]);

        // Split again
        await press("Enter");
        const splittedSplittedValue = insertLineBreakAt(splittedValue, [1, 0]);
        expect(getText(editable)).toEqual(splittedSplittedValue);
        expect(getSelection(editable)).toEqual([offset + 2, offset + 2]);

        // Insert empty line
        await press("ArrowUp");
        await press("Enter");
        expect(getText(editable)).toEqual(
          insertLineBreakAt(splittedSplittedValue, [1, 0]),
        );
        expect(getSelection(editable)).toEqual([offset + 2, offset + 2]);

        // Remove empty line
        await press("Backspace");
        await press("ArrowDown");
        expect(getText(editable)).toEqual(splittedSplittedValue);
        expect(getSelection(editable)).toEqual([offset + 2, offset + 2]);

        // Join
        await press("Backspace");
        expect(getText(editable)).toEqual(splittedValue);
        expect(getSelection(editable)).toEqual([offset + 1, offset + 1]);

        // Join again
        await press("Backspace");
        expect(getText(editable)).toEqual(initialValue);
        expect(getSelection(editable)).toEqual([offset, offset]);
      });

      it("split edge cases", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        // Split at first
        await press("Enter");
        expect(getText(editable)).toEqual(
          insertLineBreakAt(initialValue, [0, 0]),
        );
        expect(getSelection(editable)).toEqual([1, 1]);

        // Join
        await press("Backspace");
        expect(getText(editable)).toEqual(initialValue);
        expect(getSelection(editable)).toEqual([0, 0]);

        // Move to last
        const lastLineIndex = initialValue.length - 1;
        const lastLineLength = initialValue[lastLineIndex]!.length;
        for (let i = 0; i <= lastLineIndex + 1; i++) {
          await press("ArrowDown");
        }
        expect(getSelection(editable)).toEqual([
          sumLines(initialValue, initialValue.length - 1),
          sumLines(initialValue, initialValue.length - 1),
        ]);

        // Split at last
        await press("Enter");
        expect(getText(editable)).toEqual(
          insertLineBreakAt(initialValue, [lastLineIndex, lastLineLength]),
        );
        expect(getSelection(editable)).toEqual([
          sumLines(initialValue, initialValue.length - 1) + 1,
          sumLines(initialValue, initialValue.length - 1) + 1,
        ]);

        // Join
        await press("Backspace");
        expect(getText(editable)).toEqual(initialValue);
        expect(getSelection(editable)).toEqual([
          sumLines(initialValue, initialValue.length - 1),
          sumLines(initialValue, initialValue.length - 1),
        ]);

        // Split at line start and delete selected text
        const editableRect = editable.getBoundingClientRect();
        const rowRect = editable.children[1]!.getBoundingClientRect();
        await userEvent.dblClick(editable, {
          position: {
            x: rowRect.left - editableRect.left + 4,
            y: rowRect.top - editableRect.top + rowRect.height / 2,
          },
        });
        await tick();
        const selectedText = getText(editable, { selected: true });
        const expectedText = "こんにちは";
        expect(selectedText).toEqual([expectedText]);
        expect(getSelection(editable)).toEqual([
          sumLines(initialValue, 0),
          sumLines(initialValue, 0) + expectedText.length,
        ]);
        await press("Enter");
        expect(getText(editable)).toEqual(
          insertLineBreakAt(
            deleteAt(initialValue, expectedText.length, [1, 0]),
            [1, 0],
          ),
        );
        expect(getSelection(editable)).toEqual([
          sumLines(initialValue, 0) + 1,
          sumLines(initialValue, 0) + 1,
        ]);
      });

      it("treat soft break as hard break", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        const offset = Math.floor(initialValue[0]!.length / 4);

        await loop(offset, () => press("ArrowRight"));
        expect(getSelection(editable)).toEqual([offset, offset]);

        // Soft break
        await press("Shift+Enter");
        const splittedValue = insertLineBreakAt(initialValue, [0, offset]);
        expect(getText(editable)).toEqual(splittedValue);
        expect(getSelection(editable)).toEqual([offset + 1, offset + 1]);

        // Soft break again
        await press("Shift+Enter");
        const splittedSplittedValue = insertLineBreakAt(splittedValue, [1, 0]);
        expect(getText(editable)).toEqual(splittedSplittedValue);
        expect(getSelection(editable)).toEqual([offset + 2, offset + 2]);

        // Insert empty line
        await press("ArrowUp");
        await press("Enter");
        expect(getText(editable)).toEqual(
          insertLineBreakAt(splittedSplittedValue, [1, 0]),
        );
        expect(getSelection(editable)).toEqual([offset + 2, offset + 2]);

        // Remove empty line
        await press("Backspace");
        await press("ArrowDown");
        expect(getText(editable)).toEqual(splittedSplittedValue);
        expect(getSelection(editable)).toEqual([offset + 2, offset + 2]);

        // Remove soft break
        await press("Backspace");
        expect(getText(editable)).toEqual(splittedValue);
        expect(getSelection(editable)).toEqual([offset + 1, offset + 1]);

        // Remove soft break again
        await press("Backspace");
        expect(getText(editable)).toEqual(initialValue);
        expect(getSelection(editable)).toEqual([offset, offset]);

        const endOffset = initialValue[0]!.length;

        await loop(endOffset - offset, () => press("ArrowRight"));
        expect(getSelection(editable)).toEqual([endOffset, endOffset]);

        // Soft break at EOL
        await press("Shift+Enter");
        expect(getText(editable)).toEqual(
          insertLineBreakAt(initialValue, [0, endOffset]),
        );
        expect(getSelection(editable)).toEqual([endOffset + 1, endOffset + 1]);

        // Remove soft break
        await press("Backspace");
        expect(getText(editable)).toEqual(initialValue);
        expect(getSelection(editable)).toEqual([endOffset, endOffset]);
      });

      it("singleline", async () => {
        const text = "Hello world.";
        const editable = await getEditable(
          render(<SinglelinePlainEditor initialText={text} />),
        );
        const initialValue = [text];

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        await loop(2, () => press("ArrowRight"));
        expect(getSelection(editable)).toEqual([2, 2]);

        // Press enter
        await press("Enter");

        // NOP
        expect(getText(editable)).toEqual(initialValue);
        expect(getSelection(editable)).toEqual([2, 2]);
      });
    });

    describe("Backspace", () => {
      it("delete char", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        // Move caret
        await loop(2, () => press("ArrowRight"));
        expect(getSelection(editable)).toEqual([2, 2]);

        // delete
        await press("Backspace");

        expect(getText(editable)).toEqual(deleteAt(initialValue, 1, [0, 1]));
        expect(getSelection(editable)).toEqual([1, 1]);
      });

      it("delete chars", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        // Move caret
        await press("ArrowRight");
        expect(getSelection(editable)).toEqual([1, 1]);
        // Expand selection
        const selLength = 3;
        await loop(selLength, () => press("Shift+ArrowRight"));
        expect(getSelection(editable)).toEqual([1, 1 + selLength]);

        // delete
        await press("Backspace");

        expect(getText(editable)).toEqual(
          deleteAt(initialValue, selLength, [0, 1]),
        );
        expect(getSelection(editable)).toEqual([1, 1]);
      });

      it("delete linebreak", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        // Move caret
        const len = 1;
        await loop(len, () => press("ArrowRight"));
        expect(getSelection(editable)).toEqual([len, len]);
        // Expand selection
        await press("Shift+ArrowDown");
        expect(getSelection(editable)).toEqual([
          len,
          sumLines(initialValue, 0) + len,
        ]);

        // delete
        await press("Backspace");

        expect(getText(editable)).toEqual([
          initialValue[0]!.slice(0, len) + initialValue[1]!.slice(len),
          ...initialValue.slice(2),
        ]);
        expect(getSelection(editable)).toEqual([len, len]);
      });

      it("delete all", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        // Select All
        await press("ControlOrMeta+A");
        expect(getSelection(editable)).toEqual([
          0,
          sumLines(initialValue, initialValue.length - 1),
        ]);

        // delete
        await press("Backspace");

        expect(getText(editable)).toEqual([""]);
        expect(getSelection(editable)).toEqual([0, 0]);
      });
    });

    describe("Delete", () => {
      it("delete char", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        // Move caret
        await loop(2, () => press("ArrowRight"));
        expect(getSelection(editable)).toEqual([2, 2]);

        // delete
        await press("Delete");

        expect(getText(editable)).toEqual(deleteAt(initialValue, 1, [0, 2]));
        expect(getSelection(editable)).toEqual([2, 2]);
      });

      it("delete chars", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        // Move caret
        await press("ArrowRight");
        expect(getSelection(editable)).toEqual([1, 1]);
        // Expand selection
        const selLength = 3;
        await loop(selLength, () => press("Shift+ArrowRight"));
        expect(getSelection(editable)).toEqual([1, 1 + selLength]);

        // delete
        await press("Delete");

        expect(getText(editable)).toEqual(
          deleteAt(initialValue, selLength, [0, 1]),
        );
        expect(getSelection(editable)).toEqual([1, 1]);
      });

      it("delete linebreak", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        // Move caret
        const len = 1;
        await loop(len, () => press("ArrowRight"));
        expect(getSelection(editable)).toEqual([len, len]);
        // Expand selection
        await press("Shift+ArrowDown");
        expect(getSelection(editable)).toEqual([
          len,
          sumLines(initialValue, 0) + len,
        ]);

        // delete
        await press("Delete");

        expect(getText(editable)).toEqual([
          initialValue[0]!.slice(0, len) + initialValue[1]!.slice(len),
          ...initialValue.slice(2),
        ]);
        expect(getSelection(editable)).toEqual([len, len]);
      });

      it("delete all", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        // Select All
        await press("ControlOrMeta+A");
        expect(getSelection(editable)).toEqual([
          0,
          sumLines(initialValue, initialValue.length - 1),
        ]);

        // delete
        await press("Delete");

        expect(getText(editable)).toEqual([""]);
        expect(getSelection(editable)).toEqual([0, 0]);
      });
    });

    describe("User defined shortcuts", () => {
      it("combobox", async () => {
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
        const initialValue = [NON_EDITABLE_PLACEHOLDER];
        expect(getText(editable)).toEqual(initialValue);

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        const textA = "a";
        await type(textA);

        // Enter(but no-op)
        await press("Enter");
        expect(getText(editable)).toEqual([textA + initialValue[0]]);

        // Select item with Enter
        await press("ArrowDown");
        await press("Enter");
        // the query is consumed and the selected item is inserted as a node
        expect(getText(editable)).toEqual([
          initialValue[0] + NON_EDITABLE_PLACEHOLDER,
        ]);

        // Delete all
        await press("ControlOrMeta+A");
        await press("Backspace");
        expect(getText(editable)).toEqual([""]);

        const textB = "e";
        await type(textB);

        // Select item with Enter
        await press("ArrowUp");
        await press("Enter");
        expect(getText(editable)).toEqual([NON_EDITABLE_PLACEHOLDER]);
      });
    });
  });

  describe("Cut", () => {
    it("noop (collapsed selection)", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      // Move caret
      await loop(2, () => press("ArrowRight"));
      expect(getSelection(editable)).toEqual([2, 2]);

      // The clipboard is shared in this file
      if (browser === "chromium") {
        await navigator.clipboard.writeText("");
      }

      // cut
      await press("ControlOrMeta+X");

      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([2, 2]);

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
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      // Move caret
      await press("ArrowRight");
      expect(getSelection(editable)).toEqual([1, 1]);
      // Expand selection
      const selLength = 3;
      await loop(selLength, () => press("Shift+ArrowRight"));
      expect(getSelection(editable)).toEqual([1, 1 + selLength]);

      // cut
      await press("ControlOrMeta+X");

      expect(getText(editable)).toEqual(
        deleteAt(initialValue, selLength, [0, 1]),
      );
      expect(getSelection(editable)).toEqual([1, 1]);

      // https://github.com/microsoft/playwright/issues/13037#issuecomment-1078208810
      if (browser !== "chromium") return;
      expect(await readClipboard("text/plain")).toEqual(
        initialValue[0]!.slice(1, 1 + selLength),
      );
      expect(await readClipboard("text/html")).toEqual(null);
    });

    it("cut linebreak", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      // Move caret
      const len = 1;
      await loop(len, () => press("ArrowRight"));
      expect(getSelection(editable)).toEqual([len, len]);
      // Expand selection
      await press("Shift+ArrowDown");
      expect(getSelection(editable)).toEqual([
        len,
        sumLines(initialValue, 0) + len,
      ]);

      // cut
      await press("ControlOrMeta+X");

      expect(getText(editable)).toEqual([
        initialValue[0]!.slice(0, len) + initialValue[1]!.slice(len),
        ...initialValue.slice(2),
      ]);
      expect(getSelection(editable)).toEqual([len, len]);

      // https://github.com/microsoft/playwright/issues/13037#issuecomment-1078208810
      if (browser !== "chromium") return;
      expect(await readClipboard("text/plain")).toEqual(
        [[initialValue[0]!.slice(len)], initialValue[1]!.slice(0, len)].join(
          "\n",
        ),
      );
      expect(await readClipboard("text/html")).toEqual(null);
    });

    it("cut all", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      // Select All
      await press("ControlOrMeta+A");
      expect(getSelection(editable)).toEqual([
        0,
        sumLines(initialValue, initialValue.length - 1),
      ]);

      // cut
      await press("ControlOrMeta+X");

      expect(getText(editable)).toEqual([""]);
      expect(getSelection(editable)).toEqual([0, 0]);

      // https://github.com/microsoft/playwright/issues/13037#issuecomment-1078208810
      if (browser !== "chromium") return;
      expect(await readClipboard("text/plain")).toEqual(
        initialValue.join("\n"),
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
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      await press("ArrowRight");
      await press("Shift+ArrowRight");
      await press("Shift+ArrowDown");
      await press("ControlOrMeta+C");

      expect(await readClipboard("text/plain")).toEqual(
        [[initialValue[0]!.slice(1)], initialValue[1]!.slice(0, 1)].join("\n"),
      );
      expect(await readClipboard("text/html")).toEqual(null);
    });

    it("copy all", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);
      // The clipboard is shared in this file
      await navigator.clipboard.writeText("");
      expect(await readClipboard("text/plain")).toEqual(null);
      expect(await readClipboard("text/html")).toEqual(null);

      await press("ControlOrMeta+A");
      await press("ControlOrMeta+C");

      expect(await readClipboard("text/plain")).toEqual(
        initialValue.join("\n"),
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
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        // Move caret
        await loop(2, () => press("ArrowRight"));
        expect(getSelection(editable)).toEqual([2, 2]);

        // paste
        const pastedText = "Paste text.";
        await navigator.clipboard.writeText(pastedText);
        await press("ControlOrMeta+V");

        const charLength = pastedText.length;
        expect(getText(editable)).toEqual(
          insertAt(initialValue, pastedText, [0, 2]),
        );
        expect(getSelection(editable)).toEqual([
          2 + charLength,
          2 + charLength,
        ]);
      });

      it("paste linebreak", async () => {
        const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
        const editable = await getEditable(
          render(<PlainEditor initialText={text} />),
        );
        const initialValue = text.split("\n");

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        // Move caret
        await loop(2, () => press("ArrowRight"));
        expect(getSelection(editable)).toEqual([2, 2]);

        // paste
        const pastedText = "Paste \ntext.";
        await navigator.clipboard.writeText(pastedText);
        await press("ControlOrMeta+V");

        const [beforeLineBreak, afterLineBreak] = pastedText.split("\n") as [
          string,
          string,
        ];
        expect(getText(editable)).toEqual(
          insertLineBreakAt(
            insertAt(initialValue, beforeLineBreak + afterLineBreak, [0, 2]),
            [0, 2 + beforeLineBreak.length],
          ),
        );
        expect(getSelection(editable)).toEqual([
          2 + pastedText.length,
          2 + pastedText.length,
        ]);
      });
    });

    describe("singleline", () => {
      it("paste text", async () => {
        const text = "Hello world.";
        const editable = await getEditable(
          render(<SinglelinePlainEditor initialText={text} />),
        );
        const initialValue = [text];

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        // Move caret
        await loop(2, () => press("ArrowRight"));
        expect(getSelection(editable)).toEqual([2, 2]);

        // paste
        const pastedText = "Paste text.";
        await navigator.clipboard.writeText(pastedText);
        await press("ControlOrMeta+V");

        const charLength = pastedText.length;
        expect(getText(editable)).toEqual(
          insertAt(initialValue, pastedText, [0, 2]),
        );
        expect(getSelection(editable)).toEqual([
          2 + charLength,
          2 + charLength,
        ]);
      });

      it("paste linebreak", async () => {
        const text = "Hello world.";
        const editable = await getEditable(
          render(<SinglelinePlainEditor initialText={text} />),
        );
        const initialValue = [text];

        editable.focus();

        expect(getSelection(editable)).toEqual([0, 0]);

        // Move caret
        await loop(2, () => press("ArrowRight"));
        expect(getSelection(editable)).toEqual([2, 2]);

        // paste
        const pastedText = "Paste \ntext.";
        await navigator.clipboard.writeText(pastedText);
        await press("ControlOrMeta+V");

        const pastedTextWithoutLinebreak = pastedText.split("\n").join("");
        const charLength = pastedTextWithoutLinebreak.length;
        expect(getText(editable)).toEqual(
          insertAt(initialValue, pastedTextWithoutLinebreak, [0, 2]),
        );
        expect(getSelection(editable)).toEqual([
          2 + charLength,
          2 + charLength,
        ]);
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
      await tick();
    };

    it("move chars", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      {
        // Select [0,1]-[0,4]
        await press("ArrowRight");
        const selLength = 3;
        await loop(selLength, () => press("Shift+ArrowRight"));
        expect(getSelection(editable)).toEqual([1, 1 + selLength]);

        // drop text to next line
        const [selectedText] = getText(editable, { selected: true });
        await dragSelectionTo(editable, { line: 1 });
        expect(getText(editable)).toEqual(
          insertAt(
            deleteAt(initialValue, selLength, [0, 1]),
            selectedText!,
            [1, 1],
          ),
        );
        expect(getSelection(editable)).toEqual([
          sumLines(initialValue, 0) - selLength + 1,
          sumLines(initialValue, 0) - selLength + 1 + selLength,
        ]);
      }

      // reset
      await press("ControlOrMeta+z");
      moveSelectionToOrigin(editable);
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([0, 0]);

      {
        // Select [1,2]-[1,4]
        await press("ArrowDown");
        const selStart = 2;
        await loop(selStart, () => press("ArrowRight"));
        const selLength = 2;
        await loop(selLength, () => press("Shift+ArrowRight"));
        expect(getSelection(editable)).toEqual([
          sumLines(initialValue, 0) + selStart,
          sumLines(initialValue, 0) + selStart + selLength,
        ]);

        // drop text to swap
        const [selectedText] = getText(editable, { selected: true });
        await dragSelectionTo(editable, { char: -2 });
        expect(getText(editable)).toEqual(
          insertAt(
            deleteAt(initialValue, selLength, [1, selStart]),
            selectedText!,
            [1, selStart - 1],
          ),
        );
        expect(getSelection(editable)).toEqual([
          sumLines(initialValue, 0) + selStart - 1,
          sumLines(initialValue, 0) + selStart - 1 + selLength,
        ]);
      }

      // reset
      await press("ControlOrMeta+z");
      moveSelectionToOrigin(editable);
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([0, 0]);

      {
        // Select [1,1]-[1,3]
        await press("ArrowDown");
        const selStart = 1;
        await loop(selStart, () => press("ArrowRight"));
        const selLength = 2;
        await loop(selLength, () => press("Shift+ArrowRight"));
        expect(getSelection(editable)).toEqual([
          sumLines(initialValue, 0) + selStart,
          sumLines(initialValue, 0) + selStart + selLength,
        ]);

        // drop text to swap
        const [selectedText] = getText(editable, { selected: true });
        await dragSelectionTo(editable, { char: 2 });
        expect(getText(editable)).toEqual(
          insertAt(
            deleteAt(initialValue, selLength, [1, selStart]),
            selectedText!,
            [1, selStart + 1],
          ),
        );
        expect(getSelection(editable)).toEqual([
          sumLines(initialValue, 0) + selStart + 1,
          sumLines(initialValue, 0) + selStart + 1 + selLength,
        ]);
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
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      const char = "z";
      await type(char);

      const editedValue = insertAt(initialValue, char, [0, 0]);
      expect(getText(editable)).toEqual(editedValue);

      // undo
      await press("ControlOrMeta+z");
      expect(getText(editable)).toEqual(initialValue);

      // redo
      await press("ControlOrMeta+Shift+z");
      expect(getText(editable)).toEqual(editedValue);
    });
  });

  describe("keep selection on render", () => {
    it("command", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<CommandEditor initialText={text} />),
      );
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      // Move caret
      await userEvent.click(page.getByRole("button", { name: "move forward" }));
      await tick();
      expect(getSelection(editable)).toEqual([1, 1]);

      // insert
      await userEvent.click(page.getByRole("button", { name: "insert" }));
      await tick();
      const inserted = "text";
      expect(getText(editable)).toEqual(
        insertAt(initialValue, inserted, [0, 1]),
      );
      expect(getSelection(editable)).toEqual([
        1 + inserted.length,
        1 + inserted.length,
      ]);

      // undo
      // TODO undo with button
      await press("ControlOrMeta+z");
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([1, 1]);

      // delete
      await userEvent.click(
        page.getByRole("button", { name: "move focus forward" }),
      );
      await tick();
      await userEvent.click(
        page.getByRole("button", { name: "delete selection" }),
      );
      await tick();
      expect(getText(editable)).toEqual(deleteAt(initialValue, 1, [0, 1]));
      expect(getSelection(editable)).toEqual([1, 1]);
    });

    it("type in input", async () => {
      const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
      const editable = await getEditable(
        render(<HighlightEditor initialText={text} initialSearch="dolor" />),
      );

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

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
      expect(getSelection(editable)).toEqual([0, 0]);
    });

    it("richtext", async () => {
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
      const initialValue = ["Hello World.", "こんにちは。", "👍❤️🧑‍🧑‍🧒"];
      expect(getText(editable)).toEqual(initialValue);
      const getRow = (i: number) => editable.children[i] as HTMLElement;
      const getItalicTexts = (row: HTMLElement) =>
        Array.from(row.children as HTMLCollectionOf<HTMLElement>)
          .filter((e) => e.style.fontStyle === "italic")
          .map((e) => e.textContent);
      expect(getRow(0).style.textAlign).toBe("");
      expect(getItalicTexts(getRow(1))).toEqual([]);

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      {
        // Set block attr
        await userEvent.click(page.getByRole("button", { name: "align" }));
        await tick();
        expect(getText(editable)).toEqual(initialValue);
        expect(getSelection(editable)).toEqual([0, 0]);
        expect(getRow(0).style.textAlign).toBe("right");

        // Select texts
        await press("Shift+ArrowRight");
        const movedSelection = [0, 1];
        expect(getSelection(editable)).toEqual(movedSelection);

        // Unset block attr
        await userEvent.click(page.getByRole("button", { name: "align" }));
        await tick();
        expect(getText(editable)).toEqual(initialValue);
        expect(getSelection(editable)).toEqual(movedSelection);
        expect(getRow(0).style.textAlign).toBe("");
      }

      {
        // Move caret
        await press("ArrowLeft");
        await press("ArrowDown");
        await press("ArrowRight");
        expect(getSelection(editable)).toEqual([
          sumLines(initialValue, 0) + 1,
          sumLines(initialValue, 0) + 1,
        ]);

        // Select texts
        await press("Shift+ArrowRight");
        await press("Shift+ArrowRight");
        const selectedSelection = [
          sumLines(initialValue, 0) + 1,
          sumLines(initialValue, 0) + 3,
        ];
        expect(getSelection(editable)).toEqual(selectedSelection);

        // Set text format
        await userEvent.click(page.getByRole("button", { name: "italic" }));
        await tick();
        expect(getText(editable)).toEqual(initialValue);
        expect(getSelection(editable)).toEqual(selectedSelection);
        expect(getItalicTexts(getRow(1))).toEqual(["んに"]);

        // Unset text format
        await userEvent.click(page.getByRole("button", { name: "italic" }));
        await tick();
        expect(getText(editable)).toEqual(initialValue);
        expect(getSelection(editable)).toEqual(selectedSelection);
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
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      {
        // Move caret. ArrowLeft runs forward through the model here, ArrowRight back
        const len = 4;
        await loop(len, () => press("ArrowLeft"));
        expect(getSelection(editable)).toEqual([len, len]);

        await loop(len, () => press("ArrowRight"));
        expect(getSelection(editable)).toEqual([0, 0]);
      }

      const at = 3;
      await loop(at, () => press("ArrowLeft"));
      expect(getSelection(editable)).toEqual([at, at]);

      // Delete. the character before the caret in the model sits to its visual right
      await press("Backspace");
      const backspaced = deleteAt(initialValue, 1, [0, at - 1]);
      expect(getText(editable)).toEqual(backspaced);
      expect(getSelection(editable)).toEqual([at - 1, at - 1]);

      await press("Delete");
      const deleted = deleteAt(backspaced, 1, [0, at - 1]);
      expect(getText(editable)).toEqual(deleted);
      expect(getSelection(editable)).toEqual([at - 1, at - 1]);

      {
        // Insert. latin into hebrew, so the caret ends past an opposite-direction run
        const word = "test";
        await type(word);
        const textLength = word.length;
        expect(getText(editable)).toEqual(insertAt(deleted, word, [0, at - 1]));
        expect(getSelection(editable)).toEqual([
          at - 1 + textLength,
          at - 1 + textLength,
        ]);
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

      expect(getSelection(editable)).toEqual([0, 0]);

      const at = 6;
      const len = 3;
      await loop(at, () => press("ArrowLeft"));
      expect(getSelection(editable)).toEqual([at, at]);

      // chromium and webkit extend visually, firefox logically
      await press("Shift+ArrowRight");
      const [, probed] = getSelection(editable);
      const back = probed < at ? "Shift+ArrowRight" : "Shift+ArrowLeft";
      const forth = probed < at ? "Shift+ArrowLeft" : "Shift+ArrowRight";
      await press("Shift+ArrowLeft");
      expect(getSelection(editable)).toEqual([at, at]);

      // the anchor stays put, and a focus behind it is reported backward
      await loop(len, () => press(back));
      expect(getSelection(editable)).toEqual([at, at - len]);

      await loop(len, () => press(forth));
      expect(getSelection(editable)).toEqual([at, at]);

      await loop(len, () => press(forth));
      expect(getSelection(editable)).toEqual([at, at + len]);
    });

    // a hebrew letter carrying niqqud is one caret stop spanning several units
    it("combining marks", async () => {
      const text = `היום התחלתי לכתוב מסמך חדש בעורך הזה.
עורך הטקסט הזה תומך בכתיבה דו־כיוונית לפי תקן Unicode.
המסמך כולל 3 פסקאות, וגם מעט ניקוד: שָׁלוֹם.`;
      const editable = await getEditable(
        render(<PlainEditor initialText={text} style={{ direction: "rtl" }} />),
      );
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      const line = 2;
      const clusters = grapheme(initialValue[line]!);
      const cluster = clusters.find((c) => c.length > 1);
      expect(cluster).toBeTruthy();

      const clusterIndex = clusters.indexOf(cluster!);
      // every cluster before it is a single unit, so the index doubles as an offset
      expect(clusters.slice(0, clusterIndex).every((c) => c.length === 1)).toBe(
        true,
      );

      const lineStart = sumLines(initialValue, line - 1);
      const offset = clusterIndex + cluster!.length;
      const afterOffset = lineStart + offset;

      await loop(line, () => press("ArrowDown"));
      expect(getSelection(editable)).toEqual([lineStart, lineStart]);
      await loop(clusterIndex + 1, () => press("ArrowLeft"));
      expect(getSelection(editable)).toEqual([afterOffset, afterOffset]);

      // insert
      const char = "a";
      await type(char);
      expect(getText(editable)).toEqual(
        insertAt(initialValue, char, [line, offset]),
      );
      expect(getSelection(editable)).toEqual([
        afterOffset + 1,
        afterOffset + 1,
      ]);
      // delete
      await press("Backspace");
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([afterOffset, afterOffset]);
    });
  });

  describe("emoji", () => {
    it("surrogate pair", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      const char = "a";

      const emoji = "👍";
      const offset = grapheme(initialValue[2]!).indexOf(emoji);
      expect(offset).toBeGreaterThan(-1);

      const afterOffset = offset + 1;

      // move to after emoji
      await loop(afterOffset, () => press("ArrowRight"));
      expect(getSelection(editable)).toEqual([afterOffset, afterOffset]);
      // insert
      await type(char);
      expect(getText(editable)).toEqual(
        insertAt(initialValue, char, [0, afterOffset]),
      );
      expect(getSelection(editable)).toEqual([
        afterOffset + 1,
        afterOffset + 1,
      ]);
      // delete
      await press("Backspace");
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([afterOffset, afterOffset]);
    });

    it("variation selector", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      const char = "a";

      const emoji = "❤️";
      const offset = grapheme(initialValue[2]!).indexOf(emoji);
      expect(offset).toBeGreaterThan(-1);

      const afterOffset = offset + 1;

      // move to after emoji
      await loop(afterOffset, () => press("ArrowRight"));
      expect(getSelection(editable)).toEqual([afterOffset, afterOffset]);
      // insert
      await type(char);
      expect(getText(editable)).toEqual(
        insertAt(initialValue, char, [0, afterOffset]),
      );
      expect(getSelection(editable)).toEqual([
        afterOffset + 1,
        afterOffset + 1,
      ]);
      // delete
      await press("Backspace");
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([afterOffset, afterOffset]);
    });

    it("zero width joiner", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<PlainEditor initialText={text} />),
      );
      const initialValue = text.split("\n");

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      const char = "a";

      const emoji = "🧑‍🧑‍🧒";
      const offset = grapheme(initialValue[2]!).indexOf(emoji);
      expect(offset).toBeGreaterThan(-1);

      const afterOffset = offset + 1;

      // move to after emoji
      await loop(afterOffset, () => press("ArrowRight"));
      expect(getSelection(editable)).toEqual([afterOffset, afterOffset]);
      // insert
      await type(char);
      expect(getText(editable)).toEqual(
        insertAt(initialValue, char, [0, afterOffset]),
      );
      expect(getSelection(editable)).toEqual([
        afterOffset + 1,
        afterOffset + 1,
      ]);
      // delete
      await press("Backspace");
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([afterOffset, afterOffset]);
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
    await microtask();

    expect(isReadonly()).toEqual("false");

    // Disable readonly mode
    editor.current!.readonly = false;
    await microtask();

    expect(isReadonly()).toEqual("true");
  });

  it("placeholder", async () => {
    const editable = await getEditable(
      render(<PlaceholderEditor initialText={""} />),
    );
    const initialValue = getText(editable);

    // The resolved content differs between browsers, but it's "none" in all of them if not rendered
    const isPlaceholderShown = () =>
      getComputedStyle(editable, "::before").content !== "none";

    editable.focus();

    expect(initialValue).toEqual([""]);
    expect(getSelection(editable)).toEqual([0, 0]);
    expect(isPlaceholderShown()).toBe(true);

    // Input
    const char = "a";
    await type(char);

    const value1 = getText(editable);
    expect(value1).toEqual(insertAt(initialValue, char, [0, 0]));
    expect(getSelection(editable)).toEqual([1, 1]);
    expect(isPlaceholderShown()).toBe(false);

    await press("Backspace");
    const value2 = getText(editable);
    expect(value2).toEqual([""]);
    expect(getSelection(editable)).toEqual([0, 0]);
    expect(isPlaceholderShown()).toBe(true);
  });

  describe("keep state on render", () => {
    it("sync", async () => {
      const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
      const editable = await getEditable(
        render(<HighlightEditor initialText={text} initialSearch="dolor" />),
      );
      const initialValue = [text];
      expect(getText(editable)).toEqual(initialValue);

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      const searchInput = page
        .getByRole("textbox", { name: "search word" })
        .element() as HTMLInputElement;
      const searchValue = searchInput.value;
      const searchValueLength = searchValue.length;
      expect(searchValueLength).toBeGreaterThan(1);

      const markedOffset = initialValue[0]!.indexOf(searchValue);
      const char = "a";

      // type just before node
      await loop(markedOffset, () => press("ArrowRight"));
      expect(getSelection(editable)).toEqual([markedOffset, markedOffset]);

      // insert
      await type(char);
      expect(getText(editable)).toEqual(
        insertAt(initialValue, char, [0, markedOffset]),
      );
      expect(getSelection(editable)).toEqual([
        markedOffset + 1,
        markedOffset + 1,
      ]);

      // delete
      await press("Backspace");
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([markedOffset, markedOffset]);

      // type on node
      await press("ArrowRight");
      expect(getSelection(editable)).toEqual([
        markedOffset + 1,
        markedOffset + 1,
      ]);

      // insert
      await type(char);
      expect(getText(editable)).toEqual(
        insertAt(initialValue, char, [0, markedOffset + 1]),
      );
      expect(getSelection(editable)).toEqual([
        markedOffset + 2,
        markedOffset + 2,
      ]);

      // delete
      await press("Backspace");
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([
        markedOffset + 1,
        markedOffset + 1,
      ]);

      // type just after node
      await loop(searchValueLength - 1, () => press("ArrowRight"));
      expect(getSelection(editable)).toEqual([
        markedOffset + searchValueLength,
        markedOffset + searchValueLength,
      ]);

      // insert
      await type(char);
      expect(getText(editable)).toEqual(
        insertAt(initialValue, char, [0, markedOffset + searchValueLength]),
      );
      expect(getSelection(editable)).toEqual([
        markedOffset + searchValueLength + 1,
        markedOffset + searchValueLength + 1,
      ]);

      // delete
      await press("Backspace");
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([
        markedOffset + searchValueLength,
        markedOffset + searchValueLength,
      ]);
    });

    it("async", async () => {
      const text = "Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒";
      const editable = await getEditable(
        render(<AsyncMarkEditor initialText={text} />),
      );
      const initialValue = text.split("\n");
      expect(getText(editable)).toEqual(initialValue);

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      const markedOffset = await vi.waitFor(() => {
        const marks = editable.querySelectorAll("[data-mark]");
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
      const char = "a";

      // type just before node
      await loop(markedOffset, () => press("ArrowRight"));
      expect(getSelection(editable)).toEqual([markedOffset, markedOffset]);

      // insert
      await type(char);
      expect(getText(editable)).toEqual(
        insertAt(initialValue, char, [0, markedOffset]),
      );
      expect(getSelection(editable)).toEqual([
        markedOffset + 1,
        markedOffset + 1,
      ]);

      // delete
      await press("Backspace");
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([markedOffset, markedOffset]);

      // type just after node
      await press("ArrowRight");
      expect(getSelection(editable)).toEqual([
        markedOffset + 1,
        markedOffset + 1,
      ]);

      // insert
      await type(char);
      expect(getText(editable)).toEqual(
        insertAt(initialValue, char, [0, markedOffset + 1]),
      );
      expect(getSelection(editable)).toEqual([
        markedOffset + 2,
        markedOffset + 2,
      ]);

      // delete
      await press("Backspace");
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([
        markedOffset + 1,
        markedOffset + 1,
      ]);
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
      expect(getText(editable)).toEqual(initialValue);

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      const nodeOffset = initialValue[0]!.indexOf(NON_EDITABLE_PLACEHOLDER);
      const char = "a";

      // type just before node
      await loop(nodeOffset, () => press("ArrowRight"));
      expect(getSelection(editable)).toEqual([nodeOffset, nodeOffset]);

      // insert
      await type(char);
      expect(getText(editable)).toEqual(
        insertAt(initialValue, char, [0, nodeOffset]),
      );
      expect(getSelection(editable)).toEqual([nodeOffset + 1, nodeOffset + 1]);

      // delete
      await press("Backspace");
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([nodeOffset, nodeOffset]);

      // type just after node
      await press("ArrowRight");
      expect(getSelection(editable)).toEqual([nodeOffset + 1, nodeOffset + 1]);

      // insert
      await type(char);
      expect(getText(editable)).toEqual(
        insertAt(initialValue, char, [0, nodeOffset + 1]),
      );
      expect(getSelection(editable)).toEqual([nodeOffset + 2, nodeOffset + 2]);

      // delete
      await press("Backspace");
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([nodeOffset + 1, nodeOffset + 1]);

      // delete custom node
      await press("Backspace");
      expect(getText(editable)).toEqual(
        deleteAt(initialValue, 1, [0, nodeOffset]),
      );
      expect(getSelection(editable)).toEqual([nodeOffset, nodeOffset]);

      // undo
      await press("ControlOrMeta+z");
      moveSelectionToOrigin(editable);
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([0, 0]);

      // delete selected custom node and texts
      await loop(nodeOffset - 1, () => press("ArrowRight"));
      await press("Shift+ArrowRight");
      await press("Shift+ArrowRight");
      await press("Shift+ArrowRight");
      await press("Backspace");
      expect(getText(editable)).toEqual(
        deleteAt(initialValue, 3, [0, nodeOffset - 1]),
      );
      expect(getSelection(editable)).toEqual([nodeOffset - 1, nodeOffset - 1]);

      // undo
      await press("ControlOrMeta+z");
      moveSelectionToOrigin(editable);
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([0, 0]);

      // replace selected custom node
      const replaceText = "Z";
      await loop(nodeOffset, () => press("ArrowRight"));
      await press("Shift+ArrowRight");
      await type(replaceText);
      expect(getText(editable)).toEqual(
        insertAt(deleteAt(initialValue, 1, [0, nodeOffset]), replaceText, [
          0,
          nodeOffset,
        ]),
      );
      expect(getSelection(editable)).toEqual([nodeOffset + 1, nodeOffset + 1]);
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
      expect(getText(editable)).toEqual(initialValue);

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      const nodeOffset = initialValue[0]!.indexOf(NON_EDITABLE_PLACEHOLDER);
      const char = "a";

      // type just before node
      await loop(nodeOffset, () => press("ArrowRight"));
      expect(getSelection(editable)).toEqual([nodeOffset, nodeOffset]);

      // insert
      await type(char);
      expect(getText(editable)).toEqual(
        insertAt(initialValue, char, [0, nodeOffset]),
      );
      expect(getSelection(editable)).toEqual([nodeOffset + 1, nodeOffset + 1]);

      // delete
      await press("Backspace");
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([nodeOffset, nodeOffset]);

      // type just after node
      await press("ArrowRight");
      expect(getSelection(editable)).toEqual([nodeOffset + 1, nodeOffset + 1]);

      // insert
      await type(char);
      expect(getText(editable)).toEqual(
        insertAt(initialValue, char, [0, nodeOffset + 1]),
      );
      expect(getSelection(editable)).toEqual([nodeOffset + 2, nodeOffset + 2]);

      // delete
      await press("Backspace");
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([nodeOffset + 1, nodeOffset + 1]);

      // delete custom node
      await press("Backspace");
      expect(getText(editable)).toEqual(
        deleteAt(initialValue, 1, [0, nodeOffset]),
      );
      expect(getSelection(editable)).toEqual([nodeOffset, nodeOffset]);

      // undo
      await press("ControlOrMeta+z");
      moveSelectionToOrigin(editable);
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([0, 0]);

      // delete selected custom node and texts
      await loop(nodeOffset - 1, () => press("ArrowRight"));
      await press("Shift+ArrowRight");
      await press("Shift+ArrowRight");
      await press("Shift+ArrowRight");
      await press("Backspace");
      expect(getText(editable)).toEqual(
        deleteAt(initialValue, 3, [0, nodeOffset - 1]),
      );
      expect(getSelection(editable)).toEqual([nodeOffset - 1, nodeOffset - 1]);

      // undo
      await press("ControlOrMeta+z");
      moveSelectionToOrigin(editable);
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([0, 0]);

      // replace selected custom node
      const replaceText = "Z";
      await loop(nodeOffset, () => press("ArrowRight"));
      await press("Shift+ArrowRight");
      await type(replaceText);
      expect(getText(editable)).toEqual(
        insertAt(deleteAt(initialValue, 1, [0, nodeOffset]), replaceText, [
          0,
          nodeOffset,
        ]),
      );
      expect(getSelection(editable)).toEqual([nodeOffset + 1, nodeOffset + 1]);
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
      expect(getText(editable)).toEqual(initialValue);

      editable.focus();

      expect(getSelection(editable)).toEqual([0, 0]);

      const offsetAtLine = initialValue[1]!.indexOf(NON_EDITABLE_PLACEHOLDER);
      const nodeOffset = initialValue[0]!.length + 1 + offsetAtLine;
      const char = "a";

      // type just before node
      await loop(nodeOffset, () => press("ArrowRight"));
      expect(getSelection(editable)).toEqual([nodeOffset, nodeOffset]);

      // insert
      await type(char);
      expect(getText(editable)).toEqual(
        insertAt(initialValue, char, [1, offsetAtLine]),
      );
      expect(getSelection(editable)).toEqual([nodeOffset + 1, nodeOffset + 1]);

      // delete
      await press("Backspace");
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([nodeOffset, nodeOffset]);

      // type just after node
      await press("ArrowRight");
      expect(getSelection(editable)).toEqual([nodeOffset + 1, nodeOffset + 1]);

      // insert
      await type(char);
      expect(getText(editable)).toEqual(
        insertAt(initialValue, char, [1, offsetAtLine + 1]),
      );
      expect(getSelection(editable)).toEqual([nodeOffset + 2, nodeOffset + 2]);

      // delete
      await press("Backspace");
      expect(getText(editable)).toEqual(initialValue);
      expect(getSelection(editable)).toEqual([nodeOffset + 1, nodeOffset + 1]);

      // delete custom node
      await press("Backspace");
      expect(getText(editable)).toEqual(
        deleteAt(initialValue, 1, [1, offsetAtLine]),
      );
      expect(getSelection(editable)).toEqual([nodeOffset, nodeOffset]);
    });
  });
});
