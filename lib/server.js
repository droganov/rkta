"use strict"
require("babel-core/register");
require( "../config/config.server" );

// npm packages
var koa = require( "koa" );
var serve = require( "koa-static" );
var mount = require( "koa-mount" );
var responseTime = require( "koa-response-time" );

// local packages
var session = require( "./session" );
var adapter = require( "./applicationAdapterServer" );
var middleware = require( "./middleware" );
var session = require( "./session" );


// Create app
var app = koa();

// tracking response time
app.use( responseTime() );

// adding middleware
var needHotReload = process.env.NODE_ENV == "development" && !module.parent
middleware( app, needHotReload );

// serving static files
app.use( serve("./www_root") );

var Racer = require( "racer-koa/" );
var racer = new Racer()
   .createBackend(
      {
         db: require( "sharedb-mongo" )(
            "mongodb://localhost:27017/rkta" + "?auto_reconnect=true", { safe: true }
         )
      }
   )
   .createTransport({
      session: session,
      base:"/racer-channel"
   })
   .use( app );

// mounting applications
app.use(
   adapter.mount( "../app/www", "/" )
);

// starting server
function start( sucessMessage ){
   var port = process.env.PORT;
   var sucessMessage = sucessMessage || "koa is listening @port: " + port;
   app
      .listen( port, function(){
         console.log( sucessMessage );
      })
      // .on( "upgrade", racer.upgrade );
}

if( !module.parent ){
   start();
}

module.exports = app;
