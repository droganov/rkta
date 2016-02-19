"use strict"
require( "../config/config.server" );

// npm packages\
var koa = require( "koa" );
var bodyParser = require( "koa-body" );
var serve = require( "koa-static" );
var mount = require( "koa-mount" );
var responseTime = require( "koa-response-time" );
var Racer = require( "racer-koa" );
var sharedbMongo = require( "sharedb-mongo" );
var debug = require("debug")("dev:server.js")

// own packages
var session = require( "./session" );
var adapter = require( "./applicationAdapterServer" );

module.exports = function( app ){
  var app = app || koa();
  var port = process.env.PORT;
  var sucessMessage = "koa is listening @port: " + port;
  var sharedbMongoConnection = sharedbMongo( process.env.MONGO_URL + "?auto_reconnect=true", { safe: true } )

  app.keys = process.env.SESSION_KEYS.split( "," );

  // mounting middleware
  app
    .use( responseTime() )
    .use( serve( "./www_root" ) )
    .use( bodyParser({ patchNode: true, formLimit: 10 * 1024 * 1024 }) )
    .use( session )

  // mounting racer
  new Racer()
    .createBackend({ db: sharedbMongoConnection })
    .createTransport({ session: session })
    .use( app )

  // bulk applications mount ( see: config.applications.js )
  adapter.mount( app )
  app.listen( port, function(){ debug( sucessMessage ) } )
}
