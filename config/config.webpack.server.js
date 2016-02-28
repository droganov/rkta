"use strict"
var path                 = require("path")
var webpack              = require( "webpack" )
var StatsWriterPlugin    = require("webpack-stats-plugin").StatsWriterPlugin
var ExtractTextPlugin    = require("extract-text-webpack-plugin")

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

console.log( path.join( __dirname, "/../build" ) )

var defaultConfig = require( "./config.webpack.default" )
var exportConfig = Object.assign( {}, defaultConfig, {
  // devtool: "cheap-module-source-map",
  output: {
    path: path.join( __dirname, "/../build" ),
    publicPath: "/assets/",
    filename: "[name].js",
    chunkFilename: "[name].[chunkhash].js",
  },
  entry: entries,
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: false,
      __SERVER__: true,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false,
    }),
  ],
  module: {
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
