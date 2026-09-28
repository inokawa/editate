import { test, expect } from "@playwright/test";
import {
  getEditable,
  getState,
  getText,
  initEditateHelpers,
  press,
  type,
} from "./utils";

test.beforeEach(async ({ context }) => {
  await initEditateHelpers(context);
});

test("smoke", async ({ page }) => {
  await page.goto("/");

  const editable = await getEditable(page);
  const initial = (await getText(editable)).join("\n");
  const first = initial[0];
  const rest = initial.slice(1);

  await editable.focus();
  expect(await getState(editable)).toBe("|" + initial);

  // Move caret
  await press(page, "ArrowRight");
  expect(await getState(editable)).toBe(first + "|" + rest);

  // Input
  await type(page, "test");
  expect(await getState(editable)).toBe(first + "test|" + rest);

  // Split
  await press(page, "Enter");
  expect(await getState(editable)).toBe(first + "test\n|" + rest);

  // Split again
  await press(page, "Enter");
  expect(await getState(editable)).toBe(first + "test\n\n|" + rest);

  // Insert empty line
  await press(page, "ArrowUp");
  await press(page, "Enter");
  expect(await getState(editable)).toBe(first + "test\n\n|\n" + rest);
});
