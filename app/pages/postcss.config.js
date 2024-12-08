module.exports = {
  syntax: "postcss-scss",
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "css-declaration-sorter": {
      order: "smacss",
    },
  },
};
