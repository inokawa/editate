import { test, expect, Page, Locator } from "@playwright/test";
import {
  getSelection,
  getText,
  initEdixHelpers,
  deleteAt,
  insertAt,
  insertLineBreakAt,
  getSelectedRect,
  getSeletedText,
  replaceAt,
  moveSelectionToOrigin,
  waitForStyleSet,
} from "./edix";
import {
  getEditable,
  type,
  loop,
  grapheme,
  storyUrl,
  readClipboard,
} from "./utils";

test.beforeEach(async ({ context }) => {
  await initEdixHelpers(context);
});

test.describe("feature detection", () => {
  test("newest", async ({ page }) => {
    await page.goto(storyUrl("basics-plain--multiline"));

    // check if editor contents are rendered
    await expect(page.getByText("Hello world.")).toBeAttached();
    // check if editable
    await expect(page.locator('[contenteditable="true"]')).toBeAttached({
      timeout: 1000,
    });
  });

  test("beforeinput not implemented", async ({ page }) => {
    await page.addInitScript(() => {
      (InputEvent.prototype.inputType as any) = undefined;
      (InputEvent.prototype.getTargetRanges as any) = undefined;
    });
    await page.goto(storyUrl("basics-plain--multiline"));

    // check if editor contents are rendered
    await expect(page.getByText("Hello world.")).toBeAttached();
    // check if not editable
    await expect(page.locator('[contenteditable="true"]')).not.toBeAttached({
      timeout: 1000,
    });
  });
});

test.describe("type word", () => {
  test.describe("multiline", () => {
    test("on origin", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--multiline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      // Input
      const text = "test";
      await type(editable, text);
      expect(await getText(editable)).toEqual(
        insertAt(initialValue, text, [0, 0]),
      );
      const textLength = text.length;
      expect(await getSelection(editable)).toEqual([
        [[0], textLength],
        [[0], textLength],
      ]);
    });

    test("on 1st row", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--multiline"));

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
      await type(editable, text);
      expect(await getText(editable)).toEqual(
        insertAt(initialValue, text, [0, 1]),
      );
      const textLength = text.length;
      expect(await getSelection(editable)).toEqual([
        [[0], 1 + textLength],
        [[0], 1 + textLength],
      ]);
    });

    test("on 2nd row", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--multiline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      // Move caret
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("ArrowDown");
      expect(await getSelection(editable)).toEqual([
        [[1], 1],
        [[1], 1],
      ]);

      // Input
      const text = "test";
      await type(editable, text);
      expect(await getText(editable)).toEqual(
        insertAt(initialValue, text, [1, 1]),
      );
      const textLength = text.length;
      expect(await getSelection(editable)).toEqual([
        [[1], 1 + textLength],
        [[1], 1 + textLength],
      ]);
    });

    test("with IME", async ({ browserName, page }) => {
      test.skip(browserName !== "chromium");

      await page.goto(storyUrl("basics-plain--multiline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      const client = await page.context().newCDPSession(page);

      // insert with IME
      await client.send("Input.imeSetComposition", {
        selectionStart: 0,
        selectionEnd: 0,
        text: "s",
      });
      await client.send("Input.imeSetComposition", {
        selectionStart: 0,
        selectionEnd: 0,
        text: "す",
      });
      await client.send("Input.imeSetComposition", {
        selectionStart: 0,
        selectionEnd: 0,
        text: "すs",
      });
      await client.send("Input.imeSetComposition", {
        selectionStart: 0,
        selectionEnd: 0,
        text: "すし",
      });
      await client.send("Input.imeSetComposition", {
        selectionStart: 0,
        selectionEnd: 0,
        text: "寿司",
      });
      await client.send("Input.insertText", {
        text: "寿司",
      });
      const value2 = insertAt(initialValue, "寿司", [0, 0]);
      const selection2 = [
        [[0], "寿司".length],
        [[0], "寿司".length],
      ];
      expect(await getText(editable)).toEqual(value2);
      expect(await getSelection(editable)).toEqual(selection2);

      // cancel IME
      await client.send("Input.imeSetComposition", {
        selectionStart: 0,
        selectionEnd: 0,
        text: "あ",
      });
      await client.send("Input.imeSetComposition", {
        selectionStart: 0,
        selectionEnd: 0,
        text: "",
      });
      expect(await getText(editable)).toEqual(value2);

      // compose already inserted texts
      await client.send("Input.imeSetComposition", {
        selectionStart: -2,
        selectionEnd: 0,
        text: "",
      });
      await client.send("Input.imeSetComposition", {
        selectionStart: -2,
        selectionEnd: 0,
        text: "鮨",
      });
      await client.send("Input.imeSetComposition", {
        selectionStart: -2,
        selectionEnd: 0,
        text: "🍣",
      });
      await client.send("Input.insertText", {
        text: "🍣",
      });
      expect(await getText(editable)).toEqual(
        insertAt(initialValue, "🍣", [0, 0]),
      );
      expect(await getSelection(editable)).toEqual([
        [[0], "🍣".length],
        [[0], "🍣".length],
      ]);
    });
  });

  test.describe("singleline", () => {
    test("on origin", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--singleline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[], 0],
        [[], 0],
      ]);

      // Input
      const text = "test";
      await type(editable, text);
      expect(await getText(editable)).toEqual(
        insertAt(initialValue, text, [0, 0]),
      );
      const textLength = text.length;
      expect(await getSelection(editable)).toEqual([
        [[], textLength],
        [[], textLength],
      ]);
    });

    test("on 1st row", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--singleline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[], 0],
        [[], 0],
      ]);

      // Move caret
      await page.keyboard.press("ArrowRight");
      expect(await getSelection(editable)).toEqual([
        [[], 1],
        [[], 1],
      ]);

      // Input
      const text = "test";
      await type(editable, text);
      expect(await getText(editable)).toEqual(
        insertAt(initialValue, text, [0, 1]),
      );
      const textLength = text.length;
      expect(await getSelection(editable)).toEqual([
        [[], 1 + textLength],
        [[], 1 + textLength],
      ]);
    });

    test("with IME", async ({ browserName, page }) => {
      test.skip(browserName !== "chromium");

      await page.goto(storyUrl("basics-plain--singleline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[], 0],
        [[], 0],
      ]);

      const client = await page.context().newCDPSession(page);

      // insert with IME
      await client.send("Input.imeSetComposition", {
        selectionStart: 0,
        selectionEnd: 0,
        text: "s",
      });
      await client.send("Input.imeSetComposition", {
        selectionStart: 0,
        selectionEnd: 0,
        text: "す",
      });
      await client.send("Input.imeSetComposition", {
        selectionStart: 0,
        selectionEnd: 0,
        text: "すs",
      });
      await client.send("Input.imeSetComposition", {
        selectionStart: 0,
        selectionEnd: 0,
        text: "すし",
      });
      await client.send("Input.imeSetComposition", {
        selectionStart: 0,
        selectionEnd: 0,
        text: "寿司",
      });
      await client.send("Input.insertText", {
        text: "寿司",
      });
      const value2 = insertAt(initialValue, "寿司", [0, 0]);
      const selection2 = [
        [[], "寿司".length],
        [[], "寿司".length],
      ];
      expect(await getText(editable)).toEqual(value2);
      expect(await getSelection(editable)).toEqual(selection2);

      // cancel IME
      await client.send("Input.imeSetComposition", {
        selectionStart: 0,
        selectionEnd: 0,
        text: "あ",
      });
      await client.send("Input.imeSetComposition", {
        selectionStart: 0,
        selectionEnd: 0,
        text: "",
      });
      expect(await getText(editable)).toEqual(value2);

      // compose already inserted texts
      await client.send("Input.imeSetComposition", {
        selectionStart: -2,
        selectionEnd: 0,
        text: "",
      });
      await client.send("Input.imeSetComposition", {
        selectionStart: -2,
        selectionEnd: 0,
        text: "鮨",
      });
      await client.send("Input.imeSetComposition", {
        selectionStart: -2,
        selectionEnd: 0,
        text: "🍣",
      });
      await client.send("Input.insertText", {
        text: "🍣",
      });
      expect(await getText(editable)).toEqual(
        insertAt(initialValue, "🍣", [0, 0]),
      );
      expect(await getSelection(editable)).toEqual([
        [[], "🍣".length],
        [[], "🍣".length],
      ]);
    });
  });

  test.describe("span as block", () => {
    test("on origin", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--span-as-block"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable, { blockTag: "span" });

      await editable.focus();

      expect(await getSelection(editable, { blockTag: "span" })).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      // Input
      const text = "test";
      await type(editable, text);
      expect(await getText(editable, { blockTag: "span" })).toEqual(
        insertAt(initialValue, text, [0, 0]),
      );
      const textLength = text.length;
      expect(await getSelection(editable, { blockTag: "span" })).toEqual([
        [[0], textLength],
        [[0], textLength],
      ]);
    });

    test("on 1st row", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--span-as-block"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable, { blockTag: "span" });

      await editable.focus();

      expect(await getSelection(editable, { blockTag: "span" })).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      // Move caret
      await page.keyboard.press("ArrowRight");
      expect(await getSelection(editable, { blockTag: "span" })).toEqual([
        [[0], 1],
        [[0], 1],
      ]);

      // Input
      const text = "test";
      await type(editable, text);
      expect(await getText(editable, { blockTag: "span" })).toEqual(
        insertAt(initialValue, text, [0, 1]),
      );
      const textLength = text.length;
      expect(await getSelection(editable, { blockTag: "span" })).toEqual([
        [[0], 1 + textLength],
        [[0], 1 + textLength],
      ]);
    });

    test("on 2nd row", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--span-as-block"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable, { blockTag: "span" });

      await editable.focus();

      expect(await getSelection(editable, { blockTag: "span" })).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      // Move caret
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("ArrowDown");
      expect(await getSelection(editable, { blockTag: "span" })).toEqual([
        [[1], 1],
        [[1], 1],
      ]);

      // Input
      const text = "test";
      await type(editable, text);
      expect(await getText(editable, { blockTag: "span" })).toEqual(
        insertAt(initialValue, text, [1, 1]),
      );
      const textLength = text.length;
      expect(await getSelection(editable, { blockTag: "span" })).toEqual([
        [[1], 1 + textLength],
        [[1], 1 + textLength],
      ]);
    });
  });
});

test.describe("replace range", () => {
  test("replace chars", async ({ page }) => {
    await page.goto(storyUrl("basics-plain--multiline"));

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
    // Expand selection
    const selLength = 3;
    await loop(selLength, () => page.keyboard.press("Shift+ArrowRight"));
    expect(await getSelection(editable)).toEqual([
      [[0], 1],
      [[0], 1 + selLength],
    ]);

    // Input
    const char = "a";
    const charLength = char.length;
    await type(editable, char);
    expect(await getText(editable)).toEqual(
      replaceAt(initialValue, char, selLength, [0, 1]),
    );
    expect(await getSelection(editable)).toEqual([
      [[0], 1 + charLength],
      [[0], 1 + charLength],
    ]);
  });

  test("replace linebreak", async ({ page }) => {
    await page.goto(storyUrl("basics-plain--multiline"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    // Move caret
    const len = 1;
    await loop(len, () => page.keyboard.press("ArrowRight"));
    expect(await getSelection(editable)).toEqual([
      [[0], len],
      [[0], len],
    ]);
    // Expand selection
    await page.keyboard.press("Shift+ArrowDown");
    expect(await getSelection(editable)).toEqual([
      [[0], len],
      [[1], len],
    ]);

    // Input
    const char = "a";
    const charLength = char.length;
    await type(editable, char);

    expect(await getText(editable)).toEqual([
      initialValue[0].slice(0, len) + char + initialValue[1].slice(len),
      ...initialValue.slice(2),
    ]);
    expect(await getSelection(editable)).toEqual([
      [[0], len + charLength],
      [[0], len + charLength],
    ]);
  });

  test("replace all", async ({ page }) => {
    await page.goto(storyUrl("basics-plain--multiline"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    // Select All
    await page.keyboard.press(`ControlOrMeta+A`);
    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[initialValue.length - 1], initialValue[initialValue.length - 1].length],
    ]);

    // Input
    const char = "a";
    const charLength = char.length;
    await type(editable, char);

    expect(await getText(editable)).toEqual([char]);
    expect(await getSelection(editable)).toEqual([
      [[0], charLength],
      [[0], charLength],
    ]);
  });

  test("replace all with linebreak", async ({ page }) => {
    await page.goto(storyUrl("basics-plain--multiline"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    // Select All
    await page.keyboard.press(`ControlOrMeta+A`);
    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[initialValue.length - 1], initialValue[initialValue.length - 1].length],
    ]);

    // Enter
    await page.keyboard.press("Enter");
    expect(await getText(editable)).toEqual(["", ""]);
    expect(await getSelection(editable)).toEqual([
      [[1], 0],
      [[1], 0],
    ]);
  });
});

test.describe("Keydown", () => {
  test.describe("Arrow keys", () => {
    test("multiline", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--multiline"));

      const editable = await getEditable(page);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      await page.keyboard.press("ArrowRight");
      expect(await getSelection(editable)).toEqual([
        [[0], 1],
        [[0], 1],
      ]);

      await page.keyboard.press("ArrowDown");
      expect(await getSelection(editable)).toEqual([
        [[1], 1],
        [[1], 1],
      ]);

      await page.keyboard.press("ArrowLeft");
      expect(await getSelection(editable)).toEqual([
        [[1], 0],
        [[1], 0],
      ]);

      await page.keyboard.press("ArrowUp");
      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);
    });

    test("singleline", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--singleline"));

      const editable = await getEditable(page);
      const textLength = (await getText(editable))[0].length;

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[], 0],
        [[], 0],
      ]);

      await page.keyboard.press("ArrowRight");
      expect(await getSelection(editable)).toEqual([
        [[], 1],
        [[], 1],
      ]);

      await page.keyboard.press("ArrowDown");
      expect(await getSelection(editable)).toEqual([
        [[], textLength],
        [[], textLength],
      ]);

      await page.keyboard.press("ArrowLeft");
      expect(await getSelection(editable)).toEqual([
        [[], textLength - 1],
        [[], textLength - 1],
      ]);

      await page.keyboard.press("ArrowUp");
      expect(await getSelection(editable)).toEqual([
        [[], 0],
        [[], 0],
      ]);
    });
  });

  test.describe("Enter", () => {
    test("split text", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--multiline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      const offset = Math.floor(initialValue[0].length / 4);

      await loop(offset, () => page.keyboard.press("ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[0], offset],
        [[0], offset],
      ]);

      // Split
      await page.keyboard.press("Enter");
      const splittedValue = insertLineBreakAt(initialValue, [0, offset]);
      expect(await getText(editable)).toEqual(splittedValue);
      expect(await getSelection(editable)).toEqual([
        [[1], 0],
        [[1], 0],
      ]);

      // Split again
      await page.keyboard.press("Enter");
      const splittedSplittedValue = insertLineBreakAt(splittedValue, [1, 0]);
      expect(await getText(editable)).toEqual(splittedSplittedValue);
      expect(await getSelection(editable)).toEqual([
        [[2], 0],
        [[2], 0],
      ]);

      // Insert empty line
      await page.keyboard.press("ArrowUp");
      await page.keyboard.press("Enter");
      expect(await getText(editable)).toEqual(
        insertLineBreakAt(splittedSplittedValue, [1, 0]),
      );
      expect(await getSelection(editable)).toEqual([
        [[2], 0],
        [[2], 0],
      ]);

      // Remove empty line
      await page.keyboard.press("Backspace");
      await page.keyboard.press("ArrowDown");
      expect(await getText(editable)).toEqual(splittedSplittedValue);
      expect(await getSelection(editable)).toEqual([
        [[2], 0],
        [[2], 0],
      ]);

      // Join
      await page.keyboard.press("Backspace");
      expect(await getText(editable)).toEqual(splittedValue);
      expect(await getSelection(editable)).toEqual([
        [[1], 0],
        [[1], 0],
      ]);

      // Join again
      await page.keyboard.press("Backspace");
      expect(await getText(editable)).toEqual(initialValue);
      expect(await getSelection(editable)).toEqual([
        [[0], offset],
        [[0], offset],
      ]);
    });

    test("split span", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--highlight"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      const offset = Math.floor(initialValue[0].length / 4);

      await loop(offset, () => page.keyboard.press("ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[0], offset],
        [[0], offset],
      ]);

      // Split
      await page.keyboard.press("Enter");
      const splittedValue = insertLineBreakAt(initialValue, [0, offset]);
      expect(await getText(editable)).toEqual(splittedValue);
      expect(await getSelection(editable)).toEqual([
        [[1], 0],
        [[1], 0],
      ]);

      // Split again
      await page.keyboard.press("Enter");
      const splittedSplittedValue = insertLineBreakAt(splittedValue, [1, 0]);
      expect(await getText(editable)).toEqual(splittedSplittedValue);
      expect(await getSelection(editable)).toEqual([
        [[2], 0],
        [[2], 0],
      ]);

      // Insert empty line
      await page.keyboard.press("ArrowUp");
      await page.keyboard.press("Enter");
      expect(await getText(editable)).toEqual(
        insertLineBreakAt(splittedSplittedValue, [1, 0]),
      );
      expect(await getSelection(editable)).toEqual([
        [[2], 0],
        [[2], 0],
      ]);

      // Remove empty line
      await page.keyboard.press("Backspace");
      await page.keyboard.press("ArrowDown");
      expect(await getText(editable)).toEqual(splittedSplittedValue);
      expect(await getSelection(editable)).toEqual([
        [[2], 0],
        [[2], 0],
      ]);

      // Join
      await page.keyboard.press("Backspace");
      expect(await getText(editable)).toEqual(splittedValue);
      expect(await getSelection(editable)).toEqual([
        [[1], 0],
        [[1], 0],
      ]);

      // Join again
      await page.keyboard.press("Backspace");
      expect(await getText(editable)).toEqual(initialValue);
      expect(await getSelection(editable)).toEqual([
        [[0], offset],
        [[0], offset],
      ]);
    });

    test("handle empty spans", async ({ page }) => {
      await page.goto(
        storyUrl("advanced-with-prismreactrenderer--with-prism-react-renderer"),
      );

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      const offset = Math.floor(initialValue[0].length / 4);

      await loop(offset, () => page.keyboard.press("ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[0], offset],
        [[0], offset],
      ]);

      // Split
      await page.keyboard.press("Enter");
      const splittedValue = insertLineBreakAt(initialValue, [0, offset]);
      expect(await getText(editable)).toEqual(splittedValue);
      expect(await getSelection(editable)).toEqual([
        [[1], 0],
        [[1], 0],
      ]);

      // Split again
      await page.keyboard.press("Enter");
      const splittedSplittedValue = insertLineBreakAt(splittedValue, [1, 0]);
      expect(await getText(editable)).toEqual(splittedSplittedValue);
      expect(await getSelection(editable)).toEqual([
        [[2], 0],
        [[2], 0],
      ]);

      // Insert empty line
      await page.keyboard.press("ArrowUp");
      await page.keyboard.press("Enter");
      expect(await getText(editable)).toEqual(
        insertLineBreakAt(splittedSplittedValue, [1, 0]),
      );
      expect(await getSelection(editable)).toEqual([
        [[2], 0],
        [[2], 0],
      ]);

      // Remove empty line
      await page.keyboard.press("Backspace");
      await page.keyboard.press("ArrowDown");
      expect(await getText(editable)).toEqual(splittedSplittedValue);
      expect(await getSelection(editable)).toEqual([
        [[2], 0],
        [[2], 0],
      ]);

      // Join
      await page.keyboard.press("Backspace");
      expect(await getText(editable)).toEqual(splittedValue);
      expect(await getSelection(editable)).toEqual([
        [[1], 0],
        [[1], 0],
      ]);

      // Join again
      await page.keyboard.press("Backspace");
      expect(await getText(editable)).toEqual(initialValue);
      expect(await getSelection(editable)).toEqual([
        [[0], offset],
        [[0], offset],
      ]);
    });

    test("split edge cases", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--multiline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      // Split at first
      await page.keyboard.press("Enter");
      expect(await getText(editable)).toEqual(
        insertLineBreakAt(initialValue, [0, 0]),
      );
      expect(await getSelection(editable)).toEqual([
        [[1], 0],
        [[1], 0],
      ]);

      // Join
      await page.keyboard.press("Backspace");
      expect(await getText(editable)).toEqual(initialValue);
      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      // Move to last
      const lastLineIndex = initialValue.length - 1;
      const lastLineLength = initialValue[lastLineIndex].length;
      for (let i = 0; i <= lastLineIndex + 1; i++) {
        await page.keyboard.press("ArrowDown");
      }
      expect(await getSelection(editable)).toEqual([
        [[lastLineIndex], lastLineLength],
        [[lastLineIndex], lastLineLength],
      ]);

      // Split at last
      await page.keyboard.press("Enter");
      expect(await getText(editable)).toEqual(
        insertLineBreakAt(initialValue, [lastLineIndex, lastLineLength]),
      );
      expect(await getSelection(editable)).toEqual([
        [[lastLineIndex + 1], 0],
        [[lastLineIndex + 1], 0],
      ]);

      // Join
      await page.keyboard.press("Backspace");
      expect(await getText(editable)).toEqual(initialValue);
      expect(await getSelection(editable)).toEqual([
        [[lastLineIndex], lastLineLength],
        [[lastLineIndex], lastLineLength],
      ]);

      // Split at line start and delete selected text
      await editable.dblclick({
        position: { x: 16, y: (await editable.boundingBox())!.height / 2 },
      });
      const selectedText = await getSeletedText(editable);
      const expectedText = "こんにちは";
      expect(selectedText).toEqual([expectedText]);
      expect(await getSelection(editable)).toEqual([
        [[1], 0],
        [[1], expectedText.length],
      ]);
      await page.keyboard.press("Enter");
      expect(await getText(editable)).toEqual(
        insertLineBreakAt(
          deleteAt(initialValue, expectedText.length, [1, 0]),
          [1, 0],
        ),
      );
      expect(await getSelection(editable)).toEqual([
        [[2], 0],
        [[2], 0],
      ]);
    });

    test("treat soft break as hard break", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--multiline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      const offset = Math.floor(initialValue[0].length / 4);

      await loop(offset, () => page.keyboard.press("ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[0], offset],
        [[0], offset],
      ]);

      // Soft break
      await page.keyboard.press("Shift+Enter");
      const splittedValue = insertLineBreakAt(initialValue, [0, offset]);
      expect(await getText(editable)).toEqual(splittedValue);
      expect(await getSelection(editable)).toEqual([
        [[1], 0],
        [[1], 0],
      ]);

      // Soft break again
      await page.keyboard.press("Shift+Enter");
      const splittedSplittedValue = insertLineBreakAt(splittedValue, [1, 0]);
      expect(await getText(editable)).toEqual(splittedSplittedValue);
      expect(await getSelection(editable)).toEqual([
        [[2], 0],
        [[2], 0],
      ]);

      // Insert empty line
      await page.keyboard.press("ArrowUp");
      await page.keyboard.press("Enter");
      expect(await getText(editable)).toEqual(
        insertLineBreakAt(splittedSplittedValue, [1, 0]),
      );
      expect(await getSelection(editable)).toEqual([
        [[2], 0],
        [[2], 0],
      ]);

      // Remove empty line
      await page.keyboard.press("Backspace");
      await page.keyboard.press("ArrowDown");
      expect(await getText(editable)).toEqual(splittedSplittedValue);
      expect(await getSelection(editable)).toEqual([
        [[2], 0],
        [[2], 0],
      ]);

      // Remove soft break
      await page.keyboard.press("Backspace");
      expect(await getText(editable)).toEqual(splittedValue);
      expect(await getSelection(editable)).toEqual([
        [[1], 0],
        [[1], 0],
      ]);

      // Remove soft break again
      await page.keyboard.press("Backspace");
      expect(await getText(editable)).toEqual(initialValue);
      expect(await getSelection(editable)).toEqual([
        [[0], offset],
        [[0], offset],
      ]);

      const endOffset = initialValue[0].length;

      await loop(endOffset - offset, () => page.keyboard.press("ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[0], endOffset],
        [[0], endOffset],
      ]);

      // Soft break at EOL
      await page.keyboard.press("Shift+Enter");
      expect(await getText(editable)).toEqual(
        insertLineBreakAt(initialValue, [0, endOffset]),
      );
      expect(await getSelection(editable)).toEqual([
        [[1], 0],
        [[1], 0],
      ]);

      // Remove soft break
      await page.keyboard.press("Backspace");
      expect(await getText(editable)).toEqual(initialValue);
      expect(await getSelection(editable)).toEqual([
        [[0], endOffset],
        [[0], endOffset],
      ]);
    });

    test("singleline", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--singleline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[], 0],
        [[], 0],
      ]);

      await loop(2, () => page.keyboard.press("ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[], 2],
        [[], 2],
      ]);

      // Press enter
      await page.keyboard.press("Enter");

      // NOP
      expect(await getText(editable)).toEqual(initialValue);
      expect(await getSelection(editable)).toEqual([
        [[], 2],
        [[], 2],
      ]);
    });
  });

  test.describe("Backspace", () => {
    test("delete char", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--multiline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      // Move caret
      await loop(2, () => page.keyboard.press("ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[0], 2],
        [[0], 2],
      ]);

      // delete
      await page.keyboard.press("Backspace");

      expect(await getText(editable)).toEqual(
        deleteAt(initialValue, 1, [0, 1]),
      );
      expect(await getSelection(editable)).toEqual([
        [[0], 1],
        [[0], 1],
      ]);
    });

    test("delete chars", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--multiline"));

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
      // Expand selection
      const selLength = 3;
      await loop(selLength, () => page.keyboard.press("Shift+ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[0], 1],
        [[0], 1 + selLength],
      ]);

      // delete
      await page.keyboard.press("Backspace");

      expect(await getText(editable)).toEqual(
        deleteAt(initialValue, selLength, [0, 1]),
      );
      expect(await getSelection(editable)).toEqual([
        [[0], 1],
        [[0], 1],
      ]);
    });

    test("delete linebreak", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--multiline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      // Move caret
      const len = 1;
      await loop(len, () => page.keyboard.press("ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[0], len],
        [[0], len],
      ]);
      // Expand selection
      await page.keyboard.press("Shift+ArrowDown");
      expect(await getSelection(editable)).toEqual([
        [[0], len],
        [[1], len],
      ]);

      // delete
      await page.keyboard.press("Backspace");

      expect(await getText(editable)).toEqual([
        initialValue[0].slice(0, len) + initialValue[1].slice(len),
        ...initialValue.slice(2),
      ]);
      expect(await getSelection(editable)).toEqual([
        [[0], len],
        [[0], len],
      ]);
    });

    test("delete all", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--multiline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      // Select All
      await page.keyboard.press(`ControlOrMeta+A`);
      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [
          [initialValue.length - 1],
          initialValue[initialValue.length - 1].length,
        ],
      ]);

      // delete
      await page.keyboard.press("Backspace");

      expect(await getText(editable)).toEqual([""]);
      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);
    });
  });

  test.describe("Delete", () => {
    test("delete char", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--multiline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      // Move caret
      await loop(2, () => page.keyboard.press("ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[0], 2],
        [[0], 2],
      ]);

      // delete
      await page.keyboard.press("Delete");

      expect(await getText(editable)).toEqual(
        deleteAt(initialValue, 1, [0, 2]),
      );
      expect(await getSelection(editable)).toEqual([
        [[0], 2],
        [[0], 2],
      ]);
    });

    test("delete chars", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--multiline"));

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
      // Expand selection
      const selLength = 3;
      await loop(selLength, () => page.keyboard.press("Shift+ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[0], 1],
        [[0], 1 + selLength],
      ]);

      // delete
      await page.keyboard.press("Delete");

      expect(await getText(editable)).toEqual(
        deleteAt(initialValue, selLength, [0, 1]),
      );
      expect(await getSelection(editable)).toEqual([
        [[0], 1],
        [[0], 1],
      ]);
    });

    test("delete linebreak", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--multiline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      // Move caret
      const len = 1;
      await loop(len, () => page.keyboard.press("ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[0], len],
        [[0], len],
      ]);
      // Expand selection
      await page.keyboard.press("Shift+ArrowDown");
      expect(await getSelection(editable)).toEqual([
        [[0], len],
        [[1], len],
      ]);

      // delete
      await page.keyboard.press("Delete");

      expect(await getText(editable)).toEqual([
        initialValue[0].slice(0, len) + initialValue[1].slice(len),
        ...initialValue.slice(2),
      ]);
      expect(await getSelection(editable)).toEqual([
        [[0], len],
        [[0], len],
      ]);
    });

    test("delete all", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--multiline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      // Select All
      await page.keyboard.press(`ControlOrMeta+A`);
      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [
          [initialValue.length - 1],
          initialValue[initialValue.length - 1].length,
        ],
      ]);

      // delete
      await page.keyboard.press("Delete");

      expect(await getText(editable)).toEqual([""]);
      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);
    });
  });

  test.describe("User defined shortcuts", () => {
    test("combobox", async ({ page }) => {
      await page.goto(storyUrl("advanced-combobox--combobox"));

      const editable = await getEditable(page);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[], 0],
        [[], 0],
      ]);

      const textA = "a";
      await type(editable, textA);

      // Enter(but no-op)
      await page.keyboard.press("Enter");
      expect(await getText(editable)).toEqual([textA]);

      // Select item with Enter
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      const updatedA = await getText(editable);
      expect(updatedA).not.toEqual([textA]);
      expect(updatedA[0].length).toBeGreaterThan(textA.length + 1);
      expect(updatedA[0].toLowerCase().startsWith(textA)).toBe(true);

      // Delete all
      await page.keyboard.press("ControlOrMeta+A");
      await page.keyboard.press("Backspace");
      expect(await getText(editable)).toEqual([""]);

      const textB = "e";
      await type(editable, textB);

      // Select item with Space
      await page.keyboard.press("ArrowUp");
      // TODO fix e2e to test Safari's wrong event order
      await page.keyboard.press("Space");
      const updatedB = await getText(editable);
      expect(updatedB).not.toEqual([textB]);
      expect(updatedB[0].length).toBeGreaterThan(textB.length + 1);
      expect(updatedB[0].toLowerCase().startsWith(textB)).toBe(true);
    });
  });
});

test.describe("Cut", () => {
  test("noop (collapsed selection)", async ({ page, browserName }) => {
    await page.goto(storyUrl("basics-plain--multiline"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    // Move caret
    await loop(2, () => page.keyboard.press("ArrowRight"));
    expect(await getSelection(editable)).toEqual([
      [[0], 2],
      [[0], 2],
    ]);

    // cut
    await page.keyboard.press("ControlOrMeta+X");

    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([
      [[0], 2],
      [[0], 2],
    ]);

    // https://github.com/microsoft/playwright/issues/13037#issuecomment-1078208810
    if (browserName !== "chromium") return;
    expect(await readClipboard(page, "text/plain")).toEqual(null);
    expect(await readClipboard(page, "text/html")).toEqual(null);
  });

  test("cut chars", async ({ page, browserName }) => {
    await page.goto(storyUrl("basics-plain--multiline"));

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
    // Expand selection
    const selLength = 3;
    await loop(selLength, () => page.keyboard.press("Shift+ArrowRight"));
    expect(await getSelection(editable)).toEqual([
      [[0], 1],
      [[0], 1 + selLength],
    ]);

    // cut
    await page.keyboard.press("ControlOrMeta+X");

    expect(await getText(editable)).toEqual(
      deleteAt(initialValue, selLength, [0, 1]),
    );
    expect(await getSelection(editable)).toEqual([
      [[0], 1],
      [[0], 1],
    ]);

    // https://github.com/microsoft/playwright/issues/13037#issuecomment-1078208810
    if (browserName !== "chromium") return;
    expect(await readClipboard(page, "text/plain")).toEqual(
      initialValue[0].slice(1, 1 + selLength),
    );
    expect(await readClipboard(page, "text/html")).toEqual(null);
  });

  test("cut linebreak", async ({ page, browserName }) => {
    await page.goto(storyUrl("basics-plain--multiline"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    // Move caret
    const len = 1;
    await loop(len, () => page.keyboard.press("ArrowRight"));
    expect(await getSelection(editable)).toEqual([
      [[0], len],
      [[0], len],
    ]);
    // Expand selection
    await page.keyboard.press("Shift+ArrowDown");
    expect(await getSelection(editable)).toEqual([
      [[0], len],
      [[1], len],
    ]);

    // cut
    await page.keyboard.press("ControlOrMeta+X");

    expect(await getText(editable)).toEqual([
      initialValue[0].slice(0, len) + initialValue[1].slice(len),
      ...initialValue.slice(2),
    ]);
    expect(await getSelection(editable)).toEqual([
      [[0], len],
      [[0], len],
    ]);

    // https://github.com/microsoft/playwright/issues/13037#issuecomment-1078208810
    if (browserName !== "chromium") return;
    expect(await readClipboard(page, "text/plain")).toEqual(
      [[initialValue[0].slice(len)], initialValue[1].slice(0, len)].join("\n"),
    );
    expect(await readClipboard(page, "text/html")).toEqual(null);
  });

  test("cut all", async ({ page, browserName }) => {
    await page.goto(storyUrl("basics-plain--multiline"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    // Select All
    await page.keyboard.press(`ControlOrMeta+A`);
    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[initialValue.length - 1], initialValue[initialValue.length - 1].length],
    ]);

    // cut
    await page.keyboard.press("ControlOrMeta+X");

    expect(await getText(editable)).toEqual([""]);
    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    // https://github.com/microsoft/playwright/issues/13037#issuecomment-1078208810
    if (browserName !== "chromium") return;
    expect(await readClipboard(page, "text/plain")).toEqual(
      initialValue.join("\n"),
    );
    expect(await readClipboard(page, "text/html")).toEqual(null);
  });
});

test.describe("Copy", () => {
  test.beforeEach(async ({ browserName }) => {
    // https://github.com/microsoft/playwright/issues/13037#issuecomment-1078208810
    test.skip(browserName !== "chromium");
  });

  test("copy selected", async ({ page }) => {
    await page.goto(storyUrl("basics-plain--multiline"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Shift+ArrowRight");
    await page.keyboard.press("Shift+ArrowDown");
    await page.keyboard.press("ControlOrMeta+C");

    expect(await readClipboard(page, "text/plain")).toEqual(
      [[initialValue[0].slice(1)], initialValue[1].slice(0, 1)].join("\n"),
    );
    expect(await readClipboard(page, "text/html")).toEqual(null);
  });

  test("copy all", async ({ page }) => {
    await page.goto(storyUrl("basics-plain--multiline"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.press("ControlOrMeta+C");

    expect(await readClipboard(page, "text/plain")).toEqual(
      initialValue.join("\n"),
    );
    expect(await readClipboard(page, "text/html")).toEqual(null);
  });
});

test.describe("Paste", () => {
  test.beforeEach(async ({ browserName }) => {
    // https://github.com/microsoft/playwright/issues/13037#issuecomment-1078208810
    test.skip(browserName !== "chromium");
  });

  const writeText = async (page: Page, value: string) => {
    await page.evaluate((t) => navigator.clipboard.writeText(t), value);
  };

  test.describe("multiline", () => {
    test("paste text", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--multiline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      // Move caret
      await loop(2, () => page.keyboard.press("ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[0], 2],
        [[0], 2],
      ]);

      // paste
      const pastedText = "Paste text.";
      await writeText(page, pastedText);
      await page.keyboard.press("ControlOrMeta+V");

      const charLength = pastedText.length;
      expect(await getText(editable)).toEqual(
        insertAt(initialValue, pastedText, [0, 2]),
      );
      expect(await getSelection(editable)).toEqual([
        [[0], 2 + charLength],
        [[0], 2 + charLength],
      ]);
    });

    test("paste linebreak", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--multiline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[0], 0],
        [[0], 0],
      ]);

      // Move caret
      await loop(2, () => page.keyboard.press("ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[0], 2],
        [[0], 2],
      ]);

      // paste
      const pastedText = "Paste \ntext.";
      await writeText(page, pastedText);
      await page.keyboard.press("ControlOrMeta+V");

      const [beforeLineBreak, afterLineBreak] = pastedText.split("\n");
      expect(await getText(editable)).toEqual(
        insertLineBreakAt(
          insertAt(initialValue, beforeLineBreak + afterLineBreak, [0, 2]),
          [0, 2 + beforeLineBreak.length],
        ),
      );
      expect(await getSelection(editable)).toEqual([
        [[1], afterLineBreak.length],
        [[1], afterLineBreak.length],
      ]);
    });
  });

  test.describe("singleline", () => {
    test("paste text", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--singleline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[], 0],
        [[], 0],
      ]);

      // Move caret
      await loop(2, () => page.keyboard.press("ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[], 2],
        [[], 2],
      ]);

      // paste
      const pastedText = "Paste text.";
      await writeText(page, pastedText);
      await page.keyboard.press("ControlOrMeta+V");

      const charLength = pastedText.length;
      expect(await getText(editable)).toEqual(
        insertAt(initialValue, pastedText, [0, 2]),
      );
      expect(await getSelection(editable)).toEqual([
        [[], 2 + charLength],
        [[], 2 + charLength],
      ]);
    });

    test("paste linebreak", async ({ page }) => {
      await page.goto(storyUrl("basics-plain--singleline"));

      const editable = await getEditable(page);
      const initialValue = await getText(editable);

      await editable.focus();

      expect(await getSelection(editable)).toEqual([
        [[], 0],
        [[], 0],
      ]);

      // Move caret
      await loop(2, () => page.keyboard.press("ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[], 2],
        [[], 2],
      ]);

      // paste
      const pastedText = "Paste \ntext.";
      await writeText(page, pastedText);
      await page.keyboard.press("ControlOrMeta+V");

      const pastedTextWithoutLinebreak = pastedText.split("\n").join("");
      const charLength = pastedTextWithoutLinebreak.length;
      expect(await getText(editable)).toEqual(
        insertAt(initialValue, pastedTextWithoutLinebreak, [0, 2]),
      );
      expect(await getSelection(editable)).toEqual([
        [[], 2 + charLength],
        [[], 2 + charLength],
      ]);
    });
  });
});

test.describe("Drag and Drop", () => {
  const dragSelectionTo = async (
    page: Page,
    editable: Locator,
    { line = 0, char = 0 }: { line?: number; char?: number },
  ) => {
    const selectedTextLength = (await getSeletedText(editable)).join("").length;
    const selected = await getSelectedRect(editable);
    const x = selected.x + selected.width / 2;
    const y = selected.y + selected.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await new Promise((resolve) => setTimeout(resolve, 250));
    await page.mouse.move(
      x + char * (selected.width / selectedTextLength),
      y + selected.height * line,
    );
    await page.mouse.up();
  };

  test("move chars", async ({ page }) => {
    await page.goto(storyUrl("basics-plain--multiline"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    {
      // Select [0,1]-[0,4]
      await page.keyboard.press("ArrowRight");
      const selLength = 3;
      await loop(selLength, () => page.keyboard.press("Shift+ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[0], 1],
        [[0], 1 + selLength],
      ]);

      // drop text to next line
      const [selectedText] = await getSeletedText(editable);
      await dragSelectionTo(page, editable, { line: 1 });
      expect(await getText(editable)).toEqual(
        insertAt(
          deleteAt(initialValue, selLength, [0, 1]),
          selectedText,
          [1, 1],
        ),
      );
      expect(await getSelection(editable)).toEqual([
        [[1], 1],
        [[1], 1 + selLength],
      ]);
    }

    // reset
    await page.keyboard.press(`ControlOrMeta+z`);
    await moveSelectionToOrigin(editable);
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    {
      // Select [1,2]-[1,4]
      await page.keyboard.press("ArrowDown");
      const selStart = 2;
      await loop(selStart, () => page.keyboard.press("ArrowRight"));
      const selLength = 2;
      await loop(selLength, () => page.keyboard.press("Shift+ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[1], selStart],
        [[1], selStart + selLength],
      ]);

      // drop text to swap
      const [selectedText] = await getSeletedText(editable);
      await dragSelectionTo(page, editable, { char: -2 });
      expect(await getText(editable)).toEqual(
        insertAt(
          deleteAt(initialValue, selLength, [1, selStart]),
          selectedText,
          [1, selStart - 1],
        ),
      );
      expect(await getSelection(editable)).toEqual([
        [[1], selStart - 1],
        [[1], selStart - 1 + selLength],
      ]);
    }

    // reset
    await page.keyboard.press(`ControlOrMeta+z`);
    await moveSelectionToOrigin(editable);
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    {
      // Select [1,1]-[1,3]
      await page.keyboard.press("ArrowDown");
      const selStart = 1;
      await loop(selStart, () => page.keyboard.press("ArrowRight"));
      const selLength = 2;
      await loop(selLength, () => page.keyboard.press("Shift+ArrowRight"));
      expect(await getSelection(editable)).toEqual([
        [[1], selStart],
        [[1], selStart + selLength],
      ]);

      // drop text to swap
      const [selectedText] = await getSeletedText(editable);
      await dragSelectionTo(page, editable, { char: 2 });
      expect(await getText(editable)).toEqual(
        insertAt(
          deleteAt(initialValue, selLength, [1, selStart]),
          selectedText,
          [1, selStart + 1],
        ),
      );
      expect(await getSelection(editable)).toEqual([
        [[1], selStart + 1],
        [[1], selStart + 1 + selLength],
      ]);
    }
  });

  // test("drop external", async ({ page }) => {
  //   // TODO
  // });
});

test.describe("undo and redo", () => {
  test("one char", async ({ page }) => {
    await page.goto(storyUrl("basics-plain--multiline"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    const text = "z";
    await type(editable, text);

    const editedValue = insertAt(initialValue, text, [0, 0]);
    expect(await getText(editable)).toEqual(editedValue);

    // undo
    await page.keyboard.press(`ControlOrMeta+z`);
    expect(await getText(editable)).toEqual(initialValue);

    // redo
    await page.keyboard.press(`ControlOrMeta+Shift+z`);
    expect(await getText(editable)).toEqual(editedValue);
  });
});

test.describe("keep selection on render", () => {
  test("command", async ({ page }) => {
    await page.goto(storyUrl("basics-plain--command"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    // Move caret
    await page.getByRole("button", { name: "move forward" }).click();
    expect(await getSelection(editable)).toEqual([
      [[0], 1],
      [[0], 1],
    ]);

    // insert
    await page.getByRole("button", { name: "insert" }).click();
    const text = "text";
    expect(await getText(editable)).toEqual(
      insertAt(initialValue, text, [0, 1]),
    );
    expect(await getSelection(editable)).toEqual([
      [[0], 1 + text.length],
      [[0], 1 + text.length],
    ]);

    // undo
    // TODO undo with button
    await page.keyboard.press(`ControlOrMeta+z`);
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([
      [[0], 1],
      [[0], 1],
    ]);

    // delete
    await page.getByRole("button", { name: "move focus forward" }).click();
    await page.getByRole("button", { name: "delete selection" }).click();
    expect(await getText(editable)).toEqual(deleteAt(initialValue, 1, [0, 1]));
    expect(await getSelection(editable)).toEqual([
      [[0], 1],
      [[0], 1],
    ]);
  });

  test("type in input", async ({ page }) => {
    await page.goto(storyUrl("basics-plain--highlight"));

    const editable = await getEditable(page);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    const searchInput = page.getByRole("textbox").first();
    const searchValue = await searchInput.inputValue();
    await searchInput.focus();

    // type on input
    const word = "hello";
    await type(searchInput, word, { delay: 50 });
    expect(await searchInput.inputValue()).toEqual(searchValue + word);

    // should keep selection on input
    expect(await getSelection(editable)).toEqual([
      [[], 0],
      [[], 0],
    ]);
  });

  test("richtext", async ({ page }) => {
    await page.goto(storyUrl("basics-structured--rich-text"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    {
      await page.keyboard.press("ArrowRight");
      expect(await getSelection(editable)).toEqual([
        [[0], 1],
        [[0], 1],
      ]);

      // Set block attr
      const setPromise = waitForStyleSet(editable, "textAlign", "right");
      await page.getByRole("button", { name: "align" }).click();
      expect(await getText(editable)).toEqual(initialValue);
      expect(await getSelection(editable)).toEqual([
        [[0], 1],
        [[0], 1],
      ]);
      expect(await setPromise).toBe(true);

      // Select texts
      await page.keyboard.press("Shift+ArrowLeft");
      const movedSelection = [
        [[0], 1],
        [[0], 0],
      ];
      expect(await getSelection(editable)).toEqual(movedSelection);

      // Unset block attr
      const unsetPromise = waitForStyleSet(
        editable,
        "textAlign",
        "right",
        true,
      );
      await page.getByRole("button", { name: "align" }).click();
      expect(await getText(editable)).toEqual(initialValue);
      expect(await getSelection(editable)).toEqual(movedSelection);
      expect(await unsetPromise).toBe(true);
    }

    {
      // Move caret
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowRight");
      expect(await getSelection(editable)).toEqual([
        [[1], 1],
        [[1], 1],
      ]);

      // Select texts
      await page.keyboard.press("Shift+ArrowRight");
      await page.keyboard.press("Shift+ArrowRight");
      const selectedSelection = [
        [[1], 1],
        [[1], 3],
      ];
      expect(await getSelection(editable)).toEqual(selectedSelection);

      // Set text format
      const setPromise = waitForStyleSet(editable, "fontStyle", "italic");
      await page.getByRole("button", { name: "italic" }).click();
      expect(await getText(editable)).toEqual(initialValue);
      expect(await getSelection(editable)).toEqual(selectedSelection);
      expect(await setPromise).toBe(true);

      // Unset text format
      const unsetPromise = waitForStyleSet(
        editable,
        "fontStyle",
        "italic",
        true,
      );
      await page.getByRole("button", { name: "italic" }).click();
      expect(await getText(editable)).toEqual(initialValue);
      expect(await getSelection(editable)).toEqual(selectedSelection);
      expect(await unsetPromise).toBe(true);
    }
  });
});

test("rtl", async ({ page }) => {
  await page.goto(storyUrl("basics-plain--rtl"));

  const editable = await getEditable(page);
  const initialValue = await getText(editable);

  await editable.focus();

  expect(await getSelection(editable)).toEqual([
    [[0], 0],
    [[0], 0],
  ]);

  // Move caret
  await page.keyboard.press("ArrowLeft");
  expect(await getSelection(editable)).toEqual([
    [[0], 1],
    [[0], 1],
  ]);

  {
    // Input
    const text = "test";
    await type(editable, text);
    const textLength = text.length;
    expect(await getText(editable)).toEqual(
      insertAt(initialValue, text, [0, 1]),
    );
    expect(await getSelection(editable)).toEqual([
      [[0], 1 + textLength],
      [[0], 1 + textLength],
    ]);
  }
});

test.describe("emoji", () => {
  test("surrogate pair", async ({ page }) => {
    await page.goto(storyUrl("basics-plain--multiline"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    const char = "a";

    const emoji = "👍";
    const offset = grapheme(initialValue[2]).indexOf(emoji);
    expect(offset).toBeGreaterThan(-1);

    const afterOffset = offset + 1;

    // move to after emoji
    await loop(afterOffset, () => page.keyboard.press("ArrowRight"));
    expect(await getSelection(editable)).toEqual([
      [[0], afterOffset],
      [[0], afterOffset],
    ]);
    // insert
    await type(editable, char);
    expect(await getText(editable)).toEqual(
      insertAt(initialValue, char, [0, afterOffset]),
    );
    expect(await getSelection(editable)).toEqual([
      [[0], afterOffset + 1],
      [[0], afterOffset + 1],
    ]);
    // delete
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([
      [[0], afterOffset],
      [[0], afterOffset],
    ]);
  });

  test("variation selector", async ({ page }) => {
    await page.goto(storyUrl("basics-plain--multiline"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    const char = "a";

    const emoji = "❤️";
    const offset = grapheme(initialValue[2]).indexOf(emoji);
    expect(offset).toBeGreaterThan(-1);

    const afterOffset = offset + 1;

    // move to after emoji
    await loop(afterOffset, () => page.keyboard.press("ArrowRight"));
    expect(await getSelection(editable)).toEqual([
      [[0], afterOffset],
      [[0], afterOffset],
    ]);
    // insert
    await type(editable, char);
    expect(await getText(editable)).toEqual(
      insertAt(initialValue, char, [0, afterOffset]),
    );
    expect(await getSelection(editable)).toEqual([
      [[0], afterOffset + 1],
      [[0], afterOffset + 1],
    ]);
    // delete
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([
      [[0], afterOffset],
      [[0], afterOffset],
    ]);
  });

  test("zero width joiner", async ({ page }) => {
    await page.goto(storyUrl("basics-plain--multiline"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    const char = "a";

    const emoji = "🧑‍🧑‍🧒";
    const offset = grapheme(initialValue[2]).indexOf(emoji);
    expect(offset).toBeGreaterThan(-1);

    const afterOffset = offset + 1;

    // move to after emoji
    await loop(afterOffset, () => page.keyboard.press("ArrowRight"));
    expect(await getSelection(editable)).toEqual([
      [[0], afterOffset],
      [[0], afterOffset],
    ]);
    // insert
    await type(editable, char);
    expect(await getText(editable)).toEqual(
      insertAt(initialValue, char, [0, afterOffset]),
    );
    expect(await getSelection(editable)).toEqual([
      [[0], afterOffset + 1],
      [[0], afterOffset + 1],
    ]);
    // delete
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([
      [[0], afterOffset],
      [[0], afterOffset],
    ]);
  });
});

test("readonly", async ({ page, browserName }) => {
  await page.goto(storyUrl("basics-plain--readonly"));

  const editable = await (
    await getEditable(page)
  ).evaluateHandle((e) => e as HTMLElement);

  const isReadonly = () => editable.evaluate((e) => e.contentEditable);

  expect(await isReadonly()).toEqual("true");

  // Enable readonly mode
  await page.getByRole("button").click();

  expect(await isReadonly()).toEqual("false");

  // Disable readonly mode
  await page.getByRole("button").click();

  expect(await isReadonly()).toEqual("true");

  // // Move caret
  // await page.keyboard.press("ArrowRight");
  // expect(await getSelection(editable)).toEqual([[0,1],[0,1]]);

  // {
  //   // Input should be ignored
  //   const text = "test";
  //   await input(editable, text);
  //   expect(await getText(editable)).toEqual(initialValue);
  //   expect(await getSelection(editable)).toEqual(
  //   [[[0],1],[0,1]]
  //   );
  // }

  // if (browserName === "chromium") {
  //   // IME input should be ignored
  //   const client = await page.context().newCDPSession(page);
  //   await client.send("Input.imeSetComposition", {
  //     selectionStart: -1,
  //     selectionEnd: -1,
  //     text: "😂😂",
  //   });
  //   await client.send("Input.imeSetComposition", {
  //     selectionStart: 1,
  //     selectionEnd: 2,
  //     text: "😭",
  //   });
  //   await client.send("Input.insertText", {
  //     text: "😂😭",
  //   });
  //   expect(await getText(editable)).toEqual(initialValue);
  //   expect(await getSelection(editable)).toEqual(
  //   [[[0],1],[0,1]]
  //   );
  // }
});

test("placeholder", async ({ page }) => {
  await page.goto(storyUrl("basics-plain--placeholder"));

  const editable = await getEditable(page);
  const initialValue = await getText(editable);

  await editable.focus();

  // const getPlaceholder = () =>
  //   editable.evaluate((e) => {
  //     return window.getComputedStyle(e, "before").getPropertyValue("content");
  //   });

  expect(initialValue).toEqual([""]);
  expect(await getSelection(editable)).toEqual([
    [[], 0],
    [[], 0],
  ]);
  // expect((await getPlaceholder()).includes("Enter some text...")).toBe(true);

  // Input
  const char = "a";
  await type(editable, char);

  const value1 = await getText(editable);
  expect(value1).toEqual(insertAt(initialValue, char, [0, 0]));
  expect(await getSelection(editable)).toEqual([
    [[], 1],
    [[], 1],
  ]);
  // expect((await getPlaceholder()).includes("Enter some text...")).toBe(false);

  await page.keyboard.press("Backspace");
  const value2 = await getText(editable);
  expect(value2).toEqual([""]);
  expect(await getSelection(editable)).toEqual([
    [[], 0],
    [[], 0],
  ]);
  // expect((await getPlaceholder()).includes("Enter some text...")).toBe(true);
});

test.describe("keep state on render", () => {
  test("sync", async ({ page }) => {
    await page.goto(storyUrl("basics-plain--highlight"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    const searchInput = page.getByRole("textbox").first();
    const searchValue = await searchInput.inputValue();
    const searchValueLength = searchValue.length;
    expect(searchValueLength).toBeGreaterThan(1);

    const markedOffset = initialValue[0].indexOf(searchValue);
    const char = "a";

    // type just before node
    await loop(markedOffset, () => page.keyboard.press("ArrowRight"));
    expect(await getSelection(editable)).toEqual([
      [[0], markedOffset],
      [[0], markedOffset],
    ]);

    // insert
    await type(editable, char);
    expect(await getText(editable)).toEqual(
      insertAt(initialValue, char, [0, markedOffset]),
    );
    expect(await getSelection(editable)).toEqual([
      [[0], markedOffset + 1],
      [[0], markedOffset + 1],
    ]);

    // delete
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([
      [[0], markedOffset],
      [[0], markedOffset],
    ]);

    // type on node
    await page.keyboard.press("ArrowRight");
    expect(await getSelection(editable)).toEqual([
      [[0], markedOffset + 1],
      [[0], markedOffset + 1],
    ]);

    // insert
    await type(editable, char);
    expect(await getText(editable)).toEqual(
      insertAt(initialValue, char, [0, markedOffset + 1]),
    );
    expect(await getSelection(editable)).toEqual([
      [[0], markedOffset + 2],
      [[0], markedOffset + 2],
    ]);

    // delete
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([
      [[0], markedOffset + 1],
      [[0], markedOffset + 1],
    ]);

    // type just after node
    await loop(searchValueLength - 1, () => page.keyboard.press("ArrowRight"));
    expect(await getSelection(editable)).toEqual([
      [[0], markedOffset + searchValueLength],
      [[0], markedOffset + searchValueLength],
    ]);

    // insert
    await type(editable, char);
    expect(await getText(editable)).toEqual(
      insertAt(initialValue, char, [0, markedOffset + searchValueLength]),
    );
    expect(await getSelection(editable)).toEqual([
      [[0], markedOffset + searchValueLength + 1],
      [[0], markedOffset + searchValueLength + 1],
    ]);

    // delete
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([
      [[0], markedOffset + searchValueLength],
      [[0], markedOffset + searchValueLength],
    ]);
  });

  test("async", async ({ page }) => {
    await page.goto(storyUrl("advanced-with-textlint--with-textlint"));

    const editable = await getEditable(page);
    const initialValue = await getText(editable);

    await editable.focus();

    expect(await getSelection(editable)).toEqual([
      [[0], 0],
      [[0], 0],
    ]);

    const markedOffset = await editable.evaluate((e) => {
      const marks = e.querySelectorAll('span[style*="text-decoration"]');
      if (marks.length < 2) throw new Error();
      const secondMark = marks[1];
      if (
        e.firstChild !== secondMark.parentNode ||
        secondMark.textContent!.length !== 1
      )
        throw new Error();
      let offset = 0;
      let n: Node = secondMark;
      while ((n = n.previousSibling!)) {
        offset += n.textContent!.length;
      }
      return offset;
    });
    const char = "a";

    // type just before node
    await loop(markedOffset, () => page.keyboard.press("ArrowRight"));
    expect(await getSelection(editable)).toEqual([
      [[0], markedOffset],
      [[0], markedOffset],
    ]);

    // insert
    await type(editable, char);
    expect(await getText(editable)).toEqual(
      insertAt(initialValue, char, [0, markedOffset]),
    );
    expect(await getSelection(editable)).toEqual([
      [[0], markedOffset + 1],
      [[0], markedOffset + 1],
    ]);

    // delete
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([
      [[0], markedOffset],
      [[0], markedOffset],
    ]);

    // type just after node
    await page.keyboard.press("ArrowRight");
    expect(await getSelection(editable)).toEqual([
      [[0], markedOffset + 1],
      [[0], markedOffset + 1],
    ]);

    // insert
    await type(editable, char);
    expect(await getText(editable)).toEqual(
      insertAt(initialValue, char, [0, markedOffset + 1]),
    );
    expect(await getSelection(editable)).toEqual([
      [[0], markedOffset + 2],
      [[0], markedOffset + 2],
    ]);

    // delete
    await page.keyboard.press("Backspace");
    expect(await getText(editable)).toEqual(initialValue);
    expect(await getSelection(editable)).toEqual([
      [[0], markedOffset + 1],
      [[0], markedOffset + 1],
    ]);
  });
});

test("new window", async ({ page, context }) => {
  await page.goto(storyUrl("advanced-newwindow--default"));

  // open new window
  const newPagePromise = context.waitForEvent("page");
  await page.getByRole("button", { name: "open window" }).click();
  const newPage = await newPagePromise;

  const editable = await getEditable(newPage);
  const initialValue = await getText(editable);

  await editable.focus();

  expect(await getSelection(editable)).toEqual([
    [[0], 0],
    [[0], 0],
  ]);

  // Move caret
  await newPage.keyboard.press("ArrowRight");
  expect(await getSelection(editable)).toEqual([
    [[0], 1],
    [[0], 1],
  ]);

  // Input
  const text = "test";
  await type(editable, text);
  expect(await getText(editable)).toEqual(insertAt(initialValue, text, [0, 1]));
  const textLength = text.length;
  expect(await getSelection(editable)).toEqual([
    [[0], 1 + textLength],
    [[0], 1 + textLength],
  ]);
});
