import { defineConfig, devices } from "@playwright/test";
import { existsSync, readdirSync } from "node:fs";

const examples = readdirSync("examples", { withFileTypes: true })
  .filter((d) => existsSync(`examples/${d.name}/package.json`))
  .map((d, i) => ({ name: d.name, port: 6006 + i }));

export default defineConfig({
  testDir: "./e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    trace: "on-first-retry",
  },
  projects: examples.map(({ name, port }) => ({
    name,
    use: { baseURL: `http://127.0.0.1:${port}` },
  })),
  webServer: examples.map(({ name, port }) => ({
    command: `(cd examples/${name} && npm run build && npx http-server dist -p ${port})`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
  })),
});
