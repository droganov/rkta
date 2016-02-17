var koa = require( "koa" )

require("babel-core/register")
// require( "../config/config.server" )

var webpack = require( "webpack" )
var koaWebpackDevMiddleware = require("koa-webpack-dev-middleware" )
var koaWebpackHotMiddleware = require("koa-webpack-hot-middleware" )

// var c2k = require( "koa-connect" )
var startServer = require( "../lib/server" )

var config = require( "../config/config.webpack.client.js" )( process.env.NODE_ENV === "production" )
var compiler = webpack( config )

var app = koa()

app
  .use( require("koa-webpack-dev-middleware" )( compiler, { noInfo: true }) )
  .use( require("koa-webpack-hot-middleware" )( compiler, { heartbeat: 1000 }) )

startServer( app )
