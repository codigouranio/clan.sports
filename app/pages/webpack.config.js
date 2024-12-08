const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const webpack = require("webpack");

// const pageFiles = fs.readdirSync("./src/assets/").filter(function (file) {
//   return file.match(/.*\.html$/);
// });

// const pageEntries = pageFiles.map((filename) => {
//   return new HtmlWebpackPlugin({
//     template: path.join("./src/assets/", filename),
//     filename: filename,
//     chunks: ["app"],
//   });
// });
const pageEntries = [
  new HtmlWebpackPlugin({
    template: path.join("./src/assets/index.html"),
    filename: "index.html",
    chunks: ["app"],
  }),
  new HtmlWebpackPlugin({
    template: path.join("./src/assets/login.html"),
    filename: "login.html",
    chunks: ["login"],
  }),
];

module.exports = {
  entry: {
    app: "./src/app.js",
    login: "./src/login.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build"),
    clean: true, // Cleans the output directory before each build
  },
  resolve: {
    modules: [path.resolve(__dirname, "./src"), "node_modules"],
    alias: {
      pico: path.resolve(__dirname, "node_modules/@picocss/pico/scss"),
    },
  },
  devtool: "source-map",
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
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: [
                  path.resolve(__dirname, "node_modules/@picocss/pico/scss"),
                  path.resolve(__dirname, "node_modules"),
                ],
              },
            },
          },
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
  plugins: [
    ...pageEntries,
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "css/[name].css",
      chunkFilename: "css/[name].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/assets/*.ico",
          to({ context, absoluteFilename }) {
            return "./[name][ext]";
          },
          noErrorOnMissing: true,
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/assets/vendor", to: "vendor", noErrorOnMissing: true },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/assets/img", to: "img", noErrorOnMissing: true },
      ],
    }),
    new WebpackManifestPlugin({
      writeToFileEmit: true,
    }),
    new CleanWebpackPlugin(),
  ],
};
