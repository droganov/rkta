"use strict"

# cjsx runtime
require "node-cjsx/register"

# babel runtime
require "babel/register"

gulp 				        = require "gulp"
babel 				     = require "gulp-babel"
graphQL 				     = require "gulp-graphql"
gutil 				     = require "gulp-util"
gzip 				        = require "gulp-gzip"
nodemon                = require "gulp-nodemon"
uglify                 = require "gulp-uglify"
webpack 			        = require "webpack"
webpackConfig 		     = require "./config/config.webpack"

# console?.log webpackConfig

paths =
   webpack: [
      "app/**/*.cjsx"
      "app/**/**/*.cjsx"
      "app/**/*.jsx"
      "app/**/**/*.jsx"
      "app/**/*.styl"
      "app/**/**/*.styl"
      "com/**/*"
      "com/**/**/*"
   ]
   graphQL: [ "data/*.js" ]

gulp.task "webpack", ( cb ) ->
	webpack webpackConfig(false), ( err, stats ) ->
		# console?.log stats
		throw new gutil.PluginError( "webpack", err ) if err?
		cb()

# gulp.task "webpackCompress", ( cb ) ->
# 	webpack webpackConfig(true), ( err, stats ) ->
# 		# console?.log stats
# 		throw new gutil.PluginError( "webpackCompress", err ) if err?
# 		cb()

# compressing js
gulp.task "uglify", [ "webpack" ], ->
   # return
   gulp
      .src "www_root/_assets/*.js"
      .pipe uglify()
      # .pipe gzip()
      .pipe gulp.dest "www_root/assets"

# compiling build/schema.json
gulp.task "graphQL", ->
   gulp
      .src "data/schema.js"
      .pipe graphQL(
            json: true
            graphql: false
         )
      .on "error", gutil.log
      .pipe gulp.dest "build"

# watching file changes
gulp.task "watch", ->
   gulp.watch paths.webpack, [ "uglify" ]
   gulp.watch paths.graphQL, [ "graphQL" ]

# running dev server
gulp.task "serve", ->
   # todo: live reload
   # http://stackoverflow.com/questions/29217978/gulp-to-watch-when-node-app-listen-is-invoked-or-to-port-livereload-nodejs-a
   nodemon(
      script: "lib/server.coffee"
      ext: "coffee"
      execMap:
         coffee: "coffee --nodejs --harmony"
      env:
         "NODE_ENV": "development"
      ignore: [ "www_root/*" ]
      stdout: "false"
      # tasks: [ "webpack" ]
   )
      .on "restart", -> console?.log "dev server restarted"
      .on "start", -> console?.log "dev server started"
      .on "readable", (data) ->
         console?.log "readable"

gulp.task "default", [ "serve", "webpack", "graphQL", "watch" ]
