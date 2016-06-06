"use strict"
var webpack = require( "webpack" );
var path = require( "path" );

var defaultConfig = require( "./config.webpack.default" )

var targetPath = path.join(__dirname, "../build/dll");

var clientDllEntries = [
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
  "babel-runtime/helpers/classCallCheck"
];

var exportConfig = Object.assign( {}, defaultConfig, {
  entry: {
    hmr: [
      "babel-preset-react-hmre"
    ].concat(clientDllEntries)
  },
  output: {
      path: path.join(__dirname, "../www_root/assets"),
      filename: "[name].dll.js",
      library: "[name]_[hash]",
  },
  plugins: [
    new webpack.DllPlugin({
        path: path.join(__dirname, "../build/dll/[name]-manifest.json"),
        name: "[name]_[hash]"
    })
  ],
})

module.exports = exportConfig
