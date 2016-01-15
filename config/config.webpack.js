"use strict"
var path = require("path");
var webpack = require("webpack");
var StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
// var ExtractTextPlugin      = require("extract-text-webpack-plugin");

module.exports = function ( compress ){
   var extention = compress ? ".min.js" : ".js";
   var plugins = [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
   ];
   if( compress ){
      // uglify
      plugins.push( new webpack.optimize.UglifyJsPlugin(
         {
            compressor: {
               warnings: false,
            },
         }
      ));
   };

   // write stats
   plugins.push(
      new StatsWriterPlugin(
         {
            chunkModules: true,
            filename: "../../build/stats.json",
            fields: [ "hash", "version", "errorDetails" ]
         }
      )
   );

   // TODO: extruct styles

   return ({
      // cache: true,
      entry: {
         www: [
            "./app/www/client",
            'webpack-hot-middleware/client'
         ]
         // exlab: ["./app/exlab/client"]
      },
      // devtool: '#source-map',
      output: {
         path: path.join( __dirname, "/../", "www_root/_assets"),
         publicPath: "/",
         filename: "[name]" + extention,
         chunkFilename: "[name].[chunkhash]" + extention
      },

      module: {
         loaders: [
            {
               test: /\.css$/,
               loader: "style-loader!css-loader",
            },
            {
               test: /\.svg$/,
               loader: "svg-inline",
            },
            {
               test: /\.styl$/,
               loader: "css-loader!stylus-loader",
            },
            {
               test: /\.(woff|woff2)/,
               loader: "url?limit=100000",
            }
         ],
         postLoaders: [
            {
               test: /\.(jsx|es6)/,
               exclude: /(node_modules|www_root\/bower)/,
               loader: "babel",
               // query: {
               //    stage: 0,
               //    presets:[ "react", "es2015", "stage-0" ],
               // }
            }
         ]
      },
      resolve: {
         extensions: [ "", ".jsx", ".js", ".es6", ".styl", ".css", ".svg" ],
   		// modulesDirectories: ["src", "src/blocks", "web_modules", "bower_components", "node_modules"],
      },

      plugins: plugins,
      stylus: {
         use: [ require("nib")() ],
      },
   });

}
