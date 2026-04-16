import { expect, it } from "vitest";
import { htmlPaste } from "./html.js";
import type { ParserConfig } from "../../dom/parser.js";
import { defaultIsBlockNode, defaultIsVoidNode } from "../../dom/default.js";

const createDataTransfer = (str: string): DataTransfer => {
  const transfer = new DataTransfer();
  transfer.setData("text/html", str);
  return transfer;
};

const config: ParserConfig = {
  _document: document,
  _isBlock: defaultIsBlockNode,
  _isVoid: defaultIsVoidNode,
};

it("single paragraph root", () => {
  const handler = htmlPaste((text) => ({ text }));
  const html = `<meta charset='utf-8'><div><br><div><span>export</span><span> </span><span>const</span><span> </span><span>editable</span><span> </span><span>=</span><span> (</span></div><div><span>  </span><span>element</span><span>:</span><span> </span><span>HTMLElement</span><span>,</span></div><div><span>  { </span><span>readonly</span><span>, </span><span>nodes</span><span>, </span><span>onChange</span><span> }</span><span>:</span><span> </span><span>EditableOptions</span></div><div><span></span></div></div>`;

  expect(handler(createDataTransfer(html), config)).toEqual([
    [],
    [
      {
        text: "export const editable = (",
      },
    ],
    [
      {
        text: "  element: HTMLElement,",
      },
    ],
    [
      {
        text: "  { readonly, nodes, onChange }: EditableOptions",
      },
    ],
  ]);
});

it("multi paragraph root", () => {
  const handler = htmlPaste((text) => ({ text }));
  const html = `<meta charset='utf-8'><p>#17</p><p>#6</p>`;

  expect(handler(createDataTransfer(html), config)).toEqual([
    [
      {
        text: "#17",
      },
    ],
    [
      {
        text: "#6",
      },
    ],
  ]);
});

it("single inline root", () => {
  const handler = htmlPaste((text) => ({ text }));
  const html = `<meta charset='utf-8'><span>#17<br ><em>#6</em></span>`;

  expect(handler(createDataTransfer(html), config)).toEqual([
    [
      {
        text: "#17",
      },
    ],
    [
      {
        text: "#6",
      },
    ],
  ]);
});

it("multi inline root", () => {
  const handler = htmlPaste((text) => ({ text }));
  const html = `<meta charset='utf-8'><a>#17</a><br ><a>#6</a>`;

  expect(handler(createDataTransfer(html), config)).toEqual([
    [
      {
        text: "#17",
      },
    ],
    [
      {
        text: "#6",
      },
    ],
  ]);
});

it("table root", () => {
  const handler = htmlPaste((text) => ({ text }));
  const html = `<meta charset='utf-8'><table><tbody><tr><td><span>    <span>const</span> <span>html</span> <span>=</span> <span>clipboardData</span><span>.</span><span>getData</span><span>(</span><span>"text/html"</span><span>)</span><span>;</span></span></td></tr><tr><td></td><td></td><td><button><svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path></path></svg></button><span>    <span>if</span> <span>(</span><span>html</span><span>)</span> <span>{</span></span></td></tr></tbody></table>`;

  expect(handler(createDataTransfer(html), config)).toEqual([
    [
      {
        text: '    const html = clipboardData.getData("text/html");',
      },
    ],
    [
      {
        text: "    if (html) {",
      },
    ],
  ]);
});

it("copy in windows", () => {
  const handler = htmlPaste((text) => ({ text }));
  const html = `<html>
<body>
<!--StartFragment-->world<!--EndFragment-->
</body>
</html>`;
  expect(handler(createDataTransfer(html), config)).toEqual([
    [
      {
        text: "world",
      },
    ],
  ]);
});
