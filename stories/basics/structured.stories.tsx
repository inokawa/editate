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
  internalTranferPlugin,
  htmlTransferPlugin,
  plainTransferPlugin,
  fileTransferPlugin,
  selectionRectPlugin,
  sliceText,
  Delete,
  type Editor,
  getBlockAt,
  LeavesInRange,
  SetVoidAttr,
  getNodeSize,
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
  fontSize: v.optional(v.number()),
  bold: v.optional(v.boolean()),
  italic: v.optional(v.boolean()),
  underline: v.optional(v.boolean()),
  strike: v.optional(v.boolean()),
});

const richBlockSchema = v.strictObject({
  align: v.optional(v.picklist(["left", "right"])),
  indent: v.optional(v.number()),
  children: v.array(richTextSchema),
});

const richSchema = v.strictObject({
  children: v.array(richBlockSchema),
});

type RichDoc = v.InferOutput<typeof richSchema>;

function Indent(editor: Editor<RichDoc>, offset: number = editor.selection[0]) {
  const [block, , path] = getBlockAt(editor.doc, offset);
  editor.apply({
    type: "patch_node",
    path,
    // TODO improve type
    key: "indent",
    value: ((block as v.InferOutput<typeof richBlockSchema>).indent ?? 0) + 1,
  });
}

function Outdent(
  editor: Editor<RichDoc>,
  offset: number = editor.selection[0],
) {
  const [block, , path] = getBlockAt(editor.doc, offset);
  editor.apply({
    type: "patch_node",
    path,
    // TODO improve type
    key: "indent",
    value: Math.max(
      ((block as v.InferOutput<typeof richBlockSchema>).indent ?? 0) - 1,
      0,
    ),
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
                onClick={(e) => {
                  e.preventDefault();
                  const tagIndex = doc.children.indexOf(t);
                  if (tagIndex === -1) return;
                  const value = window.prompt("label:", t.label);
                  if (!value) return;
                  const offset = doc.children
                    .slice(0, tagIndex + 1)
                    .reduce((acc, n) => acc + getNodeSize(n), 0);
                  editor.exec(SetVoidAttr, "label", value, offset);
                }}
                style={{
                  background: "slategray",
                  color: "white",
                  cursor: "pointer",
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
            {
              text: "Hi, ",
            },
            { type: "mention", name: "Captain Gregor" },
            {
              text: " and ",
            },
            { type: "mention", name: "Jaxxon" },
            { text: " . Please enter @ to show suggestions." },
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
        .exec(InsertNode, { type: "mention", name: selected }, start);
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
          v.strictObject({
            type: v.literal("youtube"),
            id: v.string(),
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
        schema: mediaSchema,
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
            video: (e) => {
              return {
                type: "video",
                src: (e.childNodes[0] as HTMLSourceElement).src,
              };
            },
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
          <button
            onClick={() => {
              const value = window.prompt("id:");
              if (!value) return;
              editor.exec(InsertNode, { type: "youtube", id: value });
            }}
          >
            insert youtube
          </button>
        </div>
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
                ) : t.type === "image" ? (
                  <img key={j} src={t.src} style={{ maxWidth: 200 }} />
                ) : t.type === "video" ? (
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
                ) : t.type === "youtube" ? (
                  <iframe
                    data-youtube-id={t.id}
                    width="560"
                    height="315"
                    src={"https://www.youtube.com/embed/" + t.id}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : null,
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
