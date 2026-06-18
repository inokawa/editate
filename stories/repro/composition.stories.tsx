import React, { useEffect, useRef, useState } from "react";
import type { StoryObj } from "@storybook/react-vite";
import { createPlainEditor } from "../../src";

export default {
  component: createPlainEditor,
};

/**
 * Repro: a pointer tap that ends an IME composition is discarded.
 *
 * When a word is still composing (e.g. Android GBoard keeps it underlined until
 * you commit), tapping elsewhere moves the DOM caret — but `flushInput` reverts
 * the composition and restores the *model* selection, so the caret springs back
 * to where the composition was and the IME re-composes the word. Only
 * reproducible with a composing IME (a hardware keyboard / desktop commits each
 * keystroke, so there is no open composition to fight).
 *
 * The `editor.selection` readout below ends at the sprung-back position, not
 * where you tapped.
 */
export const TapDuringCompositionResetsCaret: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState(
      "Type a word in the middle, then tap here.",
    );
    const [selection, setSelection] = useState<readonly [number, number]>([
      0, 0,
    ]);

    useEffect(() => {
      if (!ref.current) return;
      const editor = createPlainEditor({ text, onChange: setText });
      const offSelection = editor.on("selectionchange", () => {
        setSelection(editor.selection);
      });
      const cleanup = editor.input(ref.current);
      return () => {
        offSelection();
        cleanup();
      };
    }, []);

    return (
      <div style={{ fontFamily: "sans-serif", maxWidth: 600 }}>
        <ol>
          <li>
            Open this story on an <b>Android</b> device (GBoard or another
            composing IME).
          </li>
          <li>Put the caret somewhere in the middle of the line.</li>
          <li>
            Type a few letters but do <b>not</b> press space or accept a
            suggestion — leave the word <b>composing</b> (underlined).
          </li>
          <li>
            <b>Tap at the end</b> of the line to move the caret there.
          </li>
        </ol>
        <p>
          <b>Expected:</b> the caret stays where you tapped.
          <br />
          <b>Bug:</b> the caret springs back to the composing word and the IME
          re-composes it.
        </p>
        <div
          ref={ref}
          style={{
            backgroundColor: "white",
            border: "solid 1px darkgray",
            padding: 8,
            minHeight: 96,
            fontSize: 20,
          }}
        >
          {text.split("\n").map((r, i) => (
            <div key={i}>{r ? r : <br />}</div>
          ))}
        </div>
        <pre>editor.selection: {JSON.stringify(selection)}</pre>
      </div>
    );
  },
};
