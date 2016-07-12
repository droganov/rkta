"use strict"
var webpack = require( "webpack" );
var StatsWriterPlugin    = require("webpack-stats-plugin").StatsWriterPlugin;
var path = require( "path" );

var defaultConfig = require( "./config.webpack.default" )

var exportConfig = Object.assign( {}, defaultConfig, {
  entry: {
    hmr: [
      "classnames", "mobile-detect",
      "css-loader/lib/css-base",
      "racer", "racer-react", "react", "material-ui", "react-fluid-svg", "react-responsive", "react-helmet",
      "redux", "react-router-redux", "react-redux",
      "babel-runtime/core-js/object/assign",
      "babel-runtime/core-js/object/keys",
      "babel-runtime/core-js/object/get-prototype-of",
      "babel-runtime/core-js/array/concat",
      "babel-runtime/helpers/possibleConstructorReturn",
      "babel-runtime/helpers/createClass",
      "babel-runtime/helpers/inherits",
      "babel-runtime/helpers/extends",
      "babel-runtime/helpers/defineProperty",
      "babel-runtime/helpers/classCallCheck",
      "babel-preset-react-hmre"
    ]
  },
  output: {
      path: path.join(__dirname, "../www_root/build"),
      filename: "[name].dll.js",
      library: "[name]_[hash]"
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new StatsWriterPlugin({
      chunkModules: true,
      filename: "../../build/dll/stats.json",
      fields: [ "hash", "version", "errorDetails" ]
    }),
    new webpack.DllPlugin({
        path: path.join(__dirname, "../build/dll/[name]-manifest.json"),
        name: "[name]_[hash]"
    })
  ],
})

module.exports = exportConfig
