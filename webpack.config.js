const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  entry: {
    app: "./assets/js/script.js",
    events: "./assets/js/events.js",
    schedule: "./assets/js/schedule.js",
    tickets: "./assets/js/tickets.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: `${__dirname}/dist`,
  },
  module: {
    // Regex for ending in webp while being case-insensitive
    rules: [
      {
        test: /\.webp$/i,
        use: [
          {
            loader: "file-loader",
            // Not only does it give the images proper names, but it puts them in proper folders
            // In this case, assets/img inside of the dist folder
            options: {
              esModule: false,
              name(file) {
                return "[path][name].[ext]";
              },
              publicPath: function (url) {
                // Replaces the ../ from require() with /assets/
                return url.replace("../", "/assets/");
              },
            },
          },
          {
            loader: "image-webpack-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static", // The report outputs to an HTML file in the dist folder
    }),
  ],
  mode: "development",
};
