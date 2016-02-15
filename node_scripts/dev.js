var webpack = require("webpack");
// var c2k = require( "koa-connect" );

var config = require("../config/config.webpack.server.js")( process.env.NODE_ENV === "production" );
var compiler = webpack( config );

var server = require( "../lib/server.js" );

server.app.use( require("koa-webpack-dev-middleware" )( compiler, {
 	noInfo: true,
 	useNodeFileSystem: true
}));

server.app.use( require("koa-webpack-hot-middleware" )( compiler, {
	heartbeat: 1000
}));

server.start();
