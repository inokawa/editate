import { BrowserContext, Locator, Page } from "@playwright/test";
import * as path from "node:path";
import { build } from "rolldown";

declare global {
  interface Window {
    helpers: typeof import("../src/browser.spec.helpers.ts");
  }
}

const helpers = build({
  input: path.join(import.meta.dirname, "../src/browser.spec.helpers.ts"),
  write: false,
  output: { format: "iife", name: "helpers" },
}).then((r) => r.output[0].code);

export const initEditateHelpers = async (context: BrowserContext) => {
  await context.addInitScript(`
    ${await helpers}
    window.helpers = helpers;
    `);
};

export const getText = (editable: Locator): Promise<string[]> =>
  editable.evaluate((element) => window.helpers.getText(element));

export const getState = (editable: Locator): Promise<string> =>
  editable.evaluate((element) => window.helpers.getState(element));

export const getEditable = async (page: Page) => {
  const editable = page.locator('[contenteditable="true"]');
  await editable.waitFor();
  return editable;
};

// Waits a task after each key, so that the page settles it before the next key like real typing
export const press = async (page: Page, key: string) => {
  await page.keyboard.press(key);
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve)));
};

export const type = async (page: Page, text: string) => {
  for (const t of text.split("")) {
    await press(page, t);
  }
};
