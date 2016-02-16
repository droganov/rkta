// import passport from "koa-passport";
var bodyParser = require( "koa-body" );
var c2k = require( "koa-connect" );

var sessionMiddleware = require( "./session" );
var oneTimeMiddleware = [];

module.exports = {
	init: function( app ){
		app.keys = process.env.SESSION_KEYS.split( "," );
		app.use( bodyParser({
			patchNode: true,
			formLimit: 10*1024*1024
		}) );

		app.use( sessionMiddleware );

		for (var i = 0; i < oneTimeMiddleware.length; i++) {
			app.use( oneTimeMiddleware[i] );
		};

		oneTimeMiddleware = [];
	},
	use: function (middleware) {
		oneTimeMiddleware.push(middleware);
	}
}
