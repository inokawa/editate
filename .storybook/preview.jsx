export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "fullscreen",
  options: {
    storySort: {
      order: ["basics", ["structured", "plain"], "advanced"],
    },
  },
  docs: {
    codePanel: true,
  },
};
