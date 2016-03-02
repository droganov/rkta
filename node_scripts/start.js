var debug = require("debug")("dev:start.js")
debug( "Starting live dev server" )

require( "babel-core/register" )
var hook = require( "css-modules-require-hook" )
var stylus = require( "stylus" )

hook({
  extensions: [".styl"],
  generateScopedName: "[path]-[local]",
  preprocessCss: function( src, filename ){
    return stylus( src )
      .include( require( "nib" ).path )
      .set( "filename", filename )
      .render()
  },
});

var c2k = require( "koa-connect" )
var koa = require( "koa" )

var webpack = require( "webpack" )
var webpackDevMiddleware = require("koa-webpack-dev-middleware" )
var webpackHotMiddleware = require("koa-webpack-hot-middleware" )

var configHMR = require( "../config/config.webpack.hmr.js" )
var compiler = webpack( configHMR )

var startServer = require( "../lib/server" )



var app = koa()
app
  .use( webpackDevMiddleware(
    compiler,
    {
      noInfo: true,
      publicPath: configHMR.output.publicPath,
    })
  )
  .use( webpackHotMiddleware( compiler, { heartbeat: 1000 }) )

startServer( app )
