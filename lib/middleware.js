// import passport from "koa-passport";
var bodyParser = require( "koa-body" );

var session = require( "./session" );



module.exports = function( app ){
   app.keys = [ process.env.SESSION_SECRET, process.env.SESSION_COOKIE ];
   app
      .use( bodyParser({
      	patchNode: true
      }) )
      .use( session.koa );
};
