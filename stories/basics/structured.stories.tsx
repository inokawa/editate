import React, {
  CSSProperties,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import type { StoryObj } from "@storybook/react-vite";
import {
  createEditor,
  Format,
  ToggleFormat,
  singlelinePlugin,
  InsertNode,
  ToggleBlockAttr,
  keymapPlugin,
  internalTransferPlugin,
  htmlTransferPlugin,
  plainTransferPlugin,
  fileTransferPlugin,
  selectionRectPlugin,
  sliceText,
  Delete,
  type Editor,
  getLeafAt,
  getLeafBlockAt,
  LeavesInRange,
  SetVoidAttr,
  getNodeOffset,
  getNodeSize,
  InsertText,
  iterLeaves,
  blockLockPlugin,
} from "../../src";
import * as v from "valibot";
import { createPortal } from "react-dom";

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

export const Empty: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);

    type Doc = v.InferOutput<typeof basicSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [{ children: [{ text: "" }] }],
    });

    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: basicSchema,
      })
        .exec(internalTransferPlugin)
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
  fontSize: v.optional(v.number()),
  bold: v.optional(v.boolean()),
  italic: v.optional(v.boolean()),
  underline: v.optional(v.boolean()),
  strike: v.optional(v.boolean()),
});

const richSchema = v.strictObject({
  children: v.array(
    v.strictObject({
      align: v.optional(v.picklist(["left", "right"])),
      indent: v.optional(v.number()),
      children: v.array(richTextSchema),
    }),
  ),
});

type RichDoc = v.InferOutput<typeof richSchema>;

function Indent(editor: Editor<RichDoc>, offset: number = editor.selection[0]) {
  const [block, , path] = getLeafBlockAt(editor.doc, offset);
  editor.apply({
    type: "patch_node",
    path,
    key: "indent",
    value: (block.indent ?? 0) + 1,
  });
}

function Outdent(
  editor: Editor<RichDoc>,
  offset: number = editor.selection[0],
) {
  const [block, , path] = getLeafBlockAt(editor.doc, offset);
  editor.apply({
    type: "patch_node",
    path,
    key: "indent",
    value: Math.max((block.indent ?? 0) - 1, 0),
  });
}

const defaultFontSize = 10;

const Text = ({ node }: { node: v.InferOutput<typeof richTextSchema> }) => {
  const Element = node.bold ? "strong" : "span";
  const style: CSSProperties = {
    fontSize: `${node.fontSize ?? defaultFontSize}pt`,
  };
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

    const [doc, setDoc] = useState<RichDoc>({
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

    const [menuRect, setMenuRect] = useState<{
      top: number;
      left: number;
    } | null>(null);
    const [currentFontSize, setCurrentFontSize] = useState<
      number | undefined
    >();
    const [currentBold, setCurrentBold] = useState(false);
    const [currentItalic, setCurrentItalic] = useState(false);
    const [currentUnderline, setCurrentUnderline] = useState(false);
    const [currentStrike, setCurrentStrike] = useState(false);

    const setFontSize = (value: number) => {
      editor.exec(Format, "fontSize", value);
    };
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

    const editor = useMemo(() => {
      const updateMenu = () => {
        let fontSizes = new Set<number>();
        let hasBold = false;
        let hasItalic = false;
        let hasUnderline = false;
        let hasStrike = false;
        for (const leaf of editor.exec(LeavesInRange)) {
          if (leaf.fontSize) {
            fontSizes.add(leaf.fontSize);
          } else {
            fontSizes.add(defaultFontSize);
          }
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
        setCurrentFontSize(
          fontSizes.size === 1 ? fontSizes.values().next().value : undefined,
        );
        setCurrentBold(hasBold);
        setCurrentItalic(hasItalic);
        setCurrentUnderline(hasUnderline);
        setCurrentStrike(hasStrike);
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
            setMenuRect((prev) => {
              const rect = getRect();
              if (prev && prev.top === rect.top && prev.left === rect.left) {
                return prev;
              } else {
                return { top: rect.top, left: rect.left };
              }
            });
          } else {
            setMenuRect(null);
          }
        })
        .exec(internalTransferPlugin)
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
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: 4,
            paddingBottom: 8,
          }}
        >
          <div>
            <select
              value={currentFontSize ?? "--"}
              onChange={(e) => {
                e.preventDefault();
                const value = Number(e.target.value);
                if (Number.isNaN(value)) return;
                setFontSize(value);
              }}
            >
              <option value="--">--</option>
              <option value="8">8</option>
              <option value="10">10</option>
              <option value="12">12</option>
              <option value="14">14</option>
              <option value="16">16</option>
              <option value="18">18</option>
              <option value="20">20</option>
            </select>
            <button
              style={{ fontWeight: currentBold ? "bold" : undefined }}
              onClick={toggleBold}
            >
              bold
            </button>
            <button
              style={{ fontWeight: currentItalic ? "bold" : undefined }}
              onClick={toggleItalic}
            >
              italic
            </button>
            <button
              style={{ fontWeight: currentUnderline ? "bold" : undefined }}
              onClick={toggleUnderline}
            >
              underline
            </button>
            <button
              style={{ fontWeight: currentStrike ? "bold" : undefined }}
              onClick={toggleStrike}
            >
              strike
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                editor.exec(ToggleBlockAttr, "align", "right", undefined);
              }}
            >
              align
            </button>
            <button
              onClick={() => {
                editor.exec(Indent);
              }}
            >
              indent
            </button>
            <button
              onClick={() => {
                editor.exec(Outdent);
              }}
            >
              outdent
            </button>
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
            <div
              key={i}
              style={{
                textAlign: b.align,
                textIndent: b.indent ? `${b.indent}em` : undefined,
              }}
            >
              {b.children.map((n, j) => (
                <Text key={j} node={n} />
              ))}
            </div>
          ))}
        </div>
        {menuRect ? (
          <div
            style={{
              position: "fixed",
              top: menuRect.top - 30,
              left: menuRect.left,
              whiteSpace: "nowrap",
            }}
          >
            <button
              style={{ fontWeight: currentBold ? "bold" : undefined }}
              onClick={toggleBold}
            >
              bold
            </button>
            <button
              style={{ fontWeight: currentItalic ? "bold" : undefined }}
              onClick={toggleItalic}
            >
              italic
            </button>
            <button
              style={{ fontWeight: currentUnderline ? "bold" : undefined }}
              onClick={toggleUnderline}
            >
              underline
            </button>
            <button
              style={{ fontWeight: currentStrike ? "bold" : undefined }}
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

const TagRemoveButton = ({
  onClick,
}: {
  onClick: (e: React.MouseEvent) => void;
}) => {
  const [hover, setHover] = useState(false);
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: hover ? "#999" : "#c4c4c4",
        color: "white",
        fontSize: 9,
        lineHeight: 1,
        cursor: "pointer",
      }}
    >
      ✕
    </span>
  );
};

const TagChip = ({
  label,
  onLabelClick,
  onRemove,
}: {
  label: string;
  onLabelClick?: (e: React.MouseEvent) => void;
  onRemove: (e: React.MouseEvent) => void;
}) => {
  return (
    <span
      contentEditable={false}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "#f0f0f0",
        color: "#444",
        border: "solid 1px #ccc",
        fontSize: 12,
        lineHeight: 1.5,
        padding: "1px 4px 1px 8px",
        borderRadius: 999,
        margin: "0 2px",
      }}
    >
      <span
        style={{ cursor: onLabelClick ? "pointer" : undefined }}
        onClick={onLabelClick}
      >
        {label}
      </span>
      <TagRemoveButton onClick={onRemove} />
    </span>
  );
};

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
        .exec(internalTransferPlugin)
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
              <TagChip
                key={j}
                label={t.label}
                onLabelClick={(e) => {
                  e.preventDefault();
                  const start = getNodeOffset(doc, t);
                  if (start == null) return;
                  const value = window.prompt("label:", t.label);
                  if (!value) return;
                  editor.exec(
                    SetVoidAttr,
                    "label",
                    value,
                    start + getNodeSize(t),
                  );
                }}
                onRemove={(e) => {
                  e.preventDefault();
                  const start = getNodeOffset(doc, t);
                  if (start == null) return;
                  editor.exec(Delete, [start, start + getNodeSize(t)]);
                }}
              />
            ),
          )}
        </div>
      </div>
    );
  },
};

const ComboboxMenu = ({
  items,
  index,
  selected,
  onSelect,
}: {
  items: string[];
  index: number;
  selected: ReadonlySet<string>;
  onSelect: (item: string) => void;
}) => {
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (index === -1) return;
    ref.current?.children[index]?.scrollIntoView({ block: "nearest" });
  }, [index]);

  return (
    <ul
      ref={ref}
      style={{
        position: "absolute",
        zIndex: 1,
        top: "100%",
        left: 0,
        right: 0,
        maxHeight: 200,
        overflowY: "auto",
        margin: "2px 0 0",
        padding: 0,
        listStyleType: "none",
        fontSize: 12,
        background: "white",
        border: "solid 1px #ccc",
        borderRadius: 4,
        cursor: "pointer",
      }}
    >
      {items.length ? (
        items.map((item, i) => (
          <li
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "3px 8px",
              ...(index === i && {
                color: "white",
                background: "#2A6AD3",
              }),
            }}
            onMouseDown={(e) => {
              // keep focus in the editor
              e.preventDefault();
              onSelect(item);
            }}
          >
            <span style={{ width: 10 }}>{selected.has(item) ? "✓" : ""}</span>
            {item}
          </li>
        ))
      ) : (
        <li style={{ padding: "3px 8px", color: "#999" }}>No results</li>
      )}
    </ul>
  );
};

// the text just before the caret, which the suggestion is derived from
const getQuery = (
  doc: v.InferOutput<typeof tagSchema>,
  caret: number,
): string => {
  const leaf = getLeafAt(doc, caret, true);
  return leaf && "text" in leaf[0] ? leaf[0].text.slice(0, leaf[1]) : "";
};

export const Combobox: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);

    type Doc = v.InferOutput<typeof tagSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [
        { type: "tag", label: "Luke Skywalker", value: "Luke Skywalker" },
      ],
    });
    const [caret, setCaret] = useState(0);
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(-1);

    const selected = useMemo(
      (): ReadonlySet<string> =>
        new Set(doc.children.flatMap((n) => ("text" in n ? [] : [n.value]))),
      [doc],
    );
    const query = useMemo(() => getQuery(doc, caret), [doc, caret]);
    const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      return q
        ? CHARACTERS.filter((c) => c.toLowerCase().includes(q))
        : CHARACTERS;
    }, [query]);

    if (index > filtered.length - 1) {
      setIndex(-1);
    }

    const toggle = (item: string) => {
      const tag = doc.children.find((n) => !("text" in n) && n.value === item);
      const start = tag && getNodeOffset(doc, tag);
      if (tag && start != null) {
        // remove the tag if it's already inserted
        editor.exec(Delete, [start, start + getNodeSize(tag)]);
      } else {
        // replace the query with the tag
        const start = caret - query.length;
        if (query) {
          editor.exec(Delete, [start, caret]);
        }
        editor.exec(
          InsertNode,
          { type: "tag", label: item, value: item },
          start,
        );
      }
      setOpen(false);
      setIndex(-1);
    };

    const onPrev = useEffectEvent(() => {
      if (!open || !filtered.length) return false;
      setIndex((prev) => (prev <= 0 ? filtered.length - 1 : prev - 1));
    });
    const onNext = useEffectEvent(() => {
      if (!open || !filtered.length) return false;
      setIndex((prev) => (prev >= filtered.length - 1 ? 0 : prev + 1));
    });
    const onComplete = useEffectEvent(() => {
      if (!open || index === -1) return false;
      toggle(filtered[index]!);
    });
    const onClose = useEffectEvent(() => {
      if (!open) return false;
      setOpen(false);
      setIndex(-1);
    });

    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: tagSchema,
      })
        .exec(internalTransferPlugin)
        .exec(plainTransferPlugin, {
          voidToString: (node) => node.label,
        })
        .exec(singlelinePlugin)
        .exec(keymapPlugin, {
          ArrowUp: onPrev,
          ArrowDown: onNext,
          Enter: onComplete,
          Escape: onClose,
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
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);

    return (
      <div
        style={{ position: "relative", width: 320, fontSize: 13 }}
        onBlur={() => {
          setOpen(false);
          setIndex(-1);
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            background: "white",
            border: "solid 1px darkgray",
            borderRadius: 4,
          }}
        >
          <div
            ref={ref}
            style={{
              flex: 1,
              minWidth: 0,
              padding: 6,
              lineHeight: 2,
            }}
          >
            {doc.children.map((t, j) =>
              "text" in t ? (
                t.text || <br />
              ) : (
                <TagChip
                  key={j}
                  label={t.label}
                  onRemove={(e) => {
                    e.preventDefault();
                    toggle(t.value);
                  }}
                />
              ),
            )}
          </div>
          <button
            style={{
              alignSelf: "stretch",
              padding: "0 6px",
              border: "none",
              borderLeft: "solid 1px #ddd",
              background: "transparent",
              cursor: "pointer",
            }}
            onMouseDown={(e) => {
              // keep focus in the editor not to close the menu
              e.preventDefault();
            }}
            onClick={() => {
              ref.current?.focus();
              setOpen((prev) => !prev);
              setIndex(-1);
            }}
          >
            ▾
          </button>
        </div>
        {open && (
          <ComboboxMenu
            items={filtered}
            index={index}
            selected={selected}
            onSelect={toggle}
          />
        )}
      </div>
    );
  },
};

const CHARACTERS = [
  "Aayla Secura",
  "Adi Gallia",
  "Admiral Dodd Rancit",
  "Admiral Firmus Piett",
  "Admiral Gial Ackbar",
  "Admiral Ozzel",
  "Admiral Raddus",
  "Admiral Terrinald Screed",
  "Admiral Trench",
  "Admiral U.O. Statura",
  "Agen Kolar",
  "Agent Kallus",
  "Aiolin and Morit Astarte",
  "Aks Moe",
  "Almec",
  "Alton Kastle",
  "Amee",
  "AP-5",
  "Armitage Hux",
  "Artoo",
  "Arvel Crynyd",
  "Asajj Ventress",
  "Aurra Sing",
  "AZI-3",
  "Bala-Tik",
  "Barada",
  "Bargwill Tomder",
  "Baron Papanoida",
  "Barriss Offee",
  "Baze Malbus",
  "Bazine Netal",
  "BB-8",
  "BB-9E",
  "Ben Quadinaros",
  "Berch Teller",
  "Beru Lars",
  "Bib Fortuna",
  "Biggs Darklighter",
  "Black Krrsantan",
  "Bo-Katan Kryze",
  "Boba Fett",
  "Bobbajo",
  "Bodhi Rook",
  "Borvo the Hutt",
  "Boss Nass",
  "Bossk",
  "Breha Antilles-Organa",
  "Bren Derlin",
  "Brendol Hux",
  "BT-1",
  "C-3PO",
  "C1-10P",
  "Cad Bane",
  "Caluan Ematt",
  "Captain Gregor",
  "Captain Phasma",
  "Captain Quarsh Panaka",
  "Captain Rex",
  "Carlist Rieekan",
  "Casca Panzoro",
  "Cassian Andor",
  "Cassio Tagge",
  "Cham Syndulla",
  "Che Amanwe Papanoida",
  "Chewbacca",
  "Chi Eekway Papanoida",
  "Chief Chirpa",
  "Chirrut Îmwe",
  "Ciena Ree",
  "Cin Drallig",
  "Clegg Holdfast",
  "Cliegg Lars",
  "Coleman Kcaj",
  "Coleman Trebor",
  "Colonel Kaplan",
  "Commander Bly",
  "Commander Cody (CC-2224)",
  "Commander Fil (CC-3714)",
  "Commander Fox",
  "Commander Gree",
  "Commander Jet",
  "Commander Wolffe",
  "Conan Antonio Motti",
  "Conder Kyl",
  "Constable Zuvio",
  "Cordé",
  "Cpatain Typho",
  "Crix Madine",
  "Cut Lawquane",
  "Dak Ralter",
  "Dapp",
  "Darth Bane",
  "Darth Maul",
  "Darth Tyranus",
  "Daultay Dofine",
  "Del Meeko",
  "Delian Mors",
  "Dengar",
  "Depa Billaba",
  "Derek Klivian",
  "Dexter Jettster",
  "Dineé Ellberger",
  "DJ",
  "Doctor Aphra",
  "Doctor Evazan",
  "Dogma",
  "Dormé",
  "Dr. Cylo",
  "Droidbait",
  "Droopy McCool",
  "Dryden Vos",
  "Dud Bolt",
  "Ebe E. Endocott",
  "Echuu Shen-Jon",
  "Eeth Koth",
  "Eighth Brother",
  "Eirtaé",
  "Eli Vanto",
  "Ellé",
  "Ello Asty",
  "Embo",
  "Eneb Ray",
  "Enfys Nest",
  "EV-9D9",
  "Evaan Verlaine",
  "Even Piell",
  "Ezra Bridger",
  "Faro Argyus",
  "Feral",
  "Fifth Brother",
  "Finis Valorum",
  "Finn",
  "Fives",
  "FN-1824",
  "FN-2003",
  "Fodesinbeed Annodue",
  "Fulcrum",
  "FX-7",
  "GA-97",
  "Galen Erso",
  "Gallius Rax",
  'Garazeb "Zeb" Orrelios',
  "Gardulla the Hutt",
  "Garrick Versio",
  "Garven Dreis",
  "Gavyn Sykes",
  "Gideon Hask",
  "Gizor Dellso",
  "Gonk droid",
  "Grand Inquisitor",
  "Greeata Jendowanian",
  "Greedo",
  "Greer Sonnel",
  "Grievous",
  "Grummgar",
  "Gungi",
  "Hammerhead",
  "Han Solo",
  "Harter Kalonia",
  "Has Obbit",
  "Hera Syndulla",
  "Hevy",
  "Hondo Ohnaka",
  "Huyang",
  "Iden Versio",
  "IG-88",
  "Ima-Gun Di",
  "Inquisitors",
  "Inspector Thanoth",
  "Jabba",
  "Jacen Syndulla",
  "Jan Dodonna",
  "Jango Fett",
  "Janus Greejatus",
  "Jar Jar Binks",
  "Jas Emari",
  "Jaxxon",
  "Jek Tono Porkins",
  "Jeremoch Colton",
  "Jira",
  "Jobal Naberrie",
  "Jocasta Nu",
  "Joclad Danva",
  "Joh Yowza",
  "Jom Barell",
  "Joph Seastriker",
  "Jova Tarkin",
  "Jubnuk",
  "Jyn Erso",
  "K-2SO",
  "Kanan Jarrus",
  "Karbin",
  "Karina the Great",
  "Kes Dameron",
  "Ketsu Onyo",
  "Ki-Adi-Mundi",
  "King Katuunko",
  "Kit Fisto",
  "Kitster Banai",
  "Klaatu",
  "Klik-Klak",
  "Korr Sella",
  "Kylo Ren",
  "L3-37",
  "Lama Su",
  "Lando Calrissian",
  "Lanever Villecham",
  "Leia Organa",
  "Letta Turmond",
  "Lieutenant Kaydel Ko Connix",
  "Lieutenant Thire",
  "Lobot",
  "Logray",
  "Lok Durd",
  "Longo Two-Guns",
  "Lor San Tekka",
  "Lorth Needa",
  "Lott Dod",
  "Luke Skywalker",
  "Lumat",
  "Luminara Unduli",
  "Lux Bonteri",
  "Lyn Me",
  "Lyra Erso",
  "Mace Windu",
  "Malakili",
  "Mama the Hutt",
  "Mars Guo",
  "Mas Amedda",
  "Mawhonic",
  "Max Rebo",
  "Maximilian Veers",
  "Maz Kanata",
  "ME-8D9",
  "Meena Tills",
  "Mercurial Swift",
  "Mina Bonteri",
  "Miraj Scintel",
  "Mister Bones",
  "Mod Terrik",
  "Moden Canady",
  "Mon Mothma",
  "Moradmin Bast",
  "Moralo Eval",
  "Morley",
  "Mother Talzin",
  "Nahdar Vebb",
  "Nahdonnis Praji",
  "Nien Nunb",
  "Niima the Hutt",
  "Nines",
  "Norra Wexley",
  "Nute Gunray",
  "Nuvo Vindi",
  "Obi-Wan Kenobi",
  "Odd Ball",
  "Ody Mandrell",
  "Omi",
  "Onaconda Farr",
  "Oola",
  "OOM-9",
  "Oppo Rancisis",
  "Orn Free Taa",
  "Oro Dassyne",
  "Orrimarko",
  "Osi Sobeck",
  "Owen Lars",
  "Pablo-Jill",
  "Padmé Amidala",
  "Pagetti Rook",
  "Paige Tico",
  "Paploo",
  "Petty Officer Thanisson",
  "Pharl McQuarrie",
  "Plo Koon",
  "Po Nudo",
  "Poe Dameron",
  "Poggle the Lesser",
  "Pong Krell",
  "Pooja Naberrie",
  "PZ-4CO",
  "Quarrie",
  "Quay Tolsite",
  "Queen Apailana",
  "Queen Jamillia",
  "Queen Neeyutnee",
  "Qui-Gon Jinn",
  "Quiggold",
  "Quinlan Vos",
  "R2-D2",
  "R2-KT",
  "R3-S6",
  "R4-P17",
  "R5-D4",
  "RA-7",
  "Rabé",
  "Rako Hardeen",
  "Ransolm Casterfo",
  "Rappertunie",
  "Ratts Tyerell",
  "Raymus Antilles",
  "Ree-Yees",
  "Reeve Panzoro",
  "Rey",
  "Ric Olié",
  "Riff Tamson",
  "Riley",
  "Rinnriyin Di",
  "Rio Durant",
  "Rogue Squadron",
  "Romba",
  "Roos Tarpals",
  "Rose Tico",
  "Rotta the Hutt",
  "Rukh",
  "Rune Haako",
  "Rush Clovis",
  "Ruwee Naberrie",
  "Ryoo Naberrie",
  "Sabé",
  "Sabine Wren",
  "Saché",
  "Saelt-Marae",
  "Saesee Tiin",
  "Salacious B. Crumb",
  "San Hill",
  "Sana Starros",
  "Sarco Plank",
  "Sarkli",
  "Satine Kryze",
  "Savage Opress",
  "Sebulba",
  "Senator Organa",
  "Sergeant Kreel",
  "Seventh Sister",
  "Shaak Ti",
  "Shara Bey",
  "Shmi Skywalker",
  "Shu Mai",
  "Sidon Ithano",
  "Sifo-Dyas",
  "Sim Aloo",
  "Siniir Rath Velus",
  "Sio Bibble",
  "Sixth Brother",
  "Slowen Lo",
  "Sly Moore",
  "Snaggletooth",
  "Snap Wexley",
  "Snoke",
  "Sola Naberrie",
  "Sora Bulq",
  "Strono Tuggs",
  "Sy Snootles",
  "Tallissan Lintra",
  "Tarfful",
  "Tasu Leech",
  "Taun We",
  "TC-14",
  "Tee Watt Kaa",
  "Teebo",
  "Teedo",
  "Teemto Pagalies",
  "Temiri Blagg",
  "Tessek",
  "Tey How",
  "Thane Kyrell",
  "The Bendu",
  "The Smuggler",
  "Thrawn",
  "Tiaan Jerjerrod",
  "Tion Medon",
  "Tobias Beckett",
  "Tulon Voidgazer",
  "Tup",
  "U9-C4",
  "Unkar Plutt",
  "Val Beckett",
  "Vanden Willard",
  "Vice Admiral Amilyn Holdo",
  "Vober Dand",
  "WAC-47",
  "Wag Too",
  "Wald",
  "Walrus Man",
  "Warok",
  "Wat Tambor",
  "Watto",
  "Wedge Antilles",
  "Wes Janson",
  "Wicket W. Warrick",
  "Wilhuff Tarkin",
  "Wollivan",
  "Wuher",
  "Wullf Yularen",
  "Xamuel Lennox",
  "Yaddle",
  "Yarael Poof",
  "Yoda",
  "Zam Wesell",
  "Zev Senesca",
  "Ziro the Hutt",
  "Zuckuss",
];

const MAX_LIST_LENGTH = 8;
const MENTION_REG = /\B@([\-+\w]*)$/;

const Menu = ({
  chars,
  index,
  top,
  left,
  complete,
}: {
  chars: string[];
  index: number;
  top: number;
  left: number;
  complete: (index: number) => void;
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: top,
        left: left,
        fontSize: "12px",
        border: "solid 1px gray",
        borderRadius: "3px",
        background: "white",
        cursor: "pointer",
      }}
    >
      {chars.map((c, i) => (
        <div
          key={c}
          style={{
            padding: "4px",
            ...(index === i && {
              color: "white",
              background: "#2A6AD3",
            }),
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            complete(i);
          }}
        >
          {c}
        </div>
      ))}
    </div>
  );
};

const mentionSchema = v.strictObject({
  children: v.array(
    v.strictObject({
      children: v.array(
        v.union([
          v.strictObject({ text: v.string() }),
          v.strictObject({ type: v.literal("mention"), name: v.string() }),
        ]),
      ),
    }),
  ),
});

export const Mention: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    type Doc = v.InferOutput<typeof mentionSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [
        {
          children: [
            { text: "Hi " },
            { type: "mention", name: "Luke Skywalker" },
            { text: " and " },
            { type: "mention", name: "Leia Organa" },
            { text: ", could you check this out? Type @ to mention someone." },
          ],
        },
        { children: [{ text: "" }] },
      ],
    });
    const [pos, setPos] = useState<{
      top: number;
      left: number;
      caret: number;
    } | null>(null);
    const [index, setIndex] = useState<number>(0);

    const match = pos && sliceText(doc, 0, pos.caret).match(MENTION_REG);
    const name = match?.[1] ?? "";
    const filtered = useMemo(
      () =>
        CHARACTERS.filter((c) =>
          c.toLowerCase().startsWith(name.toLowerCase()),
        ).slice(0, MAX_LIST_LENGTH),
      [name],
    );
    const complete = (i: number) => {
      if (!ref.current || !pos) return;
      const selected = filtered[i];
      const start = pos.caret - name.length - 1;
      const end = pos.caret;
      editor
        .exec(Delete, [start, end])
        .exec(InsertNode, { type: "mention", name: selected }, start)
        .exec(InsertText, " ");
      setPos(null);
      setIndex(0);
    };

    const onUp = useEffectEvent(() => {
      if (!pos || !filtered.length) return false;
      setIndex((prev) => (prev <= 0 ? filtered.length - 1 : prev - 1));
    });
    const onDown = useEffectEvent(() => {
      if (!pos || !filtered.length) return false;
      setIndex((prev) => (prev >= filtered.length - 1 ? 0 : prev + 1));
    });
    const onComplete = useEffectEvent(() => {
      if (!pos || !filtered.length) return false;
      complete(index);
    });
    const onClose = useEffectEvent(() => {
      if (!pos || !filtered.length) return false;
      setPos(null);
      setIndex(0);
    });

    const editor = useMemo(() => {
      const e = createEditor({
        doc,
        schema: mentionSchema,
      })
        .exec(plainTransferPlugin, { voidToString: (n) => `@${n.name}` })
        .exec(keymapPlugin, {
          ArrowUp: onUp,
          ArrowDown: onDown,
          Enter: onComplete,
          Escape: onClose,
        })
        .exec(selectionRectPlugin, (getRect) => {
          const selectionStart = Math.min(...editor.selection);
          if (MENTION_REG.test(sliceText(editor.doc, 0, selectionStart))) {
            const r = getRect();
            setPos({
              top: r.top + r.height,
              left: r.left,
              caret: selectionStart,
            });
          } else {
            setPos(null);
          }
          setIndex(0);
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
            border: "solid 1px darkgray",
            padding: 8,
          }}
        >
          {doc.children.map((r, i) => (
            <div key={i}>
              {r.children.map((n, j) =>
                "text" in n ? (
                  n.text || <br />
                ) : (
                  <span
                    key={j}
                    contentEditable={false}
                    style={{
                      background: "#EAF5F9",
                      color: "#4276AA",
                      borderRadius: "3px",
                    }}
                  >
                    @{n.name}
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
        {pos &&
          createPortal(
            <Menu
              top={pos.top}
              left={pos.left}
              chars={filtered}
              index={index}
              complete={complete}
            />,
            document.body,
          )}
      </div>
    );
  },
};

const commentSchema = v.strictObject({
  children: v.array(
    v.strictObject({
      children: v.array(
        v.strictObject({
          text: v.string(),
          comment: v.optional(v.string()),
        }),
      ),
    }),
  ),
});

export const Comment: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);

    const commentIdRef = useRef(0);
    const [comments, setComments] = useState([
      { id: "0", text: "This is comment." },
    ]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [hasSelection, setHasSelection] = useState(false);
    type Doc = v.InferOutput<typeof commentSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [
        {
          children: [
            { text: "Hello " },
            { text: " world", comment: "0" },
            { text: "." },
          ],
        },
        { children: [{ text: "Select text and add comments." }] },
      ],
    });

    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: commentSchema,
      })
        .exec(internalTransferPlugin)
        .exec(plainTransferPlugin);
      e.on("change", () => {
        setDoc(e.doc);
        const ids = new Set<string>();
        for (const [leaf] of iterLeaves(e.doc, [0, getNodeSize(e.doc)])) {
          if (leaf.comment) {
            ids.add(leaf.comment);
          }
        }
        setComments((prev) => prev.filter((c) => ids.has(c.id)));
      });
      e.on("selectionchange", () => {
        setHasSelection(e.selection[0] !== e.selection[1]);
        let active: string | null = null;
        for (const leaf of e.exec(LeavesInRange)) {
          if (leaf.comment) {
            active = leaf.comment;
            break;
          }
        }
        setActiveId(active);
      });
      return e;
    }, []);

    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);

    const inputRef = useRef<HTMLTextAreaElement>(null);

    return (
      <div>
        <div>
          <textarea
            ref={inputRef}
            placeholder="Select text and write comment"
          />
          <button
            disabled={!hasSelection}
            onClick={() => {
              const input = inputRef.current;
              if (!input) return;
              const value = input.value;
              if (!value) return;
              const id = String(++commentIdRef.current);
              editor.exec(Format, "comment", id);
              setComments((prev) => [...prev, { id, text: value }]);
              setActiveId(id);
              input.value = "";
            }}
          >
            Add comment
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <div
            ref={ref}
            style={{
              backgroundColor: "white",
              padding: 8,
              flex: 1,
              minHeight: 120,
            }}
          >
            {doc.children.map((b, i) => (
              <div key={i}>
                {b.children.map((t, j) => (
                  <span
                    key={j}
                    style={{
                      backgroundColor: t.comment
                        ? t.comment === activeId
                          ? "gold"
                          : "khaki"
                        : undefined,
                    }}
                  >
                    {t.text || <br />}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div
            style={{
              width: 200,
              background: "#f5f5f5",
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {comments.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: 8,
                  background: "white",
                  border:
                    c.id === activeId
                      ? "solid 1px orange"
                      : "solid 1px #e0e0e0",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 13,
                }}
                onClick={() => {
                  setActiveId(c.id);
                }}
              >
                <div>{c.text}</div>
                <button
                  style={{ marginTop: 6, fontSize: 11 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const ranges: [number, number][] = [];
                    for (const [leaf, offset] of iterLeaves(editor.doc, [
                      0,
                      getNodeSize(editor.doc),
                    ])) {
                      if (leaf.comment === c.id) {
                        ranges.push([offset, offset + getNodeSize(leaf)]);
                      }
                    }
                    for (const range of ranges) {
                      editor.exec(Format, "comment", undefined, range);
                    }
                  }}
                >
                  delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

const mediaSchema = v.strictObject({
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
          v.strictObject({
            type: v.literal("video"),
            src: v.string(),
          }),
        ]),
      ),
    }),
  ),
});

export const Media: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);

    type Doc = v.InferOutput<typeof mediaSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [
        {
          children: [
            {
              text: "Hello ",
            },
            {
              type: "image",
              src: "https://picsum.photos/seed/1/320/240",
            },
            {
              text: " world ",
            },
            {
              type: "image",
              src: "https://picsum.photos/seed/2/320/240",
            },
          ],
        },
        {
          children: [
            {
              text: "Hello ",
            },
            {
              type: "video",
              src: "https://mdn.github.io/shared-assets/videos/flower.mp4",
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
        schema: mediaSchema,
      })
        .exec(internalTransferPlugin)
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
      <div>
        <div style={{ display: "flex", padding: 4, gap: 4 }}>
          <button
            onClick={() => {
              const value = window.prompt("url:");
              if (!value) return;
              editor.exec(InsertNode, { type: "image", src: value });
            }}
          >
            insert image
          </button>
          <button
            onClick={() => {
              const value = window.prompt("url:");
              if (!value) return;
              editor.exec(InsertNode, { type: "video", src: value });
            }}
          >
            insert video
          </button>
        </div>
        <div
          ref={ref}
          style={{
            backgroundColor: "white",
            padding: 16,
          }}
        >
          {doc.children.map((b, i) => (
            <div key={i}>
              {b.children.map((t, j) =>
                "text" in t ? (
                  t.text || <br />
                ) : t.type === "image" ? (
                  <img
                    key={j}
                    src={t.src}
                    style={{
                      maxWidth: 240,
                      borderRadius: 4,
                      verticalAlign: "middle",
                    }}
                  />
                ) : t.type === "video" ? (
                  // safari needs contentEditable="false"
                  <video
                    key={j}
                    width={320}
                    controls
                    contentEditable="false"
                    suppressContentEditableWarning
                    style={{
                      borderRadius: 4,
                      verticalAlign: "middle",
                    }}
                  >
                    <source src={t.src} />
                  </video>
                ) : null,
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
};

const lockSchema = v.strictObject({
  children: v.array(
    v.strictObject({
      locked: v.optional(v.boolean()),
      children: v.array(
        v.strictObject({
          text: v.string(),
        }),
      ),
    }),
  ),
});

export const BlockLock: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);

    type Doc = v.InferOutput<typeof lockSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [
        { children: [{ text: "You can edit this paragraph." }] },
        {
          locked: true,
          children: [
            {
              text: "This paragraph is locked. You can select and copy it, but can't edit it.",
            },
          ],
        },
        { children: [{ text: "You can edit this paragraph too." }] },
      ],
    });
    const [blockIndex, setBlockIndex] = useState<number | null>(null);

    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: lockSchema,
      })
        .exec(internalTransferPlugin)
        .exec(plainTransferPlugin)
        .exec(blockLockPlugin, { isLocked: (b) => !!b.locked });
      e.on("change", () => {
        setDoc(e.doc);
      });
      e.on("selectionchange", () => {
        setBlockIndex(getLeafBlockAt(e.doc, e.selection[0])[2][0] ?? null);
      });
      return e;
    }, []);

    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);

    const locked = blockIndex != null && !!doc.children[blockIndex]?.locked;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "26px 1fr",
          columnGap: 6,
          rowGap: 8,
          maxWidth: 640,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: 14,
          color: "#1e1e1e",
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 4,
          padding: 16,
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <style>{`
          .lock-toggle:not([aria-pressed="true"]):hover { border-color: #757575; }
        `}</style>
        {blockIndex != null && (
          <button
            className="lock-toggle"
            style={{
              gridColumn: 1,
              gridRow: blockIndex + 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 26,
              height: 26,
              marginTop: 2,
              padding: 0,
              fontSize: 13,
              background: locked ? "#757575" : "#fff",
              border: `1px solid ${locked ? "#757575" : "#ccc"}`,
              borderRadius: 2,
              cursor: "pointer",
            }}
            title={locked ? "Unlock this block" : "Lock this block"}
            aria-pressed={locked}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={() => {
              editor.exec(ToggleBlockAttr, "locked", true, undefined);
            }}
          >
            🔒
          </button>
        )}
        <div
          ref={ref}
          style={{
            gridColumn: 2,
            gridRow: `1 / span ${doc.children.length}`,
            display: "grid",
            gridTemplateRows: "subgrid",
            outline: "none",
          }}
        >
          {doc.children.map((b, i) => (
            <div
              key={i}
              style={{
                padding: "4px 8px",
                borderRadius: 2,
                lineHeight: 1.6,
                ...(b.locked && {
                  background: "#f6f7f7",
                  boxShadow: "inset 0 0 0 1px #ddd",
                }),
                ...(i === blockIndex && {
                  outline: "1.5px solid #007cba",
                  outlineOffset: 1,
                }),
              }}
            >
              {b.children.map((n, j) => (
                <span key={j}>{n.text || <br />}</span>
              ))}
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

const inputSchema = v.strictObject({
  children: v.array(
    v.strictObject({
      children: v.array(
        v.union([
          v.strictObject({
            text: v.string(),
          }),
          v.strictObject({
            type: v.literal("input"),
            value: v.string(),
          }),
        ]),
      ),
    }),
  ),
});

export const Input: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);

    type Doc = v.InferOutput<typeof inputSchema>;
    const [doc, setDoc] = useState<Doc>({
      children: [
        {
          children: [
            {
              text: "Hello ",
            },
            {
              type: "input",
              value: "123",
            },
            {
              text: "world.",
            },
          ],
        },
      ],
    });

    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: inputSchema,
      }).exec(plainTransferPlugin, {
        serializer: (n) => ("text" in n ? n.text : n.value),
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
                  <span key={j}>{t.text || <br />}</span>
                ) : (
                  <input key={j} defaultValue={t.value} />
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
};
