"use strict"

var koa = require( "koa" );
var React = require( "react" );
var Helmet = require( "react-helmet" );
var racer = require( "racer-react/" );
var koaMount = require( "koa-mount" );
var join = require( "path" ).join;
var renderToStaticMarkup = require( "react-dom/server" ).renderToStaticMarkup;

var ReactRouter = require( "react-router" );
var createHistory = require( "history/lib/createMemoryHistory" );

var configApplications = require( "../config/config.applications.js" );
var middleware = require( "./middleware" );

var mountedApplications = {};

function createKoaApp ( name, stats, Layout, routes ){
  var app = koa();
  middleware.init( app );
  app.use( function *( next ){
    try {
      var racerModel = this.req.getModel();
      var location = this.originalUrl;
      var renderProps = yield new Promise( function( resolve, reject ){
        racer.match(
          {
            routes: routes(),
            location: location,
            racerModel: racerModel,
          },
          function( err, renderProps ){
            if( err) return reject( err );
            resolve( renderProps );
          }
        );
      });

      const markup = renderToStaticMarkup(
        React.createElement(
           racer.Provider,
           { racerModel: racerModel },
           React.createElement(
              ReactRouter.RouterContext, renderProps
           )
        )
      );



      // bundle flows markup
      var racerBundle = yield racer.bundle( racerModel );

      const response = renderToStaticMarkup(
        React.createElement( Layout, {
          name: name,
          hash: stats.hash,
          isProduction: process.env.NODE_ENV === "production",
          helmet: Helmet.rewind(),
          markup: markup,
          racerBundle: racerBundle
        })
      );
      this.body = "<!DOCTYPE html>" + response;
      return response;

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

function mountApp( koaApp, name, mountPoint ){
  var pathToApp = "../app/" + name;
  var childApp = createKoaApp(
    name,
    require( "../build/stats" ),
    require( join( pathToApp, "layout") ),
    require( join( pathToApp, "routes") )
  );
  koaApp.use(
    koaMount(
      mountPoint,
      childApp
    )
  )
  mountedApplications[ name ] = childApp;
}

function mount( koaApp ){
  for (var i = 0; i < configApplications.length; i++) {
    var app = configApplications[ i ];
    mountApp( koaApp, app.name, app.mountPoint );
  }
}

function getMounted(){ return mountedApplications; }

module.exports = {
  mount,
  getMounted,
}
