import React, { useEffect, useRef, useState } from "react";
import type { StoryObj } from "@storybook/react-vite";
import { createPlainEditor } from "../../src";

export default {
  component: createPlainEditor,
};

const describe = (n: Node) =>
  n.nodeType === 1 ? `<${(n as Element).tagName.toLowerCase()}>` : n.nodeName;

/**
 * Repro: Backspace in an empty editor on iOS Safari removes the line element.
 *
 * With nothing before the caret, WebKit removes the empty line's `<div>` with a
 * `childList` mutation and fires no cancelable `beforeinput`. The removal is
 * not reverted, so React keeps rendering into the detached node: typed text
 * updates `doc` but never appears on screen.
 */
export const BackspaceInEmptyEditor: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState("");
    const [dom, setDom] = useState("");
    const [log, setLog] = useState<string[]>([]);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const push = (s: string) => setLog((l) => [...l.slice(-11), s]);
      const sync = () => setDom(el.innerHTML);
      sync();

      const mo = new MutationObserver((records) => {
        for (const r of records) {
          if (r.type === "childList" && r.target === el) {
            r.removedNodes.forEach((n) => push(`removed ${describe(n)}`));
            r.addedNodes.forEach((n) => push(`added ${describe(n)}`));
          }
        }
        sync();
      });
      mo.observe(el, { childList: true, subtree: true, characterData: true });
      const onKeyDown = (e: KeyboardEvent) => push(`keydown ${e.key}`);
      const onBeforeInput = (e: InputEvent) =>
        push(`beforeinput ${e.inputType}`);
      const onInput = (e: Event) =>
        push(`input ${(e as InputEvent).inputType}`);
      const onKeyUp = (e: KeyboardEvent) => push(`keyup ${e.key}`);
      el.addEventListener("keydown", onKeyDown);
      el.addEventListener("beforeinput", onBeforeInput);
      el.addEventListener("input", onInput);
      el.addEventListener("keyup", onKeyUp);

      const cleanup = createPlainEditor({ text, onChange: setText }).input(el);
      return () => {
        cleanup();
        mo.disconnect();
        el.removeEventListener("keydown", onKeyDown);
        el.removeEventListener("beforeinput", onBeforeInput);
        el.removeEventListener("input", onInput);
        el.removeEventListener("keyup", onKeyUp);
      };
    }, []);

    return (
      <div style={{ fontFamily: "sans-serif", maxWidth: 600 }}>
        <ol style={{ paddingLeft: 20, margin: "0 0 8px" }}>
          <li>
            Open on <b>iOS Safari</b>.
          </li>
          <li>Tap the empty editor and press Backspace.</li>
          <li>Type a word.</li>
        </ol>
        <div
          ref={ref}
          aria-placeholder="Enter some text..."
          style={{
            backgroundColor: "white",
            border: "solid 1px darkgray",
            padding: 8,
            minHeight: 24,
          }}
        >
          {text.split("\n").map((r, i) => (
            <div key={i}>{r ? r : <br />}</div>
          ))}
        </div>
        <style>{`
[contenteditable]:has(> div:only-child > br:only-child):before,
[contenteditable]:empty:before {
  content: attr(aria-placeholder) / "";
  position: absolute;
  pointer-events: none;
  color: gray;
}
`}</style>
        <pre
          style={{
            fontSize: 12,
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
          doc: {JSON.stringify(text)}
          {"\n"}DOM: {dom || "(empty)"}
          {"\n\n"}
          {log.join("\n")}
        </pre>
      </div>
    );
  },
};
