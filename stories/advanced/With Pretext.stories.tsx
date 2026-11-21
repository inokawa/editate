import type { StoryObj } from "@storybook/react-vite";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as v from "valibot";
import { layoutWithLines, prepareWithSegments } from "@chenglou/pretext";
import {
  createEditor,
  internalTransferPlugin,
  plainTransferPlugin,
  scrollToSelectionPlugin,
  nodeIdPlugin,
  NodeId,
  type Editor,
  restoreSelectionPlugin,
} from "../../src";

const FONT_FAMILY = "Arial";
const FONT_SIZE = 16;
const LINE_HEIGHT = 24;
const FONT = `${FONT_SIZE}px ${FONT_FAMILY}`;
const PAGE_GAP = 24;

// paper sizes in CSS px (96dpi)
const PAPER_SIZES = {
  A3: [1123, 1587],
  A4: [794, 1123],
  A5: [559, 794],
  B4: [971, 1376],
  B5: [688, 971],
} as const;

const pagedSchema = v.strictObject({
  pageWidth: v.number(),
  pageHeight: v.number(),
  pageMargin: v.number(),
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

type Doc = v.InferOutput<typeof pagedSchema>;

function SetPageSize(editor: Editor<Doc>, width: number, height: number) {
  editor
    .apply({
      type: "format",
      range: [0, 0],
      key: "pageWidth",
      value: width,
      depth: 0,
    })
    .apply({
      type: "format",
      range: [0, 0],
      key: "pageHeight",
      value: height,
      depth: 0,
    });
}

function SetPageMargin(editor: Editor<Doc>, margin: number) {
  editor.apply({
    type: "format",
    range: [0, 0],
    key: "pageMargin",
    value: margin,
    depth: 0,
  });
}

// a run of lines of a block placed on the same page
type BlockChunk = { text: string; paddingTop: number };

// Lay out blocks into pages line by line with pretext, without touching the
// DOM. Pages are drawn as a layer behind the text and page breaks are
// expressed as paddings of chunk spans, so that blocks are never reparented
// in the DOM. Reparenting the block under the caret would recreate it and
// break selection while typing.
const paginate = (doc: Doc): { blocks: BlockChunk[][]; pageCount: number } => {
  const contentWidth = doc.pageWidth - doc.pageMargin * 2;
  const contentHeight = doc.pageHeight - doc.pageMargin * 2;
  // fill the rest of the previous page, the gap between sheets, and both
  // page margins
  const pageBreakPadding = (usedOnPrevPage: number) =>
    contentHeight - usedOnPrevPage + doc.pageMargin + PAGE_GAP + doc.pageMargin;

  const blocks: BlockChunk[][] = [];
  let used = 0;
  let pageCount = 1;
  for (const b of doc.children) {
    const text = b.children.map((t) => t.text).join("");
    const chunks: BlockChunk[] = [];
    if (!text) {
      if (used && used + LINE_HEIGHT > contentHeight) {
        chunks.push({ text, paddingTop: pageBreakPadding(used) });
        pageCount++;
        used = LINE_HEIGHT;
      } else {
        chunks.push({ text, paddingTop: 0 });
        used += LINE_HEIGHT;
      }
    } else {
      const prepared = prepareWithSegments(text, FONT);
      const { lines } = layoutWithLines(prepared, contentWidth, LINE_HEIGHT);
      const segmentStarts: number[] = [];
      {
        let offset = 0;
        for (const s of prepared.segments) {
          segmentStarts.push(offset);
          offset += s.length;
        }
      }
      // text offset of the start of the line
      const lineStart = (lineIndex: number): number => {
        if (lineIndex >= lines.length) return text.length;
        const cursor = lines[lineIndex]!.start;
        let offset = segmentStarts[cursor.segmentIndex] ?? text.length;
        if (cursor.graphemeIndex > 0) {
          // the line starts in the middle of a segment (e.g. a long word)
          let count = 0;
          for (const g of new Intl.Segmenter().segment(
            prepared.segments[cursor.segmentIndex] ?? "",
          )) {
            if (count >= cursor.graphemeIndex) break;
            offset += g.segment.length;
            count++;
          }
        }
        return offset;
      };
      let lineIndex = 0;
      while (lineIndex < lines.length) {
        let capacity = Math.floor((contentHeight - used) / LINE_HEIGHT);
        let paddingTop = 0;
        if (capacity <= 0) {
          paddingTop = pageBreakPadding(used);
          pageCount++;
          used = 0;
          capacity = Math.max(Math.floor(contentHeight / LINE_HEIGHT), 1);
        }
        const count = Math.min(capacity, lines.length - lineIndex);
        chunks.push({
          text: text.slice(lineStart(lineIndex), lineStart(lineIndex + count)),
          paddingTop,
        });
        used += count * LINE_HEIGHT;
        lineIndex += count;
      }
    }
    blocks.push(chunks);
  }
  return { blocks, pageCount };
};

export default {
  component: createEditor,
};

export const WithPretext: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);

    const [doc, setDoc] = useState<Doc>({
      pageWidth: PAPER_SIZES.A5[0],
      pageHeight: PAPER_SIZES.A5[1],
      // 1 inch, following the default of Word
      pageMargin: 96,
      children: [
        {
          children: [
            {
              text: "This is a tiny paged editor like Google Docs. Paragraphs are laid out into pages, and the page size is stored in the root node of the document.",
            },
          ],
        },
        { children: [{ text: "" }] },
        {
          children: [
            {
              text: "Paragraph heights are measured with pretext, which measures multiline text with the browser's font engine but without DOM reflows. When the content grows beyond the page, following paragraphs are moved to the next page.",
            },
          ],
        },
        { children: [{ text: "" }] },
        {
          children: [
            {
              text: "Try typing more text, pressing Enter, or changing the page size above.",
            },
          ],
        },
        { children: [{ text: "" }] },
        {
          children: [
            {
              text:
                "A paragraph can also break in the middle when it does not fit in the rest of the page. " +
                "The quick brown fox jumps over the lazy dog. ".repeat(24),
            },
          ],
        },
      ],
    });

    const editor = useMemo(() => {
      const e = createEditor({
        doc: doc,
        schema: pagedSchema,
        isBlock: (n) => !!n.dataset.block,
      })
        .exec(scrollToSelectionPlugin)
        .exec(restoreSelectionPlugin)
        .exec(internalTransferPlugin)
        .exec(plainTransferPlugin)
        .exec(nodeIdPlugin);
      e.on("change", () => {
        setDoc(e.doc);
      });
      return e;
    }, []);

    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);

    const { blocks, pageCount } = useMemo(() => paginate(doc), [doc]);

    const paper =
      Object.entries(PAPER_SIZES).find(
        ([, [w, h]]) => w === doc.pageWidth && h === doc.pageHeight,
      )?.[0] ?? "custom";

    return (
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: 8,
            background: "white",
            borderBottom: "solid 1px #ddd",
          }}
        >
          <label>
            paper:{" "}
            <select
              value={paper}
              onChange={(e) => {
                const size =
                  PAPER_SIZES[e.target.value as keyof typeof PAPER_SIZES];
                if (!size) return;
                editor.exec(SetPageSize, size[0], size[1]);
              }}
            >
              {Object.keys(PAPER_SIZES).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
              <option value="custom" hidden>
                Custom
              </option>
            </select>
          </label>
          <label>
            width:{" "}
            <input
              type="number"
              min={200}
              max={2000}
              value={doc.pageWidth}
              style={{ width: 64 }}
              onChange={(e) => {
                const value = e.target.valueAsNumber;
                if (!Number.isFinite(value) || value < 200 || value > 2000) {
                  return;
                }
                editor.exec(SetPageSize, value, doc.pageHeight);
              }}
            />{" "}
            px
          </label>
          <label>
            height:{" "}
            <input
              type="number"
              min={200}
              max={2000}
              value={doc.pageHeight}
              style={{ width: 64 }}
              onChange={(e) => {
                const value = e.target.valueAsNumber;
                if (!Number.isFinite(value) || value < 200 || value > 2000) {
                  return;
                }
                editor.exec(SetPageSize, doc.pageWidth, value);
              }}
            />{" "}
            px
          </label>
          <label>
            margin:{" "}
            <input
              type="number"
              min={0}
              max={200}
              value={doc.pageMargin}
              style={{ width: 64 }}
              onChange={(e) => {
                const value = e.target.valueAsNumber;
                if (!Number.isFinite(value) || value < 0 || value > 200) {
                  return;
                }
                editor.exec(SetPageMargin, value);
              }}
            />{" "}
            px
          </label>
        </div>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            background: "#e8eaed",
            overflow: "auto",
          }}
        >
          <div style={{ width: "fit-content", margin: "0 auto", padding: 24 }}>
            <div
              style={{
                position: "relative",
                width: doc.pageWidth,
                height: pageCount * doc.pageHeight + (pageCount - 1) * PAGE_GAP,
              }}
            >
              <div aria-hidden style={{ position: "absolute", inset: 0 }}>
                {Array.from({ length: pageCount }, (_, i) => (
                  <div
                    key={i}
                    data-sheet
                    style={{
                      position: "absolute",
                      top: i * (doc.pageHeight + PAGE_GAP),
                      width: doc.pageWidth,
                      height: doc.pageHeight,
                      background: "white",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                ))}
              </div>
              <div
                ref={ref}
                style={{
                  position: "relative",
                  outline: "none",
                  padding: `${doc.pageMargin}px ${doc.pageMargin}px 0`,
                  fontFamily: FONT_FAMILY,
                  fontSize: FONT_SIZE,
                  lineHeight: `${LINE_HEIGHT}px`,
                }}
              >
                {doc.children.map((b, i) => (
                  <div key={NodeId(editor, b)} data-block>
                    {blocks[i]!.map((c, j) => (
                      <span
                        key={j}
                        style={{
                          display: "block",
                          paddingTop: c.paddingTop || undefined,
                        }}
                      >
                        {c.text || <br />}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};
