"use strict"
require( "../config/config.server" );

// npm packages\
var koa = require( "koa" );
var bodyParser = require( "koa-body" );
var serve = require( "koa-static" );
var mount = require( "koa-mount" );
var responseTime = require( "koa-response-time" );
var Racer = require( "racer-koa" );
var racerSchema = require( "racer-schema" );
var sharedbMongo = require( "sharedb-mongo" );
var debug = require("debug")("dev:server.js")

// own packages
var session = require( "./session" );
var adapter = require( "./applicationAdapterServer" );
var racerSchema = require( "../backend/racer/schema" );



module.exports = function( app ){
  debug( "Starting koa server..." )
  var app = app || koa();
  var port = process.env.PORT;
  var sucessMessage = "Koa is listening @port: " + port;
  var sharedbMongoConnection = sharedbMongo( process.env.MONGO_URL + "?auto_reconnect=true", { safe: true } )

  app.keys = process.env.SESSION_KEYS.split( "," );

  // mounting middleware
  app
    .use( responseTime() )
    .use( serve( "./www_root" ) )
    .use( bodyParser({ patchNode: true, formLimit: 10 * 1024 * 1024 }) )
    .use( session )
    .use( function *( next ){
      // error handling
      try { yield next; }
      catch ( err ){
        this.status = err.code || 500;
        this.body = err.message;
        // this.app.emit( "error", err, this );
      }
    });

  // mounting racer
  var backend = new Racer()
    .createBackend({ db: sharedbMongoConnection })
    .createTransport({ session: session })
    .connect( app )

  var harden = require( "../tmp/racer.schema.acl" );
  harden( backend, racerSchema );

  // bulk applications mount ( see: config.applications.js )
  adapter.mount( app )
  app.listen( port, function(){
    debug( sucessMessage )
  })
}
