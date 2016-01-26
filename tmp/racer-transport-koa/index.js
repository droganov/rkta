var   router = require( "koa-router" )(),
      websockify = require( "koa-websocket" ),
      SocketStream = require( "./socket-stream" ),
      BrowserChannelServer = require('browserchannel').server,
      c2k = require("koa-connect"),
      connect = require("browserchannel/node_modules/connect");

function Transport( racerStore, options ){
   this.racerStore = racerStore;
   this.options = options;
}
Transport.prototype.connect = function( app ){
   var sessionEnable = !!this.options.session;
   var racerStore = this.racerStore;

   // web socket
   websockify( app );
   
   router.get( this.options.base, function *( next ){
      var stream = new SocketStream( this.websocket );
      if(this.session) stream.session = this.session;
      racerStore.listen( stream, this.websocket.upgradeReq );
      yield next;
   });

   if( sessionEnable ) app.ws.use( this.options.session );

   app.ws.use( router.routes() );

   // browserchannel
   var BCmiddleware = BrowserChannelServer(this.options, function (client, connectRequest) {
      if(connectRequest.session) client.session = connectRequest.session;
      var stream = new SocketStream( client );
      racerStore.listen( stream, connectRequest );
   });

   app.use( function * (next) {
      if(sessionEnable) {
         // readonly session koa -> connect (BCmiddleware stop generator chain and session difference not saved)
         this.req.session = this.session;
      }
      yield BCmiddleware.bind(null, this.req, this.res);
      yield next;
   });
};

module.exports = Transport;
