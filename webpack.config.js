const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const WebpackPwaManifest = require("webpack-pwa-manifest");

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
    publicPath: "",
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
    new WebpackPwaManifest({
      name: "Food Event",
      short_name: "Foodies",
      description: "An app that allows you to view upcoming food events.",
      // homepage for the PWA relative to the location of the manifest file
      start_url: "../index.html",
      background_color: "#01579b",
      theme_color: "#ffffff",
      // Generates a unique fingerprint each time a new webpack is generated (do not want here)
      fingerprints: false,
      // Determines whether the link to the manifest file is added to the HTML
      // False because we are not using fingerprints. It might be true otherwise.
      inject: false,
      icons: [
        {
          // Path to the icon image we want to use
          src: path.resolve("assets/img/icons/icon-512x512.png"),
          // Icons with sizes (created from the linked image above)
          sizes: [96, 128, 192, 256, 384, 512],
          // Where the new icons of different size are stored
          destination: path.join("assets", "icons"),
        },
      ],
    }),
  ],
  mode: "development",
};
