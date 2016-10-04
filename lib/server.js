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
var debug = require("debug")("dev:server.js")
var sharedbRedisPubSub = require( "sharedb-redis-pubsub" );


// own packages
var session = require( "./session" );
var adapter = require( "./applicationAdapterServer" );
var racerSchemaSettings = require( "../back-end/racer/schema" );
var serverRPC = require('../back-end/racer/rpc');

module.exports = function( app ){
  debug( "Starting koa server..." )
  var app = app || koa();
  var port = process.env.PORT;
  var sucessMessage = "Koa is listening @port: " + port;
  var sharedbGraphQLConnection = require( "../back-end/graphql_schema" );
  var sharedbRedisPubSubConnection = sharedbRedisPubSub({
    url: process.env.REDIS_URL
  });

  app.keys = process.env.SESSION_KEYS.split( "," );

  // mounting middleware
  app
    .use( responseTime() )
    .use( serve( "./www_root" ) )
    .use( bodyParser({ patchNode: true, formLimit: 10 * 1024 * 1024 }) )
    .use( session )

  // mounting racer
  var backend = new Racer()
    .createBackend({
      db: sharedbGraphQLConnection,
      pubsub: sharedbRedisPubSubConnection
    })
    .createTransport({ session: session })
    .use(
      function( racer, options ){
        racer.on( "store", function( store ){
          console.log( "use store" )
        });
      },
      "options"
    )
    .use( serverRPC.rpc )
    .connect( app )

  serverRPC.init(backend);

  // bulk applications mount ( see: config.applications.js )
  adapter.mount( app )
  app.listen( port, function(){
    debug( sucessMessage )
  })
}
