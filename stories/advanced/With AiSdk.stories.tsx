import type { StoryObj } from "@storybook/react-vite";
import React, {
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { simulateReadableStream, streamText } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import type { LanguageModelV4StreamPart } from "@ai-sdk/provider";
import {
  createPlainEditor,
  InsertText,
  mapPosition,
  sliceText,
  type Editor,
} from "../../src";

export default {
  component: createPlainEditor,
};

let responseIndex = 0;

const RESPONSES = [
  "Writing is mostly a matter of showing up. What you manage to put down on any particular morning matters far less than the habit of coming back to the page, and the drafts that feel worthless at the time are usually the ones quietly working out what you actually think.",
  "A few things that help when a draft stalls:\n1. Lower the stakes and write the version nobody will read.\n2. Start in the middle, where you already know what happens.\n3. Leave a sentence unfinished at the end of the day, so tomorrow has something to hold on to.\nNone of this is original advice, but it works more often than waiting for the right mood.",
  "By the end of the week the piece had found its shape, though not the one I had planned for it. The opening I was most proud of turned out to be scaffolding, and taking it out made everything after it easier to read.",
];

const streamAiCompletion = (
  prompt: string,
  signal?: AbortSignal,
): AsyncIterable<string> => {
  return streamText({
    model: new MockLanguageModelV4({
      doStream: async () => ({
        stream: simulateReadableStream<LanguageModelV4StreamPart>({
          initialDelayInMs: 800,
          chunkDelayInMs: 50,
          chunks: [
            { type: "stream-start", warnings: [] },
            { type: "text-start", id: "0" },
            ...(
              RESPONSES[responseIndex++ % RESPONSES.length]!.match(/\S+\s*/g) ??
              []
            ).map((delta): LanguageModelV4StreamPart => ({
              type: "text-delta",
              id: "0",
              delta,
            })),
            { type: "text-end", id: "0" },
            {
              type: "finish",
              finishReason: { unified: "stop", raw: undefined },
              usage: {
                inputTokens: {
                  total: undefined,
                  noCache: undefined,
                  cacheRead: undefined,
                  cacheWrite: undefined,
                },
                outputTokens: {
                  total: undefined,
                  text: undefined,
                  reasoning: undefined,
                },
              },
            },
          ],
        }),
      }),
    }),
    prompt,
    abortSignal: signal,
  }).textStream;
};

/**
 * Insert a text stream into the editor at the given offset.
 * The insertion range is remapped against every operation with an apply hook,
 * so the user can keep editing the document while streaming.
 * The range is kept for each document, since a transaction may be discarded after the hook, which restores the document before it.
 */
const insertTextStream = async (
  editor: Editor,
  stream: AsyncIterable<string>,
  at: number,
  onRangeChange: (range: [number, number] | null) => void,
): Promise<void> => {
  const ranges = new WeakMap<Editor["doc"], [number, number]>([
    [editor.doc, [at, at]],
  ]);
  const unhook = editor.hook("apply", (op, next) => {
    const doc = editor.doc;
    const applied = next(op);
    const range = ranges.get(doc);
    if (applied && range && doc !== editor.doc) {
      ranges.set(editor.doc, [
        mapPosition(range[0], applied, true),
        mapPosition(range[1], applied),
      ]);
    }
  });
  const unsubscribe = editor.on("change", () => {
    onRangeChange(ranges.get(editor.doc)!);
  });
  try {
    for await (const delta of stream) {
      editor.exec(InsertText, delta, ranges.get(editor.doc)![1]);
    }
  } finally {
    unsubscribe();
    unhook();
    onRangeChange(null);
  }
};

const INITIAL_TEXT =
  "On Keeping a Notebook\n\nI started carrying a notebook the winter I moved, mostly because the days had begun to blur together and I wanted some proof that they had happened at all. Nothing in it was meant for anyone else.\n\nPlace the caret anywhere in this draft and press Continue writing. You can keep typing while the response streams in.\n";

export const WithAiSdk: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState(INITIAL_TEXT);
    const [aiRange, setAiRange] = useState<[number, number] | null>(null);
    const [streaming, setStreaming] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    const editor = useMemo(
      () => createPlainEditor({ text: INITIAL_TEXT, onChange: setText }),
      [],
    );

    useEffect(() => {
      if (!ref.current) return;
      const cleanup = editor.input(ref.current);
      return () => {
        abortRef.current?.abort();
        cleanup();
      };
    }, []);

    const rows: ReactNode[] = [];
    let offset = 0;
    text.split("\n").forEach((line, i) => {
      const lineStart = offset;
      offset += line.length + 1;
      let content: ReactNode = line;
      if (aiRange) {
        const start = Math.max(aiRange[0] - lineStart, 0);
        const end = Math.min(aiRange[1] - lineStart, line.length);
        if (start < end) {
          content = (
            <>
              {line.slice(0, start)}
              <span style={{ backgroundColor: "#e0edff" }}>
                {line.slice(start, end)}
              </span>
              {line.slice(end)}
            </>
          );
        }
      }
      rows.push(<div key={i}>{line ? content : <br />}</div>);
    });

    return (
      <div>
        <div
          style={{
            marginBottom: 8,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          {streaming ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                abortRef.current?.abort();
              }}
            >
              ⏹ Stop
            </button>
          ) : (
            <button
              onClick={async (e) => {
                e.preventDefault();
                const caret = Math.min(...editor.selection);
                const controller = new AbortController();
                abortRef.current = controller;
                setStreaming(true);
                try {
                  await insertTextStream(
                    editor,
                    streamAiCompletion(
                      sliceText(editor.doc, 0, caret),
                      controller.signal,
                    ),
                    caret,
                    setAiRange,
                  );
                } finally {
                  abortRef.current = null;
                  setStreaming(false);
                }
              }}
            >
              ✨ Continue writing
            </button>
          )}
        </div>
        <div
          ref={ref}
          style={{
            backgroundColor: "white",
            border: "solid 1px darkgray",
            padding: 8,
          }}
        >
          {rows}
        </div>
      </div>
    );
  },
};
