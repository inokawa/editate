import { expect, it } from "vitest";
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

it("parse where Trusted Types are required", () => {
  const meta = document.createElement("meta");
  meta.httpEquiv = "Content-Security-Policy";
  meta.content = "require-trusted-types-for 'script'";
  // Enforced for the rest of this file's document
  document.head.appendChild(meta);

  const parser = createParser(document, defaultIsBlockNode);
  // The policy is created once and used for every parse
  for (let i = 0; i < 2; i++) {
    expect(
      htmlPaste("<p>a</p>", parser, { text: (text) => ({ text }) }),
    ).toEqual([{ children: [{ text: "a" }] }]);
  }
});
