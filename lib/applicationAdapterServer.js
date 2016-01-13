"use strict"
var koa = require( "koa" );
var React = require( "react" );
var Helmet = require( "react-helmet" );
var koaMount = require( "koa-mount" );
var join = require( "path" ).join;
var renderToStaticMarkup = require( "react-dom/server" ).renderToStaticMarkup;

var ReactRouter = require( "react-router" );
var Provider = require( "react-redux" ).Provider;
var createHistory = require( "history/lib/createMemoryHistory" );

var middleware = require( "./middleware" );
var racer = require( "../tmp/racer-react/" );


function getInstance ( stats, Layout, routes ){
   var app = koa();
   middleware( app );
   app.use( function *( next ){
      // console.log( this.session );
      try {
         var body = yield racer.match(
            {
               routes: routes(),
               location: this.originalUrl,
               racerModel: this.req.getModel(),
               onSuccess: function( renderProps, racerBundle ){
                  var markup = renderToStaticMarkup(
                     React.createElement( ReactRouter.RoutingContext, renderProps )
                  );
                  var response = renderToStaticMarkup(
                     React.createElement( Layout, {
                        hash: stats.hash,
                        isProduction: process.env.NODE_ENV === "production",
                        helmet: Helmet.rewind(),
                        markup: markup,
                        racerBundle: racerBundle
                     })
                  );
                  return response;
               }
            }
         );
         this.body = "<!DOCTYPE html>" + body;
      }
      catch ( error ) {
         if( error.status ){
            this.status = error.status;
            this.redirect( error.location.pathname + error.location.search );
         }
         this.throw( error.message, 500 );
      }
   });
   return app;
};

function mount( path, route ){
   return koaMount(
      route,
      getInstance(
         require( "../build/stats" ),
         require( join( path, "layout") ),
         require( join( path, "routes") )
      )
   )
}


module.exports = {
   getInstance: getInstance,
   mount: mount,
}
