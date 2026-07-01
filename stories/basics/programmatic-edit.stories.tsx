import React, { useEffect, useRef, useState } from "react";
import type { StoryObj } from "@storybook/react-vite";
import { createPlainEditor, ReplaceText } from "../../src";

export default {
  component: createPlainEditor,
};

/**
 * Repro: a **programmatic edit** (`editor.exec` / `editor.apply`) made while an
 * **IME composition is active** is reverted when the composition ends.
 *
 * editate records DOM mutations during a composition so it can revert the IME's
 * provisional changes at `compositionend`. But a consumer's programmatic edit
 * also mutates the DOM (via the consumer's re-render) mid-composition — that
 * mutation gets caught in the same recording and reverted too, silently
 * dropping the edit and leaving the model and DOM out of sync.
 *
 * Only reproducible with a composing IME (e.g. Android GBoard): a hardware
 * keyboard commits each keystroke, so there is no open composition to fight.
 *
 * The insert is fired from a `setTimeout` (not a button press) on purpose — so
 * it lands while the editor keeps focus and the word is still composing, with
 * no pointer/blur ending the composition first.
 */
export const ProgrammaticEditDuringComposition: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const textRef = useRef("hello world");
    const [text, setText] = useState("hello world");
    const [status, setStatus] = useState("idle — press the button to start");

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const editor = createPlainEditor({
        text: textRef.current,
        onChange: (t) => {
          textRef.current = t;
          setText(t);
        },
      });
      const cleanup = editor.input(el);

      const insert = () => editor.exec(ReplaceText, " [INSERTED] ");
      (window as unknown as { __repro: unknown }).__repro = {
        editor,
        host: el,
        insert,
        dom: () => el.textContent,
        model: () => textRef.current,
      };

      return () => {
        cleanup();
        delete (window as unknown as { __repro?: unknown }).__repro;
      };
    }, []);

    const schedule = () => {
      setStatus("⏳ 3s — tap into the editor and type a word, leave it underlined");
      setTimeout(() => {
        (window as unknown as { __repro: { insert(): void } }).__repro.insert();
        setStatus("✅ inserted ' [INSERTED] ' — now tap elsewhere to commit the word");
      }, 3000);
    };

    return (
      <div style={{ fontFamily: "sans-serif", maxWidth: 640, padding: 8 }}>
        <ol style={{ fontSize: 14, lineHeight: 1.5 }}>
          <li>
            On an <b>Android</b> device (GBoard).
          </li>
          <li>
            Press <b>Schedule insert</b>.
          </li>
          <li>
            Within 3s, tap into the editor and type a word, leaving it{" "}
            <b>composing</b> (underlined — no space).
          </li>
          <li>
            At 3s, <code>[INSERTED]</code> is inserted programmatically — you'll
            see it appear.
          </li>
          <li>
            Now <b>tap elsewhere</b> to commit the composing word.
          </li>
        </ol>
        <p style={{ fontSize: 14 }}>
          <b>Expected:</b> <code>[INSERTED]</code> stays. <b>Bug:</b> it's
          reverted at <code>compositionend</code> — gone from the editor, but
          still in the model (they desync).
        </p>
        <button
          onClick={schedule}
          style={{ fontSize: 16, padding: "8px 14px", marginBottom: 8 }}
        >
          Schedule insert (3s)
        </button>
        <div
          ref={ref}
          style={{
            backgroundColor: "white",
            border: "solid 1px darkgray",
            padding: 8,
            minHeight: 60,
            fontSize: 22,
          }}
        >
          {text.split("\n").map((r, i) => (
            <div key={i}>{r ? r : <br />}</div>
          ))}
        </div>
        <pre style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>{status}</pre>
        <pre style={{ fontSize: 13 }}>model text: {JSON.stringify(text)}</pre>
      </div>
    );
  },
};
