"use strict"

require("babel-core/register");

var port = process.env.PORT || 3000;

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

// adding middleware
middleware( app );

// serving static files
app.use( serve("./www_root") );


// mounting applications
app.use(
   adapter.mount( "../app/www", "/" )
);

// starting server
function start( sucessMessage ){
   var sucessMessage = sucessMessage || "koa is listening @port: " + port;
   app.listen( port, function(){
      console.log( sucessMessage );
   });
}

if( !module.parent ){
   start();
}

module.exports = app;
