import { defineConfig } from "vitest/config";
import type { BrowserCommand } from "vitest/node";
import { playwright } from "@vitest/browser-playwright";

// Commands dispatching trusted events through the playwright page
const press: BrowserCommand<[key: string]> = async ({ page }, key) => {
  await page.keyboard.press(key);
};

// Coordinates are relative to the tester iframe
const mouseDrag: BrowserCommand<
  [from: [x: number, y: number], to: [x: number, y: number]]
> = async ({ page }, [fromX, fromY], [toX, toY]) => {
  const iframe = await page.locator("iframe[data-vitest]").boundingBox();
  const offsetX = iframe?.x ?? 0;
  const offsetY = iframe?.y ?? 0;
  await page.mouse.move(offsetX + fromX, offsetY + fromY);
  await page.mouse.down();
  await new Promise((resolve) => setTimeout(resolve, 250));
  await page.mouse.move(offsetX + toX, offsetY + toY);
  await page.mouse.up();
};

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          root: "src",
          environment: "node",
          exclude: ["**/*.browser.spec.*", "**/node_modules/**"],
          typecheck: {
            enabled: true,
            tsconfig: "../tsconfig.json",
          },
        },
      },
      {
        test: {
          name: "browser",
          include: ["src/**/*.browser.spec.*"],
          browser: {
            enabled: true,
            headless: true,
            // Wide enough not to wrap the fixture lines, since arrow keys move the caret by visual lines and fonts differ between environments
            viewport: { width: 1280, height: 720 },
            provider: playwright(),
            instances: [
              {
                browser: "chromium",
                provider: playwright({
                  contextOptions: {
                    // Clipboard is readable only in chromium, which can grant the permission
                    permissions: ["clipboard-read", "clipboard-write"],
                  },
                }),
              },
              { browser: "firefox" },
              { browser: "webkit" },
            ],
            screenshotFailures: false,
            commands: { press, mouseDrag },
          },
        },
      },
    ],
  },
});
