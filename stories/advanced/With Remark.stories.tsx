import type { StoryObj } from "@storybook/react";
import React, {
  type ReactElement,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPlainEditor } from "../../src";
import { type Plugin, unified } from "unified";
import type { Node, Root, RootContent } from "mdast";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";

declare module "unified" {
  interface CompileResultMap {
    editor: ReactElement[];
  }
}

const compiler: Plugin<[], Root, ReactElement[]> = function () {
  const getRange = (node: Node): [number, number] => {
    const start = node.position!.start.offset!;
    const end = node.position!.end.offset!;
    return [start, end];
  };

  const collectLines = (root: Root, value: string) => {
    const lines: { start: number; end: number; nodes: RootContent[] }[] = [];
    let offset = 0;
    for (const line of value.split("\n")) {
      const lineStart = offset;
      const lineEnd = offset + line.length;
      const nodes = root.children.filter((n) => {
        const [nStart, nEnd] = getRange(n);
        return nStart < lineEnd + 1 && nEnd > lineStart;
      });
      lines.push({ start: lineStart, end: lineEnd, nodes });
      offset = lineEnd + 1;
    }
    return lines;
  };

  const renderNodeInLine = (
    node: RootContent,
    lineStart: number,
    lineEnd: number,
    value: string,
  ): ReactNode => {
    const [start, end] = getRange(node);
    const segStart = Math.max(start, lineStart);
    const segEnd = Math.min(end, lineEnd);
    let children: ReactNode[];
    if ("children" in node && node.children.length) {
      children = [];
      let offset = segStart;
      for (const c of node.children) {
        const [cStart, cEnd] = getRange(c);
        if (offset < cStart && cStart < segEnd) {
          children.push(value.slice(offset, cStart));
        }
        if (cEnd > lineStart && cStart < lineEnd) {
          children.push(renderNodeInLine(c, lineStart, lineEnd, value));
        }
        offset = Math.max(offset, Math.min(cEnd, segEnd));
      }
      if (offset < segEnd) {
        children.push(value.slice(offset, segEnd));
      }
    } else {
      children = [value.slice(segStart, segEnd)];
    }
    switch (node.type) {
      case "strong":
        return <strong key={segStart}>{children}</strong>;
      case "emphasis":
        return <em key={segStart}>{children}</em>;
      case "delete":
        return <del key={segStart}>{children}</del>;
      case "inlineCode":
        return (
          <code key={segStart} style={{ backgroundColor: "#ccc" }}>
            {children}
          </code>
        );
      case "link":
        return (
          <span key={segStart} style={{ color: "#1976d2" }}>
            {children}
          </span>
        );
      case "blockquote":
        return (
          <blockquote
            key={segStart}
            style={{ fontStyle: "italic", color: "#888" }}
          >
            {children}
          </blockquote>
        );
      case "heading": {
        const Tag = `h${node.depth}` as const;
        return (
          <Tag key={segStart} style={{ display: "inline" }}>
            {children}
          </Tag>
        );
      }
      default:
        return children;
    }
  };

  this.compiler = (node, file) => {
    const value = file.value ? String(file.value) : "";
    const root = node as Root;
    const lines = collectLines(root, value);
    const result: ReactElement[] = [];
    for (let i = 0; i < lines.length; i++) {
      const { start, end, nodes } = lines[i]!;
      const contents: ReactNode[] = [];
      let offset = start;
      for (const n of nodes) {
        const [nStart, nEnd] = getRange(n);
        const segStart = Math.max(nStart, start);
        const segEnd = Math.min(nEnd, end);
        if (offset < segStart) {
          contents.push(value.slice(offset, segStart));
        }
        if (segStart < segEnd) {
          contents.push(renderNodeInLine(n, start, end, value));
        }
        offset = Math.max(offset, segEnd);
      }
      if (offset < end) {
        contents.push(value.slice(offset, end));
      }
      result.push(<div key={i}>{contents.length ? contents : <br />}</div>);
    }
    return result;
  };
};

const processor = unified().use(remarkParse).use(remarkGfm).use(compiler);

export default {
  component: createPlainEditor,
};

export const WithRemark: StoryObj = {
  render: () => {
    const [text, setText] = useState(
      "# Hello world\n\nThis text is markdown.\n*Emphasis*, **importance**, and ~~strikethrough~~.",
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
      <div ref={ref} style={{ background: "white", padding: 2 }}>
        {processor.processSync(text).result}
      </div>
    );
  },
};
