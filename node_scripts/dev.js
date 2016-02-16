require( "../config/config.server" );

var webpack = require("webpack");
// var c2k = require( "koa-connect" );
var middleware = require("../lib/middleware");

var config = require("../config/config.webpack.server.js")( process.env.NODE_ENV === "production" );
var compiler = webpack( config );

middleware.use( require("koa-webpack-dev-middleware" )( compiler, {
 	noInfo: true
}));

middleware.use( require("koa-webpack-hot-middleware" )( compiler, {
	heartbeat: 1000
}));

var server = require( "../lib/server.js" );

server.start();
