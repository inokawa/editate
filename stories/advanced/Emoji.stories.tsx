import type { StoryObj } from "@storybook/react-vite";
import React, {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  createPlainEditor,
  keymapPlugin,
  ReplaceText,
  selectionRectPlugin,
  sliceText,
} from "../../src";
import * as emoji from "node-emoji";

export default {
  component: createPlainEditor,
};

const MAX_LIST_LENGTH = 8;
const MENTION_REG = /:([\-+\w]*)$/;

const Menu = ({
  chars,
  index,
  top,
  left,
  complete,
}: {
  chars: { emoji: string; name: string }[];
  index: number;
  top: number;
  left: number;
  complete: (index: number) => void;
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: top,
        left: left,
        fontSize: "16px",
        border: "solid 1px gray",
        borderRadius: "3px",
        background: "white",
        cursor: "pointer",
      }}
    >
      {chars.map((c, i) => (
        <div
          key={c.name}
          style={{
            padding: "4px",
            ...(index === i && {
              color: "white",
              background: "#2A6AD3",
            }),
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            complete(i);
          }}
        >
          {`${c.emoji} ${c.name}`}
        </div>
      ))}
    </div>
  );
};

export const Emoji: StoryObj = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [text, setText] = useState(`Type : to show suggestions 💪\n`);
    const [pos, setPos] = useState<{
      top: number;
      left: number;
      caret: number;
    } | null>(null);
    const [index, setIndex] = useState<number>(0);

    const targetText = pos ? text.slice(0, pos.caret) : text;
    const match = pos && targetText.match(MENTION_REG);
    const name = match?.[1] ?? "";
    const filtered = useMemo(
      () => emoji.search(name).slice(0, MAX_LIST_LENGTH),
      [name],
    );
    const complete = (i: number) => {
      if (!ref.current || !pos) return;
      const selected = filtered[i].emoji;
      editor.exec(ReplaceText, `${selected} `, [
        pos.caret - name.length - 1,
        pos.caret,
      ]);
      setPos(null);
      setIndex(0);
    };

    const onUp = useEffectEvent(() => {
      if (!pos || !filtered.length) return false;
      setIndex((prev) => (prev <= 0 ? filtered.length - 1 : prev - 1));
    });
    const onDown = useEffectEvent(() => {
      if (!pos || !filtered.length) return false;
      setIndex((prev) => (prev >= filtered.length - 1 ? 0 : prev + 1));
    });
    const onComplete = useEffectEvent(() => {
      if (!pos || !filtered.length) return false;
      complete(index);
    });
    const onClose = useEffectEvent(() => {
      if (!pos || !filtered.length) return false;
      setPos(null);
      setIndex(0);
    });

    const editor = useMemo(() => {
      return createPlainEditor({
        text: text,
        onChange: setText,
      })
        .exec(keymapPlugin, {
          ArrowUp: onUp,
          ArrowDown: onDown,
          Enter: onComplete,
          Escape: onClose,
        })
        .exec(selectionRectPlugin, (getRect) => {
          const selectionStart = Math.min(...editor.selection);
          if (MENTION_REG.test(sliceText(editor.doc, 0, selectionStart))) {
            const r = getRect();
            setPos({
              top: r.top + r.height,
              left: r.left,
              caret: selectionStart,
            });
          } else {
            setPos(null);
          }
          setIndex(0);
        });
    }, []);

    useEffect(() => {
      if (!ref.current) return;
      return editor.input(ref.current);
    }, []);

    return (
      <div>
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
        {pos &&
          createPortal(
            <Menu
              top={pos.top}
              left={pos.left}
              chars={filtered}
              index={index}
              complete={complete}
            />,
            document.body,
          )}
      </div>
    );
  },
};
