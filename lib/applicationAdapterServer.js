"use strict"
var debug = require( "debug" )( "benchmark:applicationAdapterServer.js" )

var koa = require( "koa" );
var React = require( "react" );
var ReactRouter = require( "react-router" )
var Helmet = require( "react-helmet" );
var racer = require( "racer-react" );
var koaMount = require( "koa-mount" );
var join = require( "path" ).join;
var renderToStaticMarkup = require( "react-dom/server" ).renderToStaticMarkup;

var createHistory = require( "history/lib/createMemoryHistory" );
var configApplications = require( "../config/config.applications" );

function mountApp( koaServer, name, mountPoint ){
  var isProduction = process.env.NODE_ENV === "production"
  var pathToApp = ( isProduction ? "../build/" : "../app/" ) + name
  // var pathToApp = "../app/" + name
  var clientApp = require( pathToApp )
  var koaApp = koa()
  koaApp.use( function *( next ){
    var self = this
    var stats = require( "../build/stats" )
    var racerModel = this.req.getModel()
    var location = this.originalUrl
    var routes = clientApp.Routes()

    debug( "prerender..." )
    var preRender = yield function( cb ){
      clientApp.preRender( routes, location, racerModel, ( err, redirectLocation, renderProps ) => {
        cb( err, redirectLocation, renderProps )
        debug( "prerender done" )
      })
    }

    var redirectLocation = preRender[ 0 ]
    var renderProps = preRender[ 1 ]
    if( redirectLocation ) return this.redirect( redirectLocation.pathname + redirectLocation.search );

    // TODO: 404 handling
    if( !renderProps ) return this.status = 404
    if( renderProps.routes.reduce(
      function( cnt, route ){ return route.status === 404 ? cnt + 1 : cnt }, 0)
    ) this.status = 404

    debug( "markup..." )
    var markup = renderToStaticMarkup(
      React.createElement(
        racer.Provider,
        { racerModel: racerModel },
        React.createElement( ReactRouter.RouterContext, renderProps )
      )
    )
    debug( "markup done" )

    // ! bundle after markup
    debug( "racer bundle..." )
    var racerBundle = yield racer.bundle( racerModel )
    debug( "recer bundle done" )

    debug( "layout..." )
    const response = renderToStaticMarkup(
      React.createElement(
        clientApp.Layout,
        {
          hash: stats.hash,
          helmet: Helmet.rewind(),
          isProduction: isProduction,
          markup: markup,
          mountPoint: clientApp.settings.mountPoint,
          name: name,
          racerBundle: racerBundle,
        }
      )
    );
    debug( "layout done" )
    this.body = "<!DOCTYPE html>" + response
  })

  koaServer.use(
    koaMount(
      mountPoint,
      koaApp
    )
  )
}

function mount( koaApp ){
  for (var i = 0; i < configApplications.length; i++) {
    var app = configApplications[ i ];
    mountApp( koaApp, app.name, app.mountPoint );
  }
}


module.exports = {
  mount,
}
