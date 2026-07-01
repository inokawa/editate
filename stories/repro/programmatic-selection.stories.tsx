import React, { useEffect, useRef, useState } from "react";
import type { StoryObj } from "@storybook/react-vite";
import { createPlainEditor } from "../../src";

export default {
  component: createPlainEditor,
};

/**
 * Repro: `editor.selection = …` updates the model but not the DOM caret.
 *
 * The public selection setter runs `updateSelection` (model + a `selectionchange`
 * event) but never `setSelectionToDOM` — that only fires from the MutationObserver
 * and `flushInput` paths. So a programmatic selection never moves the visible
 * caret; editate re-syncs its model back from the DOM on the next real
 * selectionchange, silently discarding the programmatic value.
 *
 * Not iOS-specific — reproduces in every browser. Click a button and compare the
 * "model" readout (updates) to the "DOM caret" readout (doesn't move).
 */
export const Repro: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const editorRef = useRef<ReturnType<typeof createPlainEditor>>(null);
    const [text, setText] = useState("Hello world");
    const [model, setModel] = useState<readonly [number, number]>([0, 0]);
    const [domCaret, setDomCaret] = useState<string>("none");

    // Map a DOM (node, offset) to a global plain-text offset within the host.
    const readDomCaret = () => {
      const host = ref.current;
      const s = document.getSelection();
      if (!host || !s || !s.focusNode || !host.contains(s.focusNode)) {
        setDomCaret("none");
        return;
      }
      const r = document.createRange();
      r.selectNodeContents(host);
      try {
        r.setEnd(s.focusNode, s.focusOffset);
        setDomCaret(String(r.toString().length));
      } catch {
        setDomCaret("?");
      }
    };

    useEffect(() => {
      if (!ref.current) return;
      const editor = createPlainEditor({ text, onChange: setText });
      editorRef.current = editor;
      const offSel = editor.on("selectionchange", () =>
        setModel(editor.selection),
      );
      const onDomSel = () => readDomCaret();
      document.addEventListener("selectionchange", onDomSel);
      const cleanup = editor.input(ref.current);
      return () => {
        offSel();
        document.removeEventListener("selectionchange", onDomSel);
        cleanup();
      };
    }, []);

    const set = (start: number, end = start) => {
      ref.current?.focus();
      editorRef.current!.selection = [start, end];
      requestAnimationFrame(readDomCaret);
    };

    const collapsed = model[0] === model[1];
    const diverged =
      collapsed && domCaret !== "none" && domCaret !== String(model[0]);

    return (
      <div style={{ fontFamily: "sans-serif", maxWidth: 600 }}>
        <p>
          Click a button: the <b>model</b> updates, but the <b>DOM caret</b>{" "}
          doesn&apos;t move.
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button data-testid="set-3" onClick={() => set(3)}>
            set selection → [3, 3]
          </button>
          <button data-testid="set-0-5" onClick={() => set(0, 5)}>
            set selection → [0, 5]
          </button>
          <button data-testid="set-end" onClick={() => set(text.length)}>
            set selection → end
          </button>
        </div>
        <div
          ref={ref}
          style={{
            backgroundColor: "white",
            border: "solid 1px darkgray",
            padding: 8,
            minHeight: 48,
            fontSize: 20,
          }}
        >
          {text.split("\n").map((r, i) => (
            <div key={i}>{r ? r : <br />}</div>
          ))}
        </div>
        <pre style={{ fontSize: 14 }}>
          model selection:{" "}
          <span data-testid="model">{JSON.stringify(model)}</span>
          {"\n"}DOM caret: <span data-testid="dom-caret">{domCaret}</span>
          {"\n"}
          {"\n"}
          <b>
            {diverged ? "❌ model and DOM caret diverge — bug reproduced" : ""}
          </b>
        </pre>
      </div>
    );
  },
};
