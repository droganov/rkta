"use strict"
var path = require("path");
var webpack = require("webpack");
var StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
var ExtractTextPlugin      = require("extract-text-webpack-plugin");

module.exports = function ( pro ){
   var extention = ".js";
   var plugins = [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.NoErrorsPlugin(),
      new ExtractTextPlugin("[name].css", {
         allChunks: true
      })
   ];

   var targetDir = "www_root/_assets";
   var stylusLoaderString = "css-loader!stylus-loader";
   if(pro) {
      targetDir = "www_root/assets";
      stylusLoaderString = "css-loader?minimize!stylus-loader";
      plugins.push( new webpack.DefinePlugin({
         'process.env': {
            'NODE_ENV': JSON.stringify('production')
         }
      }));
   } else {
      plugins.push(new webpack.HotModuleReplacementPlugin());
   }

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

   var cfg = {
      // cache: true,
      entry: {
         www: [
            "./app/www/client"
         ]
         // exlab: ["./app/exlab/client"]
      },
      output: {
         path: path.join( __dirname, "/../", targetDir),
         publicPath: "/",
         filename: "[name]" + extention,
         chunkFilename: "[name].[chunkhash]" + extention
      },

      module: {
         loaders: [
            {
               test: /\.styl$/,
               loader: ExtractTextPlugin.extract(stylusLoaderString)
            },
            {
               test: /\.svg$/,
               loader: "svg-inline",
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
   };

   if(!pro) {
      cfg.entry.www.push('webpack-hot-middleware/client');
   }

   return cfg;

}
