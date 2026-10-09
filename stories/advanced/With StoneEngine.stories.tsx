import type { StoryObj } from "@storybook/react-vite";
import React, { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  FULL_WIDTH_VERTICAL_FEATURE_SETTINGS,
  getSharedCanvasMeasurer,
  layoutText,
  VERTICAL_FEATURE_SETTINGS,
  type StoneContext,
  type StoneOptions,
} from "@non-standardworld/stone-engine.js";
import { createPlainEditor, scrollToSelectionPlugin } from "../../src";

const FONT_SIZE = 20;
const LINE_HEIGHT_SCALE = 1.8;
// height of the columns in vertical writing, width of the lines in horizontal writing
const MEASURE = 480;

type Span = {
  text: string;
  style: CSSProperties;
};
type Line = {
  line: number;
  spans: Span[];
};
type Paragraph = Line[];

// Each line of the layout becomes a block span that never wraps
// margin-inline-start moves a run from where the browser's pen would be to where the layout put it, so a span is needed only where that gap, the font or the glyph form changes
const project = (ctx: StoneContext): Paragraph[] => {
  const vertical = ctx.direction === "tbRl";
  const size = ctx.adjustFontSize;
  const fm = ctx.fontManager;

  const naturalAdvance = (runId: number): number => {
    const run = ctx.runs[runId]!;
    if (!vertical || ctx.isClockwise(run)) return run.advance;
    return fm.scaledSize(run.fontId, size);
  };
  // inline position of the glyph origin in the layout
  const penStart = (runId: number): number => {
    const run = ctx.runs[runId]!;
    if (!vertical) return run.position.x;
    if (ctx.isClockwise(run)) return run.position.y;
    return (
      run.position.y -
      (fm.scaledSize(run.fontId, size) - fm.descent(run.fontId, size))
    );
  };

  const paragraphs: Paragraph[] = [];
  let paragraph: Paragraph = [];
  let line: Line | null = null;
  let span: Span | null = null;
  let spanKey = "";
  let prevRun = -1;

  for (let id = 0; id < ctx.runs.length; id++) {
    const run = ctx.runs[id]!;
    if (run.isNewline) {
      if (!paragraph.length) paragraph.push({ line: run.line, spans: [] });
      paragraphs.push(paragraph);
      paragraph = [];
      line = null;
      span = null;
      continue;
    }
    if (!line || line.line !== run.line) {
      line = { line: run.line, spans: [] };
      paragraph.push(line);
      span = null;
      prevRun = -1;
    }
    const tcy = ctx.isTateChuYoko(run);
    const delta =
      tcy && run.tokenRunIndex > 0
        ? 0
        : penStart(id) -
          (prevRun < 0 ? 0 : penStart(prevRun) + naturalAdvance(prevRun));
    const clockwise = ctx.isClockwise(run);
    const fullWidth = ctx.usesFullWidthGlyph(run);
    const key = `${run.fontId}/${tcy ? run.tokenId : ""}/${clockwise}/${fullWidth}`;
    if (!span || key !== spanKey || Math.abs(delta) > 0.01) {
      const font = fm.font(run.fontId);
      span = {
        text: "",
        style: {
          fontFamily: font.family,
          fontSize: fm.scaledSize(run.fontId, size),
          fontWeight: font.weight,
          fontStyle: font.style,
          fontFeatureSettings: fullWidth
            ? FULL_WIDTH_VERTICAL_FEATURE_SETTINGS
            : ctx.usesVerticalGlyph(run)
              ? VERTICAL_FEATURE_SETTINGS
              : undefined,
          textOrientation: !vertical
            ? undefined
            : clockwise
              ? "sideways"
              : "upright",
          textCombineUpright: tcy ? "all" : undefined,
          marginInlineStart: Math.abs(delta) > 0.01 ? delta : undefined,
        },
      };
      line.spans.push(span);
      spanKey = key;
    }
    span.text += run.char;
    // the combined digits are one glyph for the pen
    if (!tcy || run.tokenRunIndex === 0) prevRun = id;
  }
  if (!paragraph.length) {
    paragraph.push({ line: Math.max(ctx.lineCount - 1, 0), spans: [] });
  }
  paragraphs.push(paragraph);
  return paragraphs;
};

export default {
  component: createPlainEditor,
};

export const WithStoneEngine: StoryObj = {
  render: () => {
    const [text, setText] =
      useState(`春は、あけぼの。やうやうしろくなりゆく山ぎは、すこし明かりて、紫だちたる雲の、細くたなびきたる。
夏は、夜。月のころはさらなり。闇もなほ、蛍の多く飛びちがひたる。また、ただ一つ二つなど、ほのかにうち光りて行くも、をかし。雨など降るも、をかし。
秋は、夕暮。夕日のさして、山の端いと近うなりたるに、烏の寝どころへ行くとて、三つ四つ、二つ三つなど、飛びいそぐさへあはれなり。まいて、雁などのつらねたるが、いと小さく見ゆるは、いとをかし。日入りはてて、風の音、虫の音など、はた、言ふべきにあらず。
冬は、つとめて。雪の降りたるは、言ふべきにもあらず。霜のいと白きも。またさらでも、いと寒きに、火など急ぎおこして、炭持てわたるも、いとつきづきし。昼になりて、ぬるくゆるびもていけば、火桶の火も、白き灰がちになりて、わろし。`);
    const [direction, setDirection] =
      useState<NonNullable<StoneOptions["direction"]>>("tbRl");
    const [textAlign, setTextAlign] =
      useState<NonNullable<StoneOptions["textAlign"]>>("leading");
    const [punctuationMode, setPunctuationMode] =
      useState<NonNullable<StoneOptions["punctuationMode"]>>("stone");
    const [kinsoku, setKinsoku] = useState(true);
    const [dividesByWords, setDividesByWords] = useState(true);

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text,
        onChange: setText,
      })
        .exec(scrollToSelectionPlugin)
        .input(ref.current);
    }, []);

    const vertical = direction === "tbRl";
    const layout = layoutText(
      text,
      {
        fontSize: FONT_SIZE,
        lineHeightScale: LINE_HEIGHT_SCALE,
        direction,
        textAlign,
        punctuationMode,
        kinsoku,
        dividesByWords,
      },
      getSharedCanvasMeasurer()!,
      vertical ? { height: MEASURE } : { width: MEASURE },
    );
    const paragraphs = project(layout);
    const size = layout.adjustFontSize;
    const japaneseFont = layout.fonts.find((f) => f.script === "japanese")!;

    // block-axis start of a line, from the right in vertical writing
    const blockStart = (line: number): number => {
      const frame = layout.firstRunFrame(line);
      return vertical ? layout.renderedSize.width - frame.x - size : frame.y;
    };
    const lineStyle = (line: number): CSSProperties => ({
      display: "block",
      // never wrap, and keep the spaces the layout left at line ends
      whiteSpace: "pre",
      lineHeight: `${size}px`,
      blockSize: size,
      marginBlockStart:
        line === 0
          ? blockStart(0) || undefined
          : blockStart(line) - blockStart(line - 1) - size,
    });

    return (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: 4,
            paddingBottom: 8,
          }}
        >
          <select
            value={direction}
            onChange={(e) => {
              setDirection(e.target.value as typeof direction);
            }}
          >
            <option value="tbRl">vertical</option>
            <option value="lrTb">horizontal</option>
          </select>
          <select
            value={textAlign}
            onChange={(e) => {
              setTextAlign(e.target.value as typeof textAlign);
            }}
          >
            <option value="leading">leading</option>
            <option value="center">center</option>
            <option value="trailing">trailing</option>
            <option value="justify">justify</option>
          </select>
          <select
            value={punctuationMode}
            onChange={(e) => {
              setPunctuationMode(e.target.value as typeof punctuationMode);
            }}
          >
            <option value="stone">punctuation: stone</option>
            <option value="whole">punctuation: whole</option>
            <option value="half">punctuation: half</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={kinsoku}
              onChange={(e) => {
                setKinsoku(e.target.checked);
              }}
            />
            kinsoku
          </label>
          <label>
            <input
              type="checkbox"
              checked={dividesByWords}
              onChange={(e) => {
                setDividesByWords(e.target.checked);
              }}
            />
            divide by words
          </label>
        </div>
        <div
          style={{
            // the columns start at the right edge and overflow to the left
            writingMode: vertical ? "vertical-rl" : undefined,
            width: "100%",
            boxSizing: "border-box",
            overflow: "auto",
            border: "solid 1px darkgray",
            background: "white",
            padding: 8,
            maxHeight: vertical ? undefined : 480,
          }}
        >
          <div
            ref={ref}
            style={{
              outline: "none",
              // the strut must match the layout's font, or the line boxes grow past the line height
              fontFamily: japaneseFont.family,
              fontSize: size,
              // the layout decides all spacing, so the browser's kerning, punctuation trimming and autospacing are off
              fontKerning: "none",
              fontVariantLigatures: "none",
              textSpacingTrim: "space-all",
              textAutospace: "no-autospace",
              inlineSize: MEASURE,
            }}
          >
            {paragraphs.map((lines, i) => (
              <div key={i}>
                {lines.map(({ line, spans }, j) => (
                  <span key={j} style={lineStyle(line)}>
                    {spans.length ? (
                      spans.map((s, k) => (
                        <span key={k} style={s.style}>
                          {s.text}
                        </span>
                      ))
                    ) : (
                      <br />
                    )}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};
