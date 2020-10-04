var path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/EasyCrudTable.js",
  output: {
    path: path.resolve("build"),
    filename: "EasyCrudTable.js",
    libraryTarget: "commonjs2",
  },
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }],
  },
  externals: {
    react: "react",
  },
};
