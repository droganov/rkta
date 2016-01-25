var   router = require( "koa-router" )(),
      websockify = require( "koa-websocket" ),
      SocketStream = require( "./socket-stream" ),
      BrowserChannelServer = require('browserchannel').server,
      c2k = require("koa-connect"),
      connect = require("browserchannel/node_modules/connect"),
      middelwareWrap = require("./middlewareWrap.js");

function Transport( racerStore, options ){
   this.racerStore = racerStore;
   this.options = options;
}
Transport.prototype.connect = function( app ){
   var racerStore = this.racerStore;

   var sessionEnable = !!this.options.session;

   websockify( app );
   
   if( sessionEnable ) app.ws.use( this.options.session );

   // web socket
   router.get( "/racer-channel", function *( next ){
      var stream = new SocketStream( this.websocket );
      racerStore.listen( stream, this.websocket.upgradeReq );
      yield next;
   });

   app.ws.use( router.routes() );

   // browserchannel
   var BCmiddleware = BrowserChannelServer(this.options, function (client, connectRequest) {
      if(connectRequest.session) client.session = connectRequest.session;
      var stream = new SocketStream( client );
      racerStore.listen( stream, connectRequest );
   });

   app.use( function *(next) {
      var req = this.req;
      var res = this.res;
      var gotoNext = yield function(done) {
         var originalEnd = res.end;
         res.end = function() {
            originalEnd.apply(this, arguments);
            // done(null,false);
         };
         // readonly session koa -> connect
         if(sessionEnable) {
            req.session = this.session;
         }
         BCmiddleware(req, res, function (err) {
            res.end = originalEnd;
            done(err,true);
         });
      }
      if(gotoNext && next)
         yield* next;
   });
};

module.exports = Transport;
