// import passport from "koa-passport";
var bodyParser = require( "koa-body" );
var c2k = require( "koa-connect" );

var session = require( "./session" );

module.exports = function( app, needHotReload ){
	app.use( bodyParser({
		patchNode: true,
		formLimit: 10*1024*1024
	}) );
	app.use( c2k( session ) );

	if(needHotReload) {
		var webpack = require('webpack');
		var config = require('../config/config.webpack.js')();
		var compiler = webpack(config);

		app.use(require('koa-webpack-dev-middleware')(compiler, {
		 	noInfo: true,
		 	useNodeFileSystem: true
		}));

		app.use( require("koa-webpack-hot-middleware")(compiler, {
			heartbeat: 1000
		}));
	}
};
