import type { StoryObj } from "@storybook/react-vite";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { createPlainEditor } from "../../src";
import * as linkify from "linkifyjs";

export default {
  component: createPlainEditor,
};

const Link = ({ href, children }: { href: string; children: string }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <a
      ref={ref}
      href={href}
      target="__blank"
      onClick={() => {
        // a tag inside contenteditable doesn't navigate with click
        (ref.current?.cloneNode() as HTMLAnchorElement).click();
      }}
    >
      {children}
    </a>
  );
};

export const WithLinkifyjs: StoryObj = {
  render: () => {
    const [text, setText] = useState(
      `Click this url https://github.com/inokawa/editate !`,
    );

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!ref.current) return;
      return createPlainEditor({
        text,
        onChange: setText,
      }).input(ref.current);
    }, []);

    return (
      <div ref={ref} style={{ background: "white", padding: 4 }}>
        {text.split("\n").map((line, i) => {
          const tokens = linkify.find(line);
          const spans: ReactElement[] = [];
          let endIndex = 0;
          let j = 0;
          for (; j < tokens.length; j++) {
            const t = tokens[j];
            spans.push(<span key={j}>{line.slice(endIndex, t.start)}</span>);
            spans.push(
              <Link key={j + "_link"} href={t.href}>
                {line.slice(t.start, t.end)}
              </Link>,
            );
            endIndex = t.end;
          }
          spans.push(<span key={j}>{line.slice(endIndex)}</span>);

          return <div key={i}>{line ? spans : <br />}</div>;
        })}
      </div>
    );
  },
};
