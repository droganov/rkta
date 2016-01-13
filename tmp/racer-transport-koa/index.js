var   koa = require( "koa" ),
      route = require( "koa-route" ),
      websockify = require( "koa-websocket" )
      SocketStream = require( "./socket-stream" );

function Transport( racerStore, options ){
   this.racerStore = racerStore;
   this.options = options;
}
Transport.prototype.connect = function( app ){
   var racerStore = this.racerStore;

   websockify( app );
   if( this.options.session ) app.ws.use( this.options.session );

   console.log( app.ws );


   app.ws.use( route.all( "/racer-channel", function *( next ){
      var stream = new SocketStream( this.websocket );
      this.websocket.on( "message", function( message ) {
          stream.push( message );
      });
      client.on( "close", function() {
         stream.push( null );
      });
      racerStore.on( "connect", function( data ){
         var agent = data.agent;
         if ( this.options.session ) agent.connectSession = this.session;
         racerStore.emit( "share agent", agent, stream );
         console.log( "racerStore connect" );
      });
      racerStore.listen( this.websocket, this );

      function reject(){
         console.log( "regect" );
      }

      backend.emit("client", this.websocket, reject);
      yield next;
   }));
};

module.exports = Transport;
