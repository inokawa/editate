import { expect, it } from "vitest";
import { htmlPaste } from "./htmlTransfer.js";
import { createParser } from "../../dom/parser.js";
import { defaultIsBlockNode, defaultIsVoidNode } from "../../dom/default.js";

const createDataTransfer = (str: string): DataTransfer => {
  const transfer = new DataTransfer();
  transfer.setData("text/html", str);
  return transfer;
};

const parser = createParser({
  _document: document,
  _isBlock: defaultIsBlockNode,
  _isVoid: defaultIsVoidNode,
});

it("single paragraph root", () => {
  const handler = htmlPaste((text) => ({ text }));
  const html = `<meta charset='utf-8'><div><br><div><span>export</span><span> </span><span>const</span><span> </span><span>editable</span><span> </span><span>=</span><span> (</span></div><div><span>  </span><span>element</span><span>:</span><span> </span><span>HTMLElement</span><span>,</span></div><div><span>  { </span><span>readonly</span><span>, </span><span>nodes</span><span>, </span><span>onChange</span><span> }</span><span>:</span><span> </span><span>EditableOptions</span></div><div><span></span></div></div>`;

  expect(handler(createDataTransfer(html), parser)).toEqual([
    { children: [] },
    {
      children: [
        {
          text: "export const editable = (",
        },
      ],
    },
    {
      children: [
        {
          text: "  element: HTMLElement,",
        },
      ],
    },
    {
      children: [
        {
          text: "  { readonly, nodes, onChange }: EditableOptions",
        },
      ],
    },
  ]);
});

it("multi paragraph root", () => {
  const handler = htmlPaste((text) => ({ text }));
  const html = `<meta charset='utf-8'><p>#17</p><p>#6</p>`;

  expect(handler(createDataTransfer(html), parser)).toEqual([
    {
      children: [
        {
          text: "#17",
        },
      ],
    },
    {
      children: [
        {
          text: "#6",
        },
      ],
    },
  ]);
});

it("single inline root", () => {
  const handler = htmlPaste((text) => ({ text }));
  const html = `<meta charset='utf-8'><span>#17<br ><em>#6</em></span>`;

  expect(handler(createDataTransfer(html), parser)).toEqual([
    {
      children: [
        {
          text: "#17",
        },
      ],
    },
    {
      children: [
        {
          text: "#6",
        },
      ],
    },
  ]);
});

it("multi inline root", () => {
  const handler = htmlPaste((text) => ({ text }));
  const html = `<meta charset='utf-8'><a>#17</a><br ><a>#6</a>`;

  expect(handler(createDataTransfer(html), parser)).toEqual([
    {
      children: [
        {
          text: "#17",
        },
      ],
    },
    {
      children: [
        {
          text: "#6",
        },
      ],
    },
  ]);
});

it("table root", () => {
  const handler = htmlPaste((text) => ({ text }));
  const html = `<meta charset='utf-8'><table><tbody><tr><td><span>    <span>const</span> <span>html</span> <span>=</span> <span>clipboardData</span><span>.</span><span>getData</span><span>(</span><span>"text/html"</span><span>)</span><span>;</span></span></td></tr><tr><td></td><td></td><td><button><svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path></path></svg></button><span>    <span>if</span> <span>(</span><span>html</span><span>)</span> <span>{</span></span></td></tr></tbody></table>`;

  expect(handler(createDataTransfer(html), parser)).toEqual([
    {
      children: [
        {
          text: '    const html = clipboardData.getData("text/html");',
        },
      ],
    },
    {
      children: [
        {
          text: "    if (html) {",
        },
      ],
    },
  ]);
});

it("template tag", () => {
  const handler = htmlPaste((text) => ({ text }));
  const html = `<div><template x-for="v in text.split('\n')"><div><template x-if="v"><span x-text="v"></span></template><template x-if="!v"><br></template></div></template><div><template x-if="v"><span x-text="v"></span></template><span x-text="v">Htest</span><template x-if="!v"><br></template></div><div><template x-if="v"><span x-text="v"></span></template><span x-text="v">ello World.</span><template x-if="!v"><br></template></div><div><template x-if="v"><span x-text="v"></span></template><span x-text="v">こんにちは。</span><template x-if="!v"><br></template></div></div>`;
  expect(handler(createDataTransfer(html), parser)).toEqual([
    { children: [{ text: "Htest" }] },
    { children: [{ text: "ello World." }] },
    { children: [{ text: "こんにちは。" }] },
  ]);
});

it("copy in windows", () => {
  const handler = htmlPaste((text) => ({ text }));
  const html = `<html>
<body>
<!--StartFragment-->world<!--EndFragment-->
</body>
</html>`;
  expect(handler(createDataTransfer(html), parser)).toEqual([
    {
      children: [
        {
          text: "world",
        },
      ],
    },
  ]);
});
