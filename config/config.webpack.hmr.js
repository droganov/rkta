"use strict"
var webpack = require( "webpack" )

var applications = []
var entries = {}
var configApplications = require("./config.applications")
for (var i = 0; i < configApplications.length; i++) {
  var appName = configApplications[i].name
  var entry = {}
  entry[ appName ] = [
    "webpack-hot-middleware/client",
    "./app/" + appName //+ "/app"
  ]
  Object.assign( entries, entry );
}

var defaultConfig = require( "./config.webpack.default" )
var exportConfig = Object.assign( {}, defaultConfig, {
  // devtool: "sourcemap",
  entry: entries,
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: defaultConfig.module.loaders.concat([
      {
        test: /\.styl$/,
        // loader: "css-loader!stylus-loader",
        loaders: [
          "style-loader",
          "css-loader?modulesimportLoaders=1&localIdentName=[path]-[local]",
          "stylus-loader",
        ]
        // loaders: [
        //   "isomorphic-style-loader",
        //   "css-loader?modules&localIdentName=[name]_[local]_[hash:base64:3]",
        //   "stylus-loader"
        // ]
      },
    ]),
    postLoaders: [
      {
        test: /\.(jsx|es6)/,
        exclude: /(node_modules|www_root\/bower)/,
        loader: "babel",
        query: {
          presets: [ "react-hmre" ]
        }
      }
    ]
  },
})

module.exports = exportConfig
