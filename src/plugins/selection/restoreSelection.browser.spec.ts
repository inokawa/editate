import { expect, it, onTestFinished } from "vitest";
import { cdp, server, userEvent } from "vitest/browser";
// Types the cdp session as playwright's
import type {} from "@vitest/browser-playwright";
import { createEditor } from "../../editor.js";
import { restoreSelectionPlugin } from "./restoreSelection.js";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const setup = (lines: string[]) => {
  const input = document.body.appendChild(document.createElement("input"));
  const element = document.body.appendChild(document.createElement("div"));
  for (const line of lines) {
    element.appendChild(document.createElement("div")).append(line);
  }
  const editor = createEditor({
    doc: { children: lines.map((text) => ({ children: [{ text }] })) },
  });
  restoreSelectionPlugin(editor);
  const cleanup = editor.input(element);
  onTestFinished(() => {
    cleanup();
    input.remove();
    element.remove();
  });
  return { input, element, editor };
};

it("restore selection and scroll position on focus by Tab", async () => {
  const lines = Array.from({ length: 50 }, (_, i) =>
    String(i).padStart(2, "0"),
  );
  const { input, element, editor } = setup(lines);
  element.style.cssText = "height: 100px; overflow: auto";
  editor.selection = [14 * 3, 14 * 3];
  input.focus();
  // Scrolled while blurred, keeping the caret in view
  element.scrollTop =
    element.children[14]!.getBoundingClientRect().top -
    element.getBoundingClientRect().top -
    40;
  const scrolled = element.scrollTop;
  await wait(100);
  await userEvent.keyboard("{Tab}");
  expect(document.activeElement).toBe(element);
  await wait(100);
  expect(editor.selection).toEqual([14 * 3, 14 * 3]);
  expect(element.scrollTop).toBe(scrolled);
});

it("keep the clicked position on focus by click", async () => {
  const { element, editor } = setup(["hello world"]);
  editor.selection = [6, 8];
  await userEvent.click(element, { position: { x: 1, y: 5 } });
  await wait(100);
  expect(editor.selection).toEqual([0, 0]);
});

it("restore selection on focus() after a click while focused", async () => {
  const { input, element, editor } = setup(["hello world"]);
  element.focus();
  await userEvent.click(element);
  // Wait for the selectionchange of the click, which would overwrite the selection set before it
  await wait(50);
  editor.selection = [6, 8];
  input.focus();
  element.focus();
  await wait(100);
  expect(editor.selection).toEqual([6, 8]);
});

it.runIf(server.browser === "chromium")(
  "restore selection on focus() after a swipe",
  async () => {
    const { element, editor } = setup(["hello world"]);
    editor.selection = [6, 8];
    const frame = window.frameElement!.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    const x = frame.x + rect.x + 1;
    const y = frame.y + rect.y + 5;
    await cdp().send("Emulation.setTouchEmulationEnabled", { enabled: true });
    onTestFinished(async () => {
      await cdp().send("Emulation.setTouchEmulationEnabled", {
        enabled: false,
      });
    });
    await cdp().send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    await cdp().send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: y + 100 }],
    });
    await cdp().send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    element.focus();
    await wait(100);
    expect(editor.selection).toEqual([6, 8]);
  },
);
