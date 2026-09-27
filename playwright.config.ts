import { defineConfig, devices } from "@playwright/test";

const FRAMEWORK_DIR = process.env.FRAMEWORK_DIR;
if (!FRAMEWORK_DIR) {
  throw new Error("FRAMEWORK_DIR is required");
}

export default defineConfig({
  testDir: "./e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    trace: "on-first-retry",
  },
  webServer: {
    command: `(cd ${FRAMEWORK_DIR} && npm run build && npx http-server dist -p 6006)`,
    url: "http://127.0.0.1:6006",
    reuseExistingServer: !process.env.CI,
  },
});
