"use strict"
path                   = require "path"
webpack 			        = require "webpack"
StatsWriterPlugin      = require("webpack-stats-plugin").StatsWriterPlugin
# ExtractTextPlugin      = require "extract-text-webpack-plugin"

module.exports = ( compress ) ->
   compress ?= false
   extention = if compress then ".min.js" else ".js"
   plugins = []

   if compress
      # uglify
      plugins.push new webpack.optimize.DedupePlugin()
      plugins.push new webpack.optimize.OccurenceOrderPlugin()
      plugins.push new webpack.optimize.UglifyJsPlugin
      	compressor:
      		warnings: false
      # werite stats
      plugins.push new StatsWriterPlugin
         chunkModules: true
         filename: "../../build/stats.json"
         fields: [ "hash", "version", "errorDetails" ]

      # TODO: connect text plugin
      # plugins.push new ExtractTextPlugin("www_root/styles.css")


   # return stats object
   return (
      # cache: true
      entry:
         www: [ "./app/www/client" ]
         exlab: [ "./app/exlab/client" ]
      output:
         path: path.join __dirname, "/../", "www_root/_assets"
         publicPath: "/build"
         filename: "[name]" + extention
         chunkFilename: "[name].[chunkhash]" + extention
      module:
         loaders: [
            { test: /\.cjsx$/, loader: "coffee-jsx-loader" },
            {
               test: /\.jsx?$/
               exclude: /(node_modules|com\/bower)/
               loader: "babel"
               query:
                  stage: 0
                  plugins:[ "./lib/babelRelayPlugin" ]
            },
            { test: /\.coffee$/, loader: "coffee-loader" },
            # {
            #    test: /\.(jpe?g|png|gif|svg)$/i,
            #    loaders: [
            #       'file?hash=sha512&digest=hex&name=[hash].[ext]',
            #       'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
            #    ]
            # },

            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.svg$/, loader: "svg-inline"},
            { test: /\.styl$/, loader: "css-loader!stylus-loader" },
            { test: /\.(woff|woff2)/, loader: "url?limit=100000" }
         ]
      resolve:
         extensions: [ "", ".cjsx", ".jsx", ".js", ".coffee", ".styl", ".css", ".svg" ]
         # extensions: [ "", ".cjsx", ".jsx", ".js", ".coffee", ".styl", ".css" ]
   		# modulesDirectories: ["src", "src/blocks", "web_modules", "bower_components", "node_modules"]
      plugins: plugins
      stylus:
         use: [ require("nib")() ]
   )
