"use strict"
var path = require("path");
var webpack = require("webpack");
var StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
var ExtractTextPlugin      = require("extract-text-webpack-plugin");

var applications = [ "www", "todo" ];

module.exports = function ( isProduction ){
  var extention = ".js";
  var plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify( isProduction ? "production" : "development" )
      }
    })
  ];

  var putAssetsTo = "www_root/_assets";
  var stylusLoaderString = "css-loader!stylus-loader";
  var babelPresets = [ "es2015", "stage-0", "react" ];

  if( isProduction ){
    putAssetsTo = "www_root/assets";
    stylusLoaderString = "css-loader?minimize!stylus-loader";

    // extract styles
    plugins.push( new ExtractTextPlugin("[name].css", {
      allChunks: true
    }));

    // compress js
    plugins.push( new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      },
      output: {
        // all comments cut
        comments: function () { return false; }
      }
    }));

  }
  else {
    babelPresets.push("react-hmre");

    // hot reload in development mode
    plugins.push(new webpack.HotModuleReplacementPlugin());

    // write stats
    plugins.push(
      new StatsWriterPlugin({
        chunkModules: true,
        filename: "../../build/stats.json",
        fields: [ "hash", "version", "errorDetails" ]
      })
    );
  }

  var entries = {};
  applications.forEach( function( app ){
    var entry = {};
    var entryContent = [ "./app/" + app + "/client" ];
    if( !isProduction ) entryContent.push( "webpack-hot-middleware/client" );
    entry[ app ] = entryContent;
    Object.assign( entries, entry );
  });

  var confiObject = {
    entry: entries,
    output: {
      path: path.join( __dirname, "/../", putAssetsTo),
      publicPath: "/",
      filename: "[name]" + extention,
      chunkFilename: "[name].[chunkhash]" + extention
    },

    module: {
      loaders: [
        {
          test: /\.styl$/,
          loader: ( isProduction? ExtractTextPlugin.extract(stylusLoaderString): stylusLoaderString)
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
          query: {
            presets: babelPresets
          }
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
      import: [ "~nib/lib/nib/index.styl" ],
    },
  };
  return confiObject;
}
