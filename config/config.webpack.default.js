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
var putAssetsTo = isProduction ? "www_root/assets" : "www_root/_assets";

var config = {
  output: {
    path: path.join( __dirname, "/../", putAssetsTo ),
    publicPath: "/assets/",
    filename: "[name]" + bundleExtention,
    chunkFilename: "[name].[chunkhash]" + bundleExtention
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
  },
  resolve: {
    extensions: [ "", ".jsx", ".js", ".es6", ".styl", ".css", ".svg" ],
    // modulesDirectories: ["src", "src/blocks", "web_modules", "bower_components", "node_modules"],
  },
  stylus: {
    use: [ require("nib")() ],
    import: [ "~nib/lib/nib/index.styl" ],
  },
};

module.exports = config
