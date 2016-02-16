"use strict"
require("babel-core/register");
require( "../config/config.server" );

// npm packages
var koa = require( "koa" );
var serve = require( "koa-static" );
var mount = require( "koa-mount" );
var responseTime = require( "koa-response-time" );
var Racer = require( "racer-koa/" );

// local packages
var session = require( "./session" );
var adapter = require( "./applicationAdapterServer" );
var middleware = require( "./middleware" );

// Create app
var app = koa();

// tracking response time
app.use( responseTime() );

// adding middleware
middleware.init( app );

// serving static files
app.use( serve("./www_root") );

var racer = new Racer()
   .createBackend(
      {
         db: require( "sharedb-mongo" )(
            "mongodb://localhost:27017/rkta" + "?auto_reconnect=true", { safe: true }
         )
      }
   )
   .createTransport({
      session: session
   })
   .use( app );

// mounting applications ( see: config.applications.js )
adapter.mount( app );

// starting server
function start( sucessMessage ){
  var port = process.env.PORT;
  var sucessMessage = sucessMessage || "koa is listening @port: " + port;
  app
    .listen( port, function(){
      console.log( sucessMessage );
    })
}

// if( !module.parent ){
//    start();
// }

module.exports = {
  app,
  start,
};
