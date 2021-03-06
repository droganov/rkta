"use strict"
var webpack              = require( "webpack" );
var StatsWriterPlugin    = require("webpack-stats-plugin").StatsWriterPlugin;
var ExtractTextPlugin    = require("extract-text-webpack-plugin");
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

var chunks = []
var entries = {}
var configApplications = require("./config.applications")
for (var i = 0; i < configApplications.length; i++) {
  var appName = configApplications[i].name
  var entry = {}
  entry[ appName ] = [ "babel-polyfill", "./front-end/applications/" + appName ]
  chunks.push( appName )
  Object.assign( entries, entry )
}

var defaultConfig = require( "./config.webpack.default" )
var exportConfig = Object.assign( {}, defaultConfig, {
  entry: entries,
  target: "web",
  module: {
    loaders: defaultConfig.module.loaders.concat([
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract( "css-loader?modules&importLoaders=1&localIdentName=" + process.env.LOCAL_IDENT_NAME + "!stylus-loader" ),
      },
    ]),
    postLoaders: [
      {
        test: /\.(jsx|es6)/,
        exclude: /(node_modules|www_root\/bower)/,
        loader: "babel",
      }
    ],
  },
  plugins: [
    // new webpack.NoErrorsPlugin(),
    new LodashModuleReplacementPlugin(),
    new webpack.EnvironmentPlugin( [ "NODE_ENV" ] ),
    new ExtractTextPlugin("[name].css", {
      allChunks: true
    }),
    new StatsWriterPlugin({
      chunkModules: true,
      filename: "../../back-end/build/stats.json",
      fields: [ "hash", "version", "errorDetails" ]
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      async: true,
      children: true,
      chunks: chunks,
      minChunks: 2,
      name: "shared",
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        // dead_code: true,
        // drop_console: true,
        warnings: true,
      },
      sourceMap: false
    }),
  ],
})

module.exports = exportConfig
