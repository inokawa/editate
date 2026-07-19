import { test, expect, Page } from "@playwright/test";
import {
  getSelection,
  getText,
  initEditateHelpers,
  NON_EDITABLE_PLACEHOLDER,
  insertAt,
  deleteAt,
  moveSelectionToOrigin,
} from "./editate";
import { getEditable, type, loop, readClipboard, storyUrl } from "./utils";

test.beforeEach(async ({ context }) => {
  await initEditateHelpers(context);
});

test.describe("smoke node", () => {
  test("contenteditable: false", async ({ page }) => {
    await page.goto(storyUrl("basics-structured--tag"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([0, 0]);

    const nodeOffset = initialValue[0].indexOf(NON_EDITABLE_PLACEHOLDER);
    const char = "a";

    // type just before node
    await loop(nodeOffset, () => page.keyboard.press("ArrowRight"));
    expect(await getSelection(editable)).toEqual([nodeOffset, nodeOffset]);

    // insert
    await type(editable, char);
    expect(await getText(editable)).toEqual(
      insertAt(initialValue, char, [0, nodeOffset]),
    );
    expect(await getSelection(editable)).toEqual([
      nodeOffset + 1,
      nodeOffset + 1,
    ]);

    // delete
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([nodeOffset, nodeOffset]);

    // type just after node
    await page.keyboard.press("ArrowRight");
    expect(await getSelection(editable)).toEqual([
      nodeOffset + 1,
      nodeOffset + 1,
    ]);

    // insert
    await type(editable, char);
    expect(await getText(editable)).toEqual(
      insertAt(initialValue, char, [0, nodeOffset + 1]),
    );
    expect(await getSelection(editable)).toEqual([
      nodeOffset + 2,
      nodeOffset + 2,
    ]);

    // delete
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([
      nodeOffset + 1,
      nodeOffset + 1,
    ]);

    // delete custom node
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(
      deleteAt(initialValue, 1, [0, nodeOffset]),
    );
    expect(await getSelection(editable)).toEqual([nodeOffset, nodeOffset]);

    // undo
    await page.keyboard.press(`ControlOrMeta+z`);
    await moveSelectionToOrigin(editable);
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([0, 0]);

    // delete selected custom node and texts
    await loop(nodeOffset - 1, () => page.keyboard.press("ArrowRight"));
    await page.keyboard.press("Shift+ArrowRight");
    await page.keyboard.press("Shift+ArrowRight");
    await page.keyboard.press("Shift+ArrowRight");
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(
      deleteAt(initialValue, 3, [0, nodeOffset - 1]),
    );
    expect(await getSelection(editable)).toEqual([
      nodeOffset - 1,
      nodeOffset - 1,
    ]);

    // undo
    await page.keyboard.press(`ControlOrMeta+z`);
    await moveSelectionToOrigin(editable);
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([0, 0]);

    // replace selected custom node
    const replaceText = "Z";
    await loop(nodeOffset, () => page.keyboard.press("ArrowRight"));
    await page.keyboard.press("Shift+ArrowRight");
    await type(editable, replaceText);
    expect(await getText(editable)).toEqual(
      insertAt(deleteAt(initialValue, 1, [0, nodeOffset]), replaceText, [
        0,
        nodeOffset,
      ]),
    );
    expect(await getSelection(editable)).toEqual([
      nodeOffset + 1,
      nodeOffset + 1,
    ]);
  });

  test("img", async ({ page }) => {
    await page.goto(storyUrl("basics-structured--media"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([0, 0]);

    const nodeOffset = initialValue[0].indexOf(NON_EDITABLE_PLACEHOLDER);
    const char = "a";

    // type just before node
    await loop(nodeOffset, () => page.keyboard.press("ArrowRight"));
    expect(await getSelection(editable)).toEqual([nodeOffset, nodeOffset]);

    // insert
    await type(editable, char);
    expect(await getText(editable)).toEqual(
      insertAt(initialValue, char, [0, nodeOffset]),
    );
    expect(await getSelection(editable)).toEqual([
      nodeOffset + 1,
      nodeOffset + 1,
    ]);

    // delete
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([nodeOffset, nodeOffset]);

    // type just after node
    await page.keyboard.press("ArrowRight");
    expect(await getSelection(editable)).toEqual([
      nodeOffset + 1,
      nodeOffset + 1,
    ]);

    // insert
    await type(editable, char);
    expect(await getText(editable)).toEqual(
      insertAt(initialValue, char, [0, nodeOffset + 1]),
    );
    expect(await getSelection(editable)).toEqual([
      nodeOffset + 2,
      nodeOffset + 2,
    ]);

    // delete
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([
      nodeOffset + 1,
      nodeOffset + 1,
    ]);

    // delete custom node
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(
      deleteAt(initialValue, 1, [0, nodeOffset]),
    );
    expect(await getSelection(editable)).toEqual([nodeOffset, nodeOffset]);

    // undo
    await page.keyboard.press(`ControlOrMeta+z`);
    await moveSelectionToOrigin(editable);
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([0, 0]);

    // delete selected custom node and texts
    await loop(nodeOffset - 1, () => page.keyboard.press("ArrowRight"));
    await page.keyboard.press("Shift+ArrowRight");
    await page.keyboard.press("Shift+ArrowRight");
    await page.keyboard.press("Shift+ArrowRight");
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(
      deleteAt(initialValue, 3, [0, nodeOffset - 1]),
    );
    expect(await getSelection(editable)).toEqual([
      nodeOffset - 1,
      nodeOffset - 1,
    ]);

    // undo
    await page.keyboard.press(`ControlOrMeta+z`);
    await moveSelectionToOrigin(editable);
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([0, 0]);

    // replace selected custom node
    const replaceText = "Z";
    await loop(nodeOffset, () => page.keyboard.press("ArrowRight"));
    await page.keyboard.press("Shift+ArrowRight");
    await type(editable, replaceText);
    expect(await getText(editable)).toEqual(
      insertAt(deleteAt(initialValue, 1, [0, nodeOffset]), replaceText, [
        0,
        nodeOffset,
      ]),
    );
    expect(await getSelection(editable)).toEqual([
      nodeOffset + 1,
      nodeOffset + 1,
    ]);
  });

  test("video", async ({ page }) => {
    await page.goto(storyUrl("basics-structured--media"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([0, 0]);

    const offsetAtLine = initialValue[1].indexOf(NON_EDITABLE_PLACEHOLDER);
    const nodeOffset = initialValue[0].length + 1 + offsetAtLine;
    const char = "a";

    // type just before node
    await loop(nodeOffset, () => page.keyboard.press("ArrowRight"));
    expect(await getSelection(editable)).toEqual([nodeOffset, nodeOffset]);

    // insert
    await type(editable, char);
    expect(await getText(editable)).toEqual(
      insertAt(initialValue, char, [1, offsetAtLine]),
    );
    expect(await getSelection(editable)).toEqual([
      nodeOffset + 1,
      nodeOffset + 1,
    ]);

    // delete
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([nodeOffset, nodeOffset]);

    // type just after node
    await page.keyboard.press("ArrowRight");
    expect(await getSelection(editable)).toEqual([
      nodeOffset + 1,
      nodeOffset + 1,
    ]);

    // insert
    await type(editable, char);
    expect(await getText(editable)).toEqual(
      insertAt(initialValue, char, [1, offsetAtLine + 1]),
    );
    expect(await getSelection(editable)).toEqual([
      nodeOffset + 2,
      nodeOffset + 2,
    ]);

    // delete
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([
      nodeOffset + 1,
      nodeOffset + 1,
    ]);

    // delete custom node
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(
      deleteAt(initialValue, 1, [1, offsetAtLine]),
    );
    expect(await getSelection(editable)).toEqual([nodeOffset, nodeOffset]);
  });

  test("iframe", async ({ page }) => {
    await page.goto(storyUrl("basics-structured--media"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([0, 0]);

    const offsetAtLine = initialValue[2].indexOf(NON_EDITABLE_PLACEHOLDER);
    const nodeOffset =
      initialValue[0].length + 1 + initialValue[1].length + 1 + offsetAtLine;
    const char = "a";

    // type just before node
    await loop(nodeOffset, () => page.keyboard.press("ArrowRight"));
    expect(await getSelection(editable)).toEqual([nodeOffset, nodeOffset]);

    // insert
    await type(editable, char);
    expect(await getText(editable)).toEqual(
      insertAt(initialValue, char, [2, offsetAtLine]),
    );
    expect(await getSelection(editable)).toEqual([
      nodeOffset + 1,
      nodeOffset + 1,
    ]);

    // delete
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([nodeOffset, nodeOffset]);

    // type just after node
    await page.keyboard.press("ArrowRight");
    expect(await getSelection(editable)).toEqual([
      nodeOffset + 1,
      nodeOffset + 1,
    ]);

    // insert
    await type(editable, char);
    expect(await getText(editable)).toEqual(
      insertAt(initialValue, char, [2, offsetAtLine + 1]),
    );
    expect(await getSelection(editable)).toEqual([
      nodeOffset + 2,
      nodeOffset + 2,
    ]);

    // delete
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([
      nodeOffset + 1,
      nodeOffset + 1,
    ]);

    // delete custom node
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(
      deleteAt(initialValue, 1, [2, offsetAtLine]),
    );
    expect(await getSelection(editable)).toEqual([nodeOffset, nodeOffset]);
  });
});
