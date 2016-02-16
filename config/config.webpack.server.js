"use strict"
var path = require("path");
var webpack = require("webpack");
var StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
var ExtractTextPlugin      = require("extract-text-webpack-plugin");

var applications = [];
var configApplications = require("./config.applications");
for (var i = 0; i < configApplications.length; i++) {
  applications.push( configApplications[i].name );
}

module.exports = function ( isProduction ){
  var extention = ".js";
  var plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify( isProduction ? "production" : "development" )
      }
    }),
    new ExtractTextPlugin("[name].css", {
      allChunks: true
    }),
    new StatsWriterPlugin({
      chunkModules: true,
      filename: "../../build/stats.json",
      fields: [ "hash", "version", "errorDetails" ]
    }),
    new webpack.optimize.DedupePlugin()
  ];

  var putAssetsTo = "www_root/_assets";
  var stylusLoaderString = "css-loader!stylus-loader";
  var babelPresets = [ "es2015", "stage-0", "react" ];

  if( isProduction ){
    putAssetsTo = "www_root/assets";
    stylusLoaderString = "css-loader?minimize!stylus-loader";

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

  } else {
    // hot reload in development mode
    babelPresets.push("react-hmre");
    plugins.push( new webpack.HotModuleReplacementPlugin() );
    plugins.push( new webpack.NoErrorsPlugin() );
  }

  var entries = {};
  applications.forEach( function( app ){
    var entry = {};
    var entryContent = [ "./app/" + app + "/client" ];
    if( !isProduction ) entryContent.push( "koa-webpack-hot-middleware/node_modules/webpack-hot-middleware/client" );
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
          loader: ExtractTextPlugin.extract(stylusLoaderString)
        },
        {
          test: /\.svg$/,
          loader: "svg-inline",
        },
        {
          test: /\.(woff|woff2)/,
          loader: "url?limit=100000",
        },
        {
          test: /\.json$/,
          loader: "json"
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
