import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { StoryObj } from "@storybook/react-vite";
import {
  createEditor,
  htmlPaste,
  htmlCopy,
  plainCopy,
  plainPaste,
  ToggleFormat,
  singlelinePlugin,
  internalCopy,
  internalPaste,
  filePaste,
  hotkey,
  InsertNode,
  ToggleBlockAttr,
} from "../../src";
import * as v from "valibot";

export default {
  component: createEditor,
};

const basicSchema = v.strictObject({
  children: v.array(
    v.strictObject({
      children: v.array(
        v.strictObject({
          text: v.string(),
        }),
      ),
    }),
  ),
});

export const Basic: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);

    type Doc = v.InferOutput<typeof basicSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [
        { children: [{ text: "Hello world." }] },
        { children: [{ text: "こんにちは。" }] },
        { children: [{ text: "👍❤️🧑‍🧑‍🧒" }] },
      ],
    });

    useEffect(() => {
      if (!ref.current) return;
      return createEditor({
        doc: doc,
        schema: basicSchema,
        copy: [internalCopy(), htmlCopy(), plainCopy()],
        paste: [
          internalPaste(),
          htmlPaste<Doc>((text) => ({ text })),
          plainPaste(),
        ],
        onChange: setDoc,
      }).input(ref.current);
    }, []);

    return (
      <div
        ref={ref}
        style={{
          backgroundColor: "white",
          border: "solid 1px darkgray",
          padding: 8,
        }}
      >
        {doc.children.map((b, i) => (
          <div key={i}>
            {b.children.map((n, j) => (
              <span key={j}>{n.text || <br />}</span>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

const richTextSchema = v.strictObject({
  text: v.string(),
  bold: v.optional(v.boolean()),
  italic: v.optional(v.boolean()),
  underline: v.optional(v.boolean()),
  strike: v.optional(v.boolean()),
});

const richSchema = v.strictObject({
  children: v.array(
    v.strictObject({
      align: v.optional(v.picklist(["left", "right"])),
      children: v.array(richTextSchema),
    }),
  ),
});

const Text = ({ node }: { node: v.InferOutput<typeof richTextSchema> }) => {
  const Element = node.bold ? "strong" : "span";
  const style: CSSProperties = {};
  if (node.italic) {
    style.fontStyle = "italic";
  }
  if (node.underline) {
    style.textDecoration = "underline";
  }
  if (node.strike) {
    style.textDecoration = style.textDecoration
      ? `${style.textDecoration} line-through`
      : "line-through";
  }
  return <Element style={style}>{node.text || <br />}</Element>;
};

export const RichText: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);

    type Doc = v.InferOutput<typeof richSchema>;
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
        { children: [{ text: "こんにちは。" }] },
        { children: [{ text: "👍❤️🧑‍🧑‍🧒" }] },
      ],
    });

    const toggleBold = () => {
      editor.apply(ToggleFormat, "bold");
    };
    const toggleItalic = () => {
      editor.apply(ToggleFormat, "italic");
    };
    const toggleUnderline = () => {
      editor.apply(ToggleFormat, "underline");
    };
    const toggleStrike = () => {
      editor.apply(ToggleFormat, "strike");
    };
    const toggleAlign = () => {
      editor.apply(ToggleBlockAttr, "align", "right", undefined);
    };

    const editor = useMemo(
      () =>
        createEditor({
          doc: doc,
          schema: richSchema,
          keyboard: [
            hotkey("b", toggleBold, { mod: true }),
            hotkey("i", toggleItalic, { mod: true }),
            hotkey("u", toggleUnderline, { mod: true }),
            hotkey("s", toggleStrike, { mod: true }),
          ],
          copy: [internalCopy(), plainCopy()],
          paste: [internalPaste(), plainPaste()],
          onChange: setDoc,
        }),
      [],
    );

    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);

    return (
      <div>
        <div>
          <button onClick={toggleBold}>bold</button>
          <button onClick={toggleItalic}>italic</button>
          <button onClick={toggleUnderline}>underline</button>
          <button onClick={toggleStrike}>strike</button>
          <button onClick={toggleAlign}>align</button>
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
                <Text key={j} node={n} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  },
};

const tagSchema = v.strictObject({
  children: v.array(
    v.strictObject({
      children: v.array(
        v.union([
          v.strictObject({
            text: v.string(),
          }),
          v.strictObject({
            type: v.literal("tag"),
            label: v.string(),
            value: v.string(),
          }),
        ]),
      ),
    }),
  ),
});

export const Tag: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);

    type Doc = v.InferOutput<typeof tagSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [
        {
          children: [
            { text: "Hello " },
            { type: "tag", label: "Apple", value: "1" },
            { text: " world " },
            { type: "tag", label: "Orange", value: "2" },
          ],
        },
      ],
    });

    const editor = useMemo(
      () =>
        createEditor({
          doc: doc,
          schema: tagSchema,
          copy: [
            internalCopy(),
            plainCopy<Doc>((node) => ("text" in node ? node.text : node.label)),
          ],
          paste: [internalPaste(), plainPaste()],
          onChange: setDoc,
        }).use(singlelinePlugin),
      [],
    );

    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);

    const labelRef = useRef<HTMLInputElement>(null);
    const valueRef = useRef<HTMLInputElement>(null);

    return (
      <div>
        <div>
          <label>
            label:
            <input ref={labelRef} defaultValue="Grape" />
          </label>
          <label>
            value:
            <input ref={valueRef} defaultValue="123" />
          </label>
          <button
            onClick={() => {
              const label = labelRef.current?.value;
              const value = valueRef.current?.value;
              if (!label || !value) return;
              editor.apply(InsertNode, { type: "tag", value, label });
            }}
          >
            insert
          </button>
        </div>
        <div
          ref={ref}
          style={{
            backgroundColor: "white",
            padding: 8,
          }}
        >
          {doc.children[0].children.map((t, j) =>
            "text" in t ? (
              <span key={j}>{t.text || <br />}</span>
            ) : (
              <span
                key={j}
                contentEditable={false}
                data-tag-value={t.value}
                style={{
                  background: "slategray",
                  color: "white",
                  fontSize: 12,
                  padding: 4,
                  borderRadius: 8,
                }}
              >
                {t.label}
              </span>
            ),
          )}
        </div>
      </div>
    );
  },
};

const imageSchema = v.strictObject({
  children: v.array(
    v.strictObject({
      children: v.array(
        v.union([
          v.strictObject({
            text: v.string(),
          }),
          v.strictObject({
            type: v.literal("image"),
            src: v.string(),
          }),
        ]),
      ),
    }),
  ),
});

export const Image: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);

    type Doc = v.InferOutput<typeof imageSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [
        {
          children: [
            {
              text: "Hello ",
            },
            {
              type: "image",
              src: "https://loremflickr.com/320/240/cats?lock=1",
            },
            {
              text: " world ",
            },
            {
              type: "image",
              src: "https://loremflickr.com/320/240/cats?lock=2",
            },
          ],
        },
      ],
    });

    useEffect(() => {
      if (!ref.current) return;
      return createEditor({
        doc: doc,
        schema: imageSchema,
        copy: [internalCopy(), htmlCopy(), plainCopy()],
        paste: [
          internalPaste(),
          filePaste({
            "image/png": (file) => ({
              type: "image",
              src: URL.createObjectURL(file),
            }),
          }),
          htmlPaste<Doc>(
            (text) => ({ text }),
            [
              (e) => {
                if (e.tagName === "IMG") {
                  return {
                    type: "image",
                    src: (e as HTMLImageElement).src,
                  };
                }
              },
            ],
          ),
          plainPaste(),
        ],
        onChange: setDoc,
      }).input(ref.current);
    }, []);

    return (
      <div
        ref={ref}
        style={{
          backgroundColor: "white",
          padding: 8,
        }}
      >
        {doc.children.map((b, i) => (
          <div key={i}>
            {b.children.map((t, j) =>
              "text" in t ? (
                <span key={j}>{t.text || <br />}</span>
              ) : (
                <img key={j} src={t.src} style={{ maxWidth: 200 }} />
              ),
            )}
          </div>
        ))}
      </div>
    );
  },
};

const videoSchema = v.strictObject({
  children: v.array(
    v.strictObject({
      children: v.array(
        v.union([
          v.strictObject({
            text: v.string(),
          }),
          v.strictObject({
            type: v.literal("video"),
            src: v.string(),
          }),
        ]),
      ),
    }),
  ),
});

export const Video: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);

    type Doc = v.InferOutput<typeof videoSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [
        {
          children: [
            {
              text: "Hello ",
            },
            {
              type: "video",
              src: "https://download.samplelib.com/mp4/sample-5s.mp4",
            },
            {
              text: " world ",
            },
          ],
        },
      ],
    });

    useEffect(() => {
      if (!ref.current) return;
      return createEditor({
        doc: doc,
        schema: videoSchema,
        copy: [internalCopy(), htmlCopy(), plainCopy()],
        paste: [
          internalPaste(),
          htmlPaste<Doc>(
            (text) => ({ text }),
            [
              (e) => {
                if (e.tagName === "VIDEO") {
                  return {
                    type: "video",
                    src: (e.childNodes[0] as HTMLSourceElement).src,
                  };
                }
              },
            ],
          ),
          plainPaste(),
        ],
        onChange: setDoc,
      }).input(ref.current);
    }, []);

    return (
      <div
        ref={ref}
        style={{
          backgroundColor: "white",
          padding: 8,
        }}
      >
        {doc.children.map((b, i) => (
          <div key={i}>
            {b.children.map((t, j) =>
              "text" in t ? (
                <span key={j}>{t.text || <br />}</span>
              ) : (
                // safari needs contentEditable="false"
                <video
                  key={j}
                  width={400}
                  controls
                  contentEditable="false"
                  suppressContentEditableWarning
                >
                  <source src={t.src} />
                </video>
              ),
            )}
          </div>
        ))}
      </div>
    );
  },
};

const youtubeSchema = v.strictObject({
  children: v.array(
    v.strictObject({
      children: v.array(
        v.union([
          v.strictObject({
            text: v.string(),
          }),
          v.strictObject({
            type: v.literal("youtube"),
            id: v.string(),
          }),
        ]),
      ),
    }),
  ),
});

const Youtube = ({ id }: { id: string }) => {
  return (
    <iframe
      data-youtube-node
      data-youtube-id={id}
      width="560"
      height="315"
      src={"https://www.youtube.com/embed/" + id}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  );
};

export const Iframe: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);

    type Doc = v.InferOutput<typeof youtubeSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [
        {
          children: [
            {
              text: "Hello ",
            },
            {
              type: "youtube",
              id: "IqKz0SfHaqI",
            },
            {
              text: " Youtube",
            },
          ],
        },
      ],
    });

    useEffect(() => {
      if (!ref.current) return;
      return createEditor({
        doc: doc,
        schema: youtubeSchema,
        copy: [internalCopy(), htmlCopy(), plainCopy()],
        paste: [
          internalPaste(),
          htmlPaste<Doc>(
            (text) => ({ text }),
            [
              (e) => {
                if (!!e.dataset.youtubeNode) {
                  return {
                    type: "youtube",
                    id: e.dataset.youtubeId!,
                  };
                }
              },
            ],
          ),
          plainPaste(),
        ],
        onChange: setDoc,
      }).input(ref.current);
    }, []);

    return (
      <div>
        <div
          ref={ref}
          style={{
            backgroundColor: "white",
            padding: 8,
          }}
        >
          {doc.children.map((b, i) => (
            <div key={i}>
              {b.children.map((t, j) =>
                "text" in t ? (
                  <span key={j}>{t.text || <br />}</span>
                ) : (
                  <Youtube key={j} id={t.id} />
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
};
