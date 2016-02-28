"use strict"
var webpack              = require( "webpack" );
var ExtractTextPlugin    = require("extract-text-webpack-plugin");

var applications = []
var entries = {}
var configApplications = require("./config.applications")
for (var i = 0; i < configApplications.length; i++) {
  var appName = configApplications[i].name
  var entry = {}
  entry[ appName ] = [
    "./app/" + appName // + "/app"
  ]
  Object.assign( entries, entry );
}

var defaultConfig = require( "./config.webpack.default" )
var exportConfig = Object.assign( {}, defaultConfig, {
  entry: entries,
  plugins: [
    new ExtractTextPlugin("[name].css", {
      allChunks: true
    })
  ],
  module: {
    loaders: defaultConfig.module.loaders.concat([
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract( "css-loader!stylus-loader" ),
      },
    ]),
    postLoaders: [
      {
        test: /\.(jsx|es6)/,
        exclude: /(node_modules|www_root\/bower)/,
        loader: "babel",
      }
    ]
  },
})

module.exports = exportConfig
