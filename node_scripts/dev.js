require("babel-core/register")

var koa = require( "koa" )
var c2k = require( "koa-connect" )

var webpack = require( "webpack" )
var webpackDevMiddleware = require("koa-webpack-dev-middleware" )
var webpackHotMiddleware = require("koa-webpack-hot-middleware" )

var startServer = require( "../lib/server" )

var config = require( "../config/config.webpack.client.js" )( )
var compiler = webpack( config )

var app = koa()

app
  .use( webpackDevMiddleware(
    compiler,
    {
      noInfo: true,
      publicPath: config.output.publicPath,
    })
  )
  .use( webpackHotMiddleware( compiler, { heartbeat: 1000 }) )

startServer( app )
