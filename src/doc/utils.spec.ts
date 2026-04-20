import { describe, expect, it } from "vitest";
import { stringToFragment } from "./utils.js";
import { type Fragment } from "./types.js";

describe(stringToFragment.name, () => {
  const tests: [string, Fragment][] = [
    ["Hello world", [{ children: [{ text: "Hello world" }] }]],
    [
      "Hello\n world",
      [{ children: [{ text: "Hello" }] }, { children: [{ text: " world" }] }],
    ],
    ["", [{ children: [{ text: "" }] }]],
    ["\n", [{ children: [{ text: "" }] }, { children: [{ text: "" }] }]],
    [
      "\nHello\n\n\n world\n",
      [
        { children: [{ text: "" }] },
        { children: [{ text: "Hello" }] },
        { children: [{ text: "" }] },
        { children: [{ text: "" }] },
        { children: [{ text: " world" }] },
        { children: [{ text: "" }] },
      ],
    ],
  ];

  tests.forEach(([str, doc]) => {
    it(str, () => {
      expect(stringToFragment(str)).toEqual(doc);
    });
  });
});
