// import passport from "koa-passport";
import bodyParser from "koa-bodyparser";

var fs 			= require("fs");

module.exports = function( app, needHotReload ){
	app.keys = [ "you-have-to-create-your-own-key" ];
	app.use( bodyParser() );

	if(needHotReload) {
		var webpack = require('webpack');
		var config = require('../config/config.webpack.js')();
		var compiler = webpack(config);

		app.use(require('koa-webpack-dev-middleware')(compiler, {
		 	noInfo: true
		}));

		app.use( require("koa-webpack-hot-middleware")(compiler, {
			heartbeat: 200
		}));
	}

};

// module.exports = ( app )->
//    # session key
//    app.keys       = [ "you-have-to-create-your-own-key" ]
//
//    app
//       .use require("koa-bodyparser")()
//       # TODO: add presistent store
//       # .use require("koa-session")( app )
//       # .use passport.initialize()
//
//       # TODO: add spree passport policy
//       # .use passport.session()
