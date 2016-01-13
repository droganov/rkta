"use strict"
var highway = require( "racer-highway" );
var racer = require( "racer" );
var c2k = require( "koa-connect" );

var Transport = require ( "../racer-transport-koa" );

function Racer() {
   this.otionsBackend = null;
   this.otionsTransport = null;
}
Racer.prototype.createBackend = function( options ){
   this.otionsBackend = options;
   return this;
}
Racer.prototype.createTransport = function( options ){
   this.otionsTransport = options;
   return this;
}
Racer.prototype.use = function( app ){
   // var store = racer.createStore( this.otionsBackend );
   var racerStore = racer.createBackend( this.otionsBackend );
   // var transport = highway( racerStore, this.otionsTransport );
   var transport = new Transport( racerStore, this.otionsTransport );
   transport.connect( app );
   app
      .use( c2k( racerStore.modelMiddleware() ) )
      // .use( c2k( transport.middleware ) );
   // return transport;
}

module.exports = Racer;
