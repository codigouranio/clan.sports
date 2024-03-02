const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const pageFiles = fs.readdirSync("./src/assets/").filter(function (file) {
  return file.match(/.*\.html$/);
});

const pageEntries = pageFiles.map((filename) => {
  return new HtmlWebpackPlugin({
    template: path.join("./src/assets/", filename),
    filename: filename,
  });
});

module.exports = {
  entry: {
    app: "./src/app.js",
  },
  resolve: {
    modules: [path.resolve(__dirname, "./src"), "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(sc|sa|c)ss/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
        include: [path.resolve(__dirname, "src")],
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/, /assets/],
        use: ["babel-loader"],
      },
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  mode: "development",
  output: {
    path: path.join(__dirname, "/build/"),
    filename: "./bundle.js",
  },
  plugins: [
    ...pageEntries,
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/assets/vendor", to: "vendor", noErrorOnMissing: true },
      ],
    }),
    new WebpackManifestPlugin(),
    new CleanWebpackPlugin(),
  ],
};
