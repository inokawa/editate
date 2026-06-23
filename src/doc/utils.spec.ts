import { describe, expect, it } from "vitest";
import { stringToFragment } from "./utils.js";
import { type Fragment } from "./types.js";

describe(stringToFragment.name, () => {
  it.each<[string, Fragment]>([
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
  ])(`$0`, (str, doc) => {
    expect(stringToFragment(str)).toEqual(doc);
  });
});
