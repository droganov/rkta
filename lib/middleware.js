// import passport from "koa-passport";
var bodyParser = require( "koa-body" );
var c2k 	= require("koa-connect");

var session = require( "./session" );



module.exports = function( app ){
   app.keys = [ process.env.SESSION_SECRET, process.env.SESSION_COOKIE ];
   app
      .use( bodyParser({
      	patchNode: true
      }) )
      .use( c2k(session) );
};
