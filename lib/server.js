"use strict"
require("babel-core/register");

var config = require( "../config/config.server" );

// npm packages
var koa = require( "koa" );
var serve = require( "koa-static" );
var mount = require( "koa-mount" );
var responseTime = require( "koa-response-time" );

// local packages
var adapter = require( "./applicationAdapterServer" );
var middleware = require( "./middleware" );

// Create app
var app = koa();

// tracking response time
app.use( responseTime() );


var session = require( "./session" );

// adding middleware
middleware( app );

// serving static files
app.use( serve("./www_root") );

var Racer = require( "../tmp/racer-koa/" );
var racer = new Racer()
   .createBackend(
      {
         db: require( "sharedb-mongo" )(
            "mongodb://localhost:27017/rkta" + "?auto_reconnect=true", { safe: true }
         )
      }
   )
   .createTransport({
      session: session.express()
   })
   .use( app );

// mounting applications
app.use(
   adapter.mount( "../app/www", "/" )
);

// starting server
function start( sucessMessage ){
   var port = config.PORT;
   var sucessMessage = sucessMessage || "koa is listening @port: " + port;
   app
      .listen( port, function(){
         console.log( sucessMessage );
      })
      .on( "upgrade", racer.upgrade );
}

if( !module.parent ){
   start();
}

module.exports = app;
