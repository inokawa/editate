import { test, expect } from "@playwright/test";
import { getText, initEditateHelpers } from "./editate";
import { getEditable, storyUrl } from "./utils";

test.beforeEach(async ({ context }) => {
  await initEditateHelpers(context);
});

test.describe("programmatic edit during composition", () => {
  // A consumer edit (editor.exec / editor.apply) dispatched while an IME
  // composition is active must not be reverted when the composition ends.
  // Without finalizing the composition first, the edit's re-render is recorded
  // as part of the composition and reverted at compositionend (#372).
  test("survives compositionend", async ({ page }) => {
    await page.goto(
      storyUrl(
        "basics-programmatic-edit--programmatic-edit-during-composition",
      ),
    );
    const editable = await getEditable(page);
    await editable.focus();

    // Put a caret mid-word and open a composition (turns editate's mutation
    // recording on), then fire a programmatic edit while it's active.
    await editable.evaluate((el) => {
      const node = el.querySelector("div")!.firstChild!;
      const range = el.ownerDocument.createRange();
      range.setStart(node, 5);
      range.collapse(true);
      const selection = el.ownerDocument.getSelection()!;
      selection.removeAllRanges();
      selection.addRange(range);

      el.dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true }));
      el.dispatchEvent(
        new InputEvent("beforeinput", {
          inputType: "insertCompositionText",
          data: "x",
          bubbles: true,
          cancelable: true,
        }),
      );
      (window as unknown as { __repro: { insert(): void } }).__repro.insert();
    });

    // Let the consumer's re-render flush, then end the composition.
    await page.waitForTimeout(50);
    await editable.evaluate((el) =>
      el.dispatchEvent(
        new CompositionEvent("compositionend", { bubbles: true, data: "x" }),
      ),
    );
    await page.waitForTimeout(50);

    expect((await getText(editable)).join("\n")).toContain("[INSERTED]");
  });
});
