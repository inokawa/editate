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
  ToggleFormat,
  singlelinePlugin,
  InsertNode,
  ToggleBlockAttr,
  keymapPlugin,
  internalTranferPlugin,
  htmlTransferPlugin,
  plainTransferPlugin,
  fileTransferPlugin,
  LeafsInRange,
  selectionRectPlugin,
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

    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: basicSchema,
      })
        .exec(internalTranferPlugin)
        .exec(plainTransferPlugin);
      e.on("change", () => {
        setDoc(e.doc);
      });
      return e;
    }, []);

    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
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

    const [rect, setRect] = useState<{ top: number; left: number } | null>(
      null,
    );
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);
    const [strike, setStrike] = useState(false);

    const toggleBold = () => {
      editor.exec(ToggleFormat, "bold");
    };
    const toggleItalic = () => {
      editor.exec(ToggleFormat, "italic");
    };
    const toggleUnderline = () => {
      editor.exec(ToggleFormat, "underline");
    };
    const toggleStrike = () => {
      editor.exec(ToggleFormat, "strike");
    };
    const toggleAlign = () => {
      editor.exec(ToggleBlockAttr, "align", "right", undefined);
    };

    const editor = useMemo(() => {
      const updateMenu = () => {
        let hasBold = false;
        let hasItalic = false;
        let hasUnderline = false;
        let hasStrike = false;
        for (const leaf of editor.exec(LeafsInRange)) {
          if (leaf.bold) {
            hasBold = true;
          }
          if (leaf.italic) {
            hasItalic = true;
          }
          if (leaf.underline) {
            hasUnderline = true;
          }
          if (leaf.strike) {
            hasStrike = true;
          }
        }
        setBold(hasBold);
        setItalic(hasItalic);
        setUnderline(hasUnderline);
        setStrike(hasStrike);
      };
      const e = createEditor({
        doc: doc,
        schema: richSchema,
      })
        .exec(keymapPlugin, {
          "Mod+B": toggleBold,
          "Mod+I": toggleItalic,
          "Mod+U": toggleUnderline,
          "Mod+S": toggleStrike,
        })
        .exec(selectionRectPlugin, (getRect) => {
          if (editor.selection[0] !== editor.selection[1]) {
            setRect((prev) => {
              const rect = getRect();
              if (prev && prev.top === rect.top && prev.left === rect.left) {
                return prev;
              } else {
                return { top: rect.top, left: rect.left };
              }
            });
          } else {
            setRect(null);
          }
        })
        .exec(internalTranferPlugin)
        .exec(plainTransferPlugin);
      e.on("change", () => {
        setDoc(e.doc);
        updateMenu();
      });
      e.on("selectionchange", () => {
        updateMenu();
      });
      return e;
    }, []);

    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);

    return (
      <div>
        <div
          style={{ display: "flex", alignItems: "center", gap: 4, padding: 4 }}
        >
          <div>
            <button
              style={{ fontWeight: bold ? "bold" : undefined }}
              onClick={toggleBold}
            >
              bold
            </button>
            <button
              style={{ fontWeight: italic ? "bold" : undefined }}
              onClick={toggleItalic}
            >
              italic
            </button>
            <button
              style={{ fontWeight: underline ? "bold" : undefined }}
              onClick={toggleUnderline}
            >
              underline
            </button>
            <button
              style={{ fontWeight: strike ? "bold" : undefined }}
              onClick={toggleStrike}
            >
              strike
            </button>
          </div>
          <div>
            <button onClick={toggleAlign}>align</button>
          </div>
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
        {rect ? (
          <div
            style={{
              position: "fixed",
              top: rect.top - 30,
              left: rect.left,
              whiteSpace: "nowrap",
            }}
          >
            <button
              style={{ fontWeight: bold ? "bold" : undefined }}
              onClick={toggleBold}
            >
              bold
            </button>
            <button
              style={{ fontWeight: italic ? "bold" : undefined }}
              onClick={toggleItalic}
            >
              italic
            </button>
            <button
              style={{ fontWeight: underline ? "bold" : undefined }}
              onClick={toggleUnderline}
            >
              underline
            </button>
            <button
              style={{ fontWeight: strike ? "bold" : undefined }}
              onClick={toggleStrike}
            >
              strike
            </button>
          </div>
        ) : null}
      </div>
    );
  },
};

const tagSchema = v.strictObject({
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
});

export const Tag: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);

    type Doc = v.InferOutput<typeof tagSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [
        { text: "Hello " },
        { type: "tag", label: "Apple", value: "1" },
        { text: " world " },
        { type: "tag", label: "Orange", value: "2" },
      ],
    });

    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: tagSchema,
      })
        .exec(internalTranferPlugin)
        .exec(plainTransferPlugin, {
          voidToString: (node) => node.label,
        })
        .exec(singlelinePlugin);
      e.on("change", () => {
        setDoc(editor.doc);
      });
      return e;
    }, []);

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
              editor.exec(InsertNode, { type: "tag", value, label });
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
          {doc.children.map((t, j) =>
            "text" in t ? (
              t.text || <br />
            ) : (
              <span
                key={j}
                contentEditable={false}
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

    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: imageSchema,
      })
        .exec(internalTranferPlugin)
        .exec(fileTransferPlugin, {
          "image/png": (file) => ({
            type: "image",
            src: URL.createObjectURL(file),
          }),
        })
        .exec(htmlTransferPlugin, {
          serializers: {
            text: (text) => ({ text }),
            img: (e) => {
              return {
                type: "image",
                src: e.src,
              };
            },
          },
        })
        .exec(plainTransferPlugin);
      e.on("change", () => {
        setDoc(e.doc);
      });
      return e;
    }, []);

    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
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
                t.text || <br />
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

    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: videoSchema,
      })
        .exec(internalTranferPlugin)
        .exec(htmlTransferPlugin, {
          serializers: {
            text: (text) => ({ text }),
            video: (e) => {
              return {
                type: "video",
                src: (e.childNodes[0] as HTMLSourceElement).src,
              };
            },
          },
        })
        .exec(plainTransferPlugin);
      e.on("change", () => {
        setDoc(e.doc);
      });
      return e;
    }, []);

    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
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
                t.text || <br />
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

    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: youtubeSchema,
      })
        .exec(internalTranferPlugin)
        .exec(htmlTransferPlugin, {
          serializers: {
            text: (text) => ({ text }),
            iframe: (e) => {
              return {
                type: "youtube",
                id: e.dataset.youtubeId!,
              };
            },
          },
        })
        .exec(plainTransferPlugin);
      e.on("change", () => {
        setDoc(e.doc);
      });
      return e;
    }, []);

    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
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
                "text" in t ? t.text || <br /> : <Youtube key={j} id={t.id} />,
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
};

const rubySchema = v.strictObject({
  children: v.array(
    v.strictObject({
      children: v.array(
        v.union([
          v.strictObject({
            text: v.string(),
          }),
          v.strictObject({
            type: v.literal("ruby"),
            ruby: v.string(),
            value: v.string(),
          }),
        ]),
      ),
    }),
  ),
});

export const Ruby: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);

    type Doc = v.InferOutput<typeof rubySchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [
        {
          children: [
            {
              text: "また",
            },
            {
              type: "ruby",
              ruby: "あした",
              value: "明日",
            },
            {
              text: "お",
            },
            {
              type: "ruby",
              ruby: "あ",
              value: "会",
            },
            {
              text: "いしましょう。",
            },
          ],
        },
      ],
    });

    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: rubySchema,
      }).exec(plainTransferPlugin, {
        voidToString: (n) => n.value,
      });
      e.on("change", () => {
        setDoc(e.doc);
      });
      return e;
    }, []);

    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
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
                  t.text || <br />
                ) : (
                  <ruby key={j} contentEditable={false}>
                    {t.value}
                    <rp>(</rp>
                    <rt>{t.ruby}</rt>
                    <rp>)</rp>
                  </ruby>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
};
