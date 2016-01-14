// import passport from "koa-passport";
var bodyParser = require( "koa-body" );
var c2k = require( "koa-connect" );

var session = require( "./session" );

module.exports = function( app ){
   app.use( bodyParser({
   	patchNode: true,
   	formLimit: 10*1024*1024
   }) );
   app.use( c2k( session ) );
};
