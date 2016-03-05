"use strict"
const debug = require( "debug" )( "benchmark:applicationAdapterServer.js" )

const koa = require( "koa" );
const React = require( "react" );
const ReactRouter = require( "react-router" )
const Helmet = require( "react-helmet" );
const racer = require( "racer-react" );
const koaMount = require( "koa-mount" );
const join = require( "path" ).join;
const renderToStaticMarkup = require( "react-dom/server" ).renderToStaticMarkup;

const configApplications = require( "../config/config.applications" );
const stylus = require( "../config/config.stylus.json" );

const reactRedux = require( "react-redux" );


function mountApp( koaServer, name, mountPoint ){
  const isProduction = process.env.NODE_ENV === "production"
  const pathToApp = ( isProduction ? "../build/" : "../app/" ) + name
  // const pathToApp = "../app/" + name
  const clientApp = require( pathToApp )
  const koaApp = koa()
  koaApp.use( function *( next ){
    const self = this
    const stats = require( "../build/stats" )
    const racerModel = this.req.getModel()
    const location = this.originalUrl
    const routes = clientApp.Routes()

    const initialState = yield clientApp.redux.getInitialState( this, { stylus } )
    const reduxStore = clientApp.redux.createStore( initialState )

    // TODO: render => webworker

    debug( "prerender..." )
    const preRender = yield function( cb ){
      clientApp.preRender( routes, location, racerModel, ( err, redirectLocation, renderProps ) => {
        cb( err, redirectLocation, renderProps )
        debug( "prerender done" )
      })
    }

    const redirectLocation = preRender[ 0 ]
    const renderProps = preRender[ 1 ]
    if( redirectLocation ) return this.redirect( redirectLocation.pathname + redirectLocation.search );

    if( !renderProps ) return this.status = 404
    if( renderProps.routes.reduce(
      function( cnt, route ){ return route.status === 404 ? cnt + 1 : cnt }, 0)
    ) this.status = 404

    debug( "markup..." )
    const markup = renderToStaticMarkup(
      React.createElement(
        reactRedux.Provider,
        { store: reduxStore },
        React.createElement(
          racer.Provider,
          { racerModel: racerModel },
          React.createElement( ReactRouter.RouterContext, renderProps )
        )
      )
    )
    debug( "markup done" )

    // ! bundle after markup
    debug( "racer bundle..." )
    const racerBundle = yield racer.bundle( racerModel )
    debug( "recer bundle done" )

    debug( "layout..." )
    const response = renderToStaticMarkup(
      React.createElement(
        clientApp.Layout,
        {
          hash: stats.hash,
          helmet: Helmet.rewind(),
          isProduction,
          markup,
          mountPoint: clientApp.settings.mountPoint,
          name,
          racerBundle,
          reduxState: JSON.stringify( reduxStore.getState() ),
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
  for (let i = 0; i < configApplications.length; i++) {
    const app = configApplications[ i ];
    mountApp( koaApp, app.name, app.mountPoint );
  }
}


module.exports = {
  mount,
}
