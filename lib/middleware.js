// import passport from "koa-passport";
var bodyParser = require( "koa-bodyparser" );

var session = require( "./session" );



module.exports = function( app ){
   app.keys = [ process.env.SESSION_SECRET, process.env.SESSION_COOKIE ];
   app
      .use( bodyParser() )
      .use( session.koa );
};
