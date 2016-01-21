var   router = require( "koa-router" )(),
      websockify = require( "koa-websocket" ),
      SocketStream = require( "./socket-stream" );

function Transport( racerStore, options ){
   this.racerStore = racerStore;
   this.options = options;
}
Transport.prototype.connect = function( app ){
   var racerStore = this.racerStore;

   websockify( app );
   if( this.options.session ) app.ws.use( this.options.session );

   router.get( "/racer-channel", function *( next ){
      var stream = new SocketStream( this.websocket );

      racerStore.listen( stream, this.websocket.upgradeReq );

      yield next;
   });

   app.ws.use( router.routes() ); 
};

module.exports = Transport;
