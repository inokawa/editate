import { test, expect } from "@playwright/test";
import {
  getSelection,
  getText,
  initEditateHelpers,
  insertAt,
  insertLineBreakAt,
} from "./editate";
import { getEditable, type } from "./utils";

test.beforeEach(async ({ context }) => {
  await initEditateHelpers(context);
});

test("smoke", async ({ page }) => {
  await page.goto("localhost:6006");

  const editable = await getEditable(page);
  const initialValue = await getText(editable);

  await editable.focus();

  expect(await getSelection(editable)).toEqual([
    [[0], 0],
    [[0], 0],
  ]);

  // Move caret
  await page.keyboard.press("ArrowRight");
  expect(await getSelection(editable)).toEqual([
    [[0], 1],
    [[0], 1],
  ]);

  // Input
  const text = "test";
  await type(editable, text, { delay: 20 }); // Angular fails without delay option for some reason

  const value1 = insertAt(initialValue, text, [0, 1]);
  expect(await getText(editable)).toEqual(value1);
  const textLength = text.length;
  expect(await getSelection(editable)).toEqual([
    [[0], 1 + textLength],
    [[0], 1 + textLength],
  ]);

  // Split
  await page.keyboard.press("Enter", { delay: 20 }); // Angular fails without delay option for some reason
  const value2 = insertLineBreakAt(value1, [0, 1 + textLength]);
  expect(await getText(editable)).toEqual(value2);
  expect(await getSelection(editable)).toEqual([
    [[1], 0],
    [[1], 0],
  ]);

  // Split again
  await page.keyboard.press("Enter", { delay: 20 }); // Angular fails without delay option for some reason
  const value3 = insertLineBreakAt(value2, [1, 0]);
  expect(await getText(editable)).toEqual(value3);
  expect(await getSelection(editable)).toEqual([
    [[2], 0],
    [[2], 0],
  ]);

  // Insert empty line
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Enter", { delay: 20 }); // Angular fails without delay option for some reason
  expect(await getText(editable)).toEqual(insertLineBreakAt(value3, [1, 0]));
  expect(await getSelection(editable)).toEqual([
    [[2], 0],
    [[2], 0],
  ]);
});
