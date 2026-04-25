import type { StoryObj } from "@storybook/react-vite";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createPlainEditor } from "../../src";
import { getTokenizer, Tokenizer, KuromojiToken } from "kuromojin";

export default {
  component: createPlainEditor,
};

const style: React.CSSProperties = {
  width: "400px",
  height: "400px",
  background: "white",
};

const Mark = ({
  token: { pos, pos_detail_1, pos_detail_2, pos_detail_3, surface_form },
  children,
}: {
  token: KuromojiToken;
  children: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [tooltip, setTooltip] = useState<{
    top: number;
    left: number;
    description: string;
  } | null>(null);

  const color =
    pos === "名詞"
      ? "rgba(255, 0, 0, 0.2)"
      : pos === "動詞"
        ? "rgba(0, 255, 0, 0.2)"
        : pos === "形容詞"
          ? "rgba(0, 0, 255, 0.2)"
          : pos === "副詞"
            ? "rgba(255, 0, 255, 0.2)"
            : pos === "助詞"
              ? "rgba(0, 255, 255, 0.2)"
              : pos === "助動詞"
                ? "rgba(255, 255, 0, 0.2)"
                : undefined;

  return (
    <span
      ref={ref}
      style={{
        position: "relative",
        background: color,
        outline: "solid 1px lightgray",
      }}
      onMouseEnter={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setTooltip({
          top: rect.top - rect.height * 2 /* FIXME */,
          left: rect.left,
          description: `${surface_form}: ${pos} | ${pos_detail_1} | ${pos_detail_2} | ${pos_detail_3}`,
        });
      }}
      onMouseLeave={() => setTooltip(null)}
    >
      {children}
      {tooltip &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: tooltip.top,
              left: tooltip.left,
              background: "white",
              fontSize: 16,
              padding: 2,
              border: "solid 1px gray",
            }}
          >
            {tooltip.description}
          </div>,
          document.body,
        )}
    </span>
  );
};

const Editor = ({ tokenizer }: { tokenizer: Tokenizer }) => {
  const [text, setText] = useState(
    "すもももももももものうち。\n\n吾輩 （ わがはい ） は猫である。名前はまだ無い。\n\nあのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。\n\n山路を登りながら、こう考えた。智に働けば角が立つ。情に棹させば流される。意地を通せば窮屈だ。とかくに人の世は住みにくい。住みにくさが高じると、安い所へ引き越したくなる。どこへ越しても住みにくいと悟った時、詩が生れて、画が出来る。",
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
    <div ref={ref} style={style}>
      {text.split("\n").map((v, i) => {
        return (
          <div key={i}>
            {v ? (
              tokenizer.tokenize(v).map((token) => {
                return (
                  <Mark key={token.word_position} token={token}>
                    {token.surface_form}
                  </Mark>
                );
              })
            ) : (
              <br />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const WithKuromojin: StoryObj = {
  render: () => {
    const [tokenizer, setTokenizer] = useState<Tokenizer | string | null>(null);

    useEffect(() => {
      (async () => {
        const tokenizer = await getTokenizer({
          dicPath: (import.meta as any).env.STORYBOOK_DEPLOY
            ? "/editate/dict"
            : "/dict",
        });
        setTokenizer(tokenizer);
      })().catch((e) => {
        setTokenizer(e.toString());
      });
    }, []);

    if (!tokenizer) {
      return <div>{"Loading dictionaries"}</div>;
    }
    if (typeof tokenizer === "string") {
      return <div>Error: {tokenizer.toString()}</div>;
    }

    return (
      <div style={{ marginTop: 32 }}>
        <Editor tokenizer={tokenizer} />
      </div>
    );
  },
};
