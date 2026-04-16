import React, { useEffect, useMemo, useRef, useState } from "react";
import type { StoryObj } from "@storybook/react-vite";
import { Delete, createPlainEditor, InsertText } from "../../src";

export default {
  component: createPlainEditor,
};

export const Empty: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState("");

    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text: text,
        onChange: setText,
      }).input(ref.current);
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
        {text.split("\n").map((r, i) => (
          <div key={i}>{r ? r : <br />}</div>
        ))}
      </div>
    );
  },
};

export const Multiline: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState("Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text: text,
        onChange: setText,
      }).input(ref.current);
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
        {text.split("\n").map((r, i) => (
          <div key={i}>{r ? r : <br />}</div>
        ))}
      </div>
    );
  },
};

export const Singleline: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState("Hello world.");
    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text: text,
        singleline: true,
        onChange: setText,
      }).input(ref.current);
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
        {text ? text : <br />}
      </div>
    );
  },
};

export const Readonly: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState(`Hello world.`);
    const editor = useMemo(
      () =>
        createPlainEditor({
          text: text,
          singleline: true,
          onChange: setText,
        }),
      [],
    );
    const [readonly, setReadonly] = useState(editor.readonly);
    useEffect(() => {
      if (!ref.current) return;
      const cleanupInput = editor.input(ref.current);
      const cleanupOnReadonly = editor.on("readonly", () => {
        setReadonly(editor.readonly);
      });
      return () => {
        cleanupInput();
        cleanupOnReadonly();
      };
    }, []);
    return (
      <div>
        <div>
          <button
            onClick={() => {
              editor.readonly = !readonly;
            }}
          >
            {readonly ? "editable" : "readonly"}
          </button>
        </div>
        <div
          ref={ref}
          style={{
            background: "white",
            color: readonly ? "gray" : undefined,
          }}
        >
          {text ? text : <br />}
        </div>
      </div>
    );
  },
};

export const Placeholder: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState("");
    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text: text,
        singleline: true,
        onChange: setText,
      }).input(ref.current);
    }, []);
    return (
      <>
        <div
          ref={ref}
          style={{
            backgroundColor: "white",
            border: "solid 1px darkgray",
            padding: 8,
          }}
          aria-placeholder="Enter some text..."
        >
          {text}
        </div>
        <style>{`
[contenteditable]:empty:before {
  content: attr(aria-placeholder) / "";
  pointer-events: none;
  color: gray;
}
`}</style>
      </>
    );
  },
};

export const Highlight: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    );
    const [searchText, setSearchText] = useState("dolor");

    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text: text,
        onChange: setText,
      }).input(ref.current);
    }, []);

    const reg = searchText ? new RegExp(`(${searchText})`) : null;

    return (
      <div>
        <div>
          <label htmlFor="search">search word</label>
          <input
            name="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div ref={ref} style={{ background: "white" }}>
          {text.split("\n").map((r, i) => (
            <div key={i}>
              {r ? (
                (reg ? r.split(reg) : [r]).map((t, j) =>
                  t === searchText ? (
                    <mark key={j}>{t}</mark>
                  ) : (
                    <span key={j}>{t}</span>
                  ),
                )
              ) : (
                <br />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export const Command: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState("Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
    const editor = useMemo(
      () =>
        createPlainEditor({
          text: text,
          onChange: setText,
        }),
      [],
    );
    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);

    const [insertText, setInsertText] = useState("text");

    return (
      <div>
        <div style={{ padding: 4 }}>
          <div>
            <input
              value={insertText}
              onChange={(e) => {
                setInsertText(e.target.value);
              }}
            />
            <button
              onClick={() => {
                editor.apply(InsertText, insertText);
              }}
            >
              insert
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                editor.apply(Delete);
              }}
            >
              delete selection
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                document.getSelection()?.modify("move", "forward", "character");
                ref.current?.focus();
              }}
            >
              move forward
            </button>
            <button
              onClick={() => {
                document
                  .getSelection()
                  ?.modify("move", "backward", "character");
                ref.current?.focus();
              }}
            >
              move backward
            </button>
            <button
              onClick={() => {
                document
                  .getSelection()
                  ?.modify("extend", "forward", "character");
                ref.current?.focus();
              }}
            >
              move focus forward
            </button>
            <button
              onClick={() => {
                document
                  .getSelection()
                  ?.modify("extend", "backward", "character");
                ref.current?.focus();
              }}
            >
              move focus backward
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
          {text.split("\n").map((r, i) => (
            <div key={i}>{r ? r : <br />}</div>
          ))}
        </div>
      </div>
    );
  },
};

export const SpanAsBlock: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState("Hello world.\nこんにちは。\n👍❤️🧑‍🧑‍🧒");
    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text: text,
        isBlock: (node) => !!node.dataset.line,
        onChange: setText,
      }).input(ref.current);
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
        {text.split("\n").map((r, i) => (
          <span key={i} data-line style={{ display: "block" }}>
            {r ? r : <br />}
          </span>
        ))}
      </div>
    );
  },
};

export const Rtl: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState(`אחד !
two !
שְׁלוֹשָׁה !`);
    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text: text,
        onChange: setText,
      }).input(ref.current);
    }, []);
    return (
      <div
        ref={ref}
        style={{
          direction: "rtl",
          background: "white",
        }}
      >
        {text.split("\n").map((r, i) => (
          <div key={i}>{r ? r : <br />}</div>
        ))}
      </div>
    );
  },
};

export const Vertical: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] =
      useState(`春は、あけぼの。やうやうしろくなりゆく山ぎは、すこし明かりて、紫だちたる雲の、細くたなびきたる。
夏は、夜。月のころはさらなり。闇もなほ、蛍の多く飛びちがひたる。また、ただ一つ二つなど、ほのかにうち光りて行くも、をかし。雨など降るも、をかし。
秋は、夕暮。夕日のさして、山の端いと近うなりたるに、烏の寝どころへ行くとて、三つ四つ、二つ三つなど、飛びいそぐさへあはれなり。まいて、雁などのつらねたるが、いと小さく見ゆるは、いとをかし。日入りはてて、風の音、虫の音など、はた、言ふべきにあらず。
冬は、つとめて。雪の降りたるは、言ふべきにもあらず。霜のいと白きも。またさらでも、いと寒きに、火など急ぎおこして、炭持てわたるも、いとつきづきし。昼になりて、ぬるくゆるびもていけば、火桶の火も、白き灰がちになりて、わろし。`);
    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text: text,
        onChange: setText,
      }).input(ref.current);
    }, []);
    return (
      <div
        ref={ref}
        style={{
          writingMode: "vertical-rl",
          background: "white",
          height: 400,
        }}
      >
        {text.split("\n").map((r, i) => (
          <div key={i}>{r ? r : <br />}</div>
        ))}
      </div>
    );
  },
};
