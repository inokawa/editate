import { Locator, Page } from "@playwright/test";

export const getEditable = async (page: Page) => {
  const editable = page.locator('[contenteditable="true"]');
  await editable.waitFor();
  return editable;
};

export const type = async (
  editable: Locator,
  text: string,
  opts?: { delay?: number },
) => {
  for (const t of text.split("")) {
    await editable.press(t, opts);
  }
};
