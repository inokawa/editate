import pkg from "./package.json" with { type: "json" };
import { basename } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    outDir: "./lib",
    lib: {
      entry: "src/index.ts",
      formats: ["es", "cjs"],
      fileName: (f) => basename(f === "es" ? pkg.module : pkg.main),
    },
    rolldownOptions: {
      external: (id) =>
        [
          ...Object.keys(pkg.dependencies || {}),
          ...Object.keys(pkg.devDependencies || {}),
        ].some((d) => id.startsWith(d)),
    },
    sourcemap: true,
    minify: "terser",
    terserOptions: {
      ecma: 2018,
      module: true,
      compress: { passes: 5, unsafe: true, keep_fargs: false },
      mangle: { properties: { regex: "^_" } },
      format: {
        beautify: true, // FIXME replace with prettier
      },
    },
  },
  plugins: [dts({ exclude: ["**/*.{spec,stories}.*"] })],
});
