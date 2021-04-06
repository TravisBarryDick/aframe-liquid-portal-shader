const path = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    https: true,
    contentBase: "./dist",
  },
  output: {
    filename: "aframe-liquid-portal-shader.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "aframeLiquidPortalShader",
      type: "umd",
    },
  },
  externals: {
    aframe: "aframe",
  },
};
