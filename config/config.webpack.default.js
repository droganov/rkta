"use strict"
var path = require("path");
var webpack = require("webpack");

var applications = [];
var configApplications = require("./config.applications");
for (var i = 0; i < configApplications.length; i++) {
  applications.push( configApplications[i].name );
}

var bundleExtention = ".js";
var isProduction = process.env.NODE_ENV === "production";

var config = {
  // context: path.join( __dirname, "/../", "app" ),
  output: {
    chunkFilename: "[name].[chunkhash]" + bundleExtention,
    filename: "[name]" + bundleExtention,
    // library: "[name]",
    path: path.join( __dirname, "/../", "www_root/assets" ),
    publicPath: "/assets/",
  },
  module: {
    loaders: [
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
    // noParse: [/node_modules\/(async|classnames|mobile-detect)/gi]
  },
  resolve: {
    extensions: [ "", ".jsx", ".js", ".es6", ".styl", ".css", ".svg" ],
    modulesDirectories: [ "node_modules" ]
  },
  stylus: {
    use: [
      require("nib")(),
    ],
    import: [
      "~nib/lib/nib/index.styl",
      path.join( __dirname, "/config.stylus.styl" ),
    ],
  },
};

module.exports = config
