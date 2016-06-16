"use strict"
var path                 = require( "path" )
var fs                   = require( "fs" )
var webpack              = require( "webpack" )
var StatsWriterPlugin    = require( "webpack-stats-plugin" ).StatsWriterPlugin
var ExtractTextPlugin    = require( "extract-text-webpack-plugin" )

var applications = []
var entries = {}
var configApplications = require("./config.applications")
for (var i = 0; i < configApplications.length; i++) {
  var appName = configApplications[i].name
  var entry = {}
  entry[ appName ] = [ "./app/" + appName ]
  Object.assign( entries, entry )
}

// console.log( path.join( __dirname, "/../build" ) )

var nodeModules = {}
fs
  .readdirSync( "node_modules" )
  .filter( function( x ){ return ['.bin'].indexOf(x) === -1 })
  .forEach( function( mod ){ nodeModules[ mod ] = "commonjs " + mod })

var defaultConfig = require( "./config.webpack.default" )
var exportConfig = Object.assign( {}, defaultConfig, {
  output: {
    path: path.join( __dirname, "/../build" ),
    publicPath: "/assets/",
    filename: "[name].js",
    chunkFilename: "[name].[chunkhash].js",
    library: "rkta",
    libraryTarget: "commonjs2",
  },
  entry: entries,
  target: "node",
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
  module: {
    loaders: defaultConfig.module.loaders.concat([
      {
        test: /\.css$/,
        loaders: [
          "css-loader/locals?modules&importLoaders=1&localIdentName=" + process.env.LOCAL_IDENT_NAME,
          "postcss-loader",
        ]
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
  externals: nodeModules,
})

module.exports = exportConfig
