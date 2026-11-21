import { describe, expect, it } from "vitest";
import { htmlPaste } from "./htmlTransfer.js";
import { createParser } from "../../dom/parser.js";
import { defaultIsBlockNode } from "../../dom/default.js";

it("parse without running scripts", async () => {
  const parsed = new Set<number>();
  const inserted = new Set<number>();
  Object.assign(window, { parsed, inserted });
  const payloads = [
    `<img src="data:," onerror="$">`,
    `<img srcset="data:," onerror="$">`,
    `<input type="image" src="data:," onerror="$">`,
    `<audio src="data:," onerror="$"></audio>`,
    `<svg><image href="data:," onerror="$"></image></svg>`,
    `<details open ontoggle="$"></details>`,
    `<style onload="$"></style>`,
    `<link rel="stylesheet" href="data:text/css," onload="$">`,
    `<iframe srcdoc="<script>parent.$</script>"></iframe>`,
  ];
  const toHTML = (set: string) =>
    "a" + payloads.map((p, i) => p.replace("$", `${set}.add(${i})`)).join("");

  const parser = createParser(document, defaultIsBlockNode);
  const html = toHTML("parsed");
  for (const data of [
    html,
    `<body><!--StartFragment-->${html}<!--EndFragment--></body>`,
  ]) {
    htmlPaste(data, parser, { text: (text) => ({ text }) });
  }

  // The same payloads run in the current document
  document.body.append(
    ...new DOMParser().parseFromString(toHTML("inserted"), "text/html").body
      .childNodes,
  );
  await expect.poll(() => inserted.size).toBe(payloads.length);
  expect([...parsed]).toEqual([]);
});

describe("Trusted Types", () => {
  // A CSP cannot be removed, so it applies to the rest of this file's document
  const addCSP = (content: string) => {
    const meta = document.createElement("meta");
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = content;
    document.head.appendChild(meta);
  };
  // Another copy of this library, which cannot create the policy once the name is taken
  const importCopy = (): Promise<typeof import("./htmlTransfer.js")> => {
    const url = "./htmlTransfer.ts?copy";
    return import(/* @vite-ignore */ url);
  };
  const parser = createParser(document, defaultIsBlockNode);
  const paste = (fn: typeof htmlPaste) =>
    fn("<p>a</p>", parser, { text: (text) => ({ text }) });
  const parsed = [{ children: [{ text: "a" }] }];

  it("parse where not required and the policy name is taken", async () => {
    addCSP("trusted-types editate");

    // Take the name
    expect(paste(htmlPaste)).toEqual(parsed);
    expect(paste((await importCopy()).htmlPaste)).toEqual(parsed);
  });

  it("parse where required", () => {
    addCSP("require-trusted-types-for 'script'");

    expect(paste(htmlPaste)).toEqual(parsed);
  });

  it("parse nothing where required and the policy name is taken", async () => {
    addCSP("require-trusted-types-for 'script'; trusted-types editate");

    // Take the name
    expect(paste(htmlPaste)).toEqual(parsed);
    expect(paste((await importCopy()).htmlPaste)).toBe(null);
  });
});
