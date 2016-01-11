// import passport from "koa-passport";
var bodyParser = require( "koa-bodyparser" );

var session = require( "./session" );

module.exports = function( app ){
   app.use( bodyParser() );
   session.koa( app );
};
