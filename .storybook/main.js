import { mergeConfig } from "vite";

/** @type { import('@storybook/react-vite').StorybookConfig } */
export default {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      legacy: {
        // for textlint
        inconsistentCjsInterop: true,
      },
    });
  },
};
