"use strict"
const debug = require( "debug" )( "dev:applicationAdapterServer.js" )

const koa = require( "koa" )
const React = require( "react" )
const racer = require( "racer-react" )
const koaMount = require( "koa-mount" )
const join = require( "path" ).join;
const configApplications = require( "../config/config.applications" )

function mountApp( koaServer, name, mountPoint ){
  const isProduction = process.env.NODE_ENV === "production"
  const pathToApp = ( isProduction ? "../build/" : "../app/" ) + name
  // const pathToApp = "../app/" + name
  const clientApp = require( pathToApp )
  const koaApp = koa()
  koaApp.use( function *( next ){
    const self = this
    const stats = require( "../build/stats" )
    const racerModel = this.req.model
    const location = this.originalUrl
    const routes = clientApp.Routes()

    const initialState = yield clientApp.redux.getInitialState( this, {} )
    const reduxStore = clientApp.redux.createStore( initialState )

    // TODO: render to webworker

    debug( "prerender..." )
    const preRender = yield function( cb ){
      clientApp.preRender( routes, location, racerModel, reduxStore, ( err, redirectLocation, renderProps ) => {
      	if(err) console.log(err);
        cb( err, redirectLocation, renderProps )
        debug( "prerender finished" )
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
    const markup = clientApp.Layout.markup({
      reduxStore,
      racerModel,
      renderProps,
    })
    debug( "markup done" )

    // ! bundle after markup
    debug( "racer bundle..." )
    const racerBundle = yield racer.bundle( racerModel )
    debug( "racer bundle done" )

    debug( "layout..." )
    const response = clientApp.Layout.render({
      hash: stats.hash,
      isProduction,
      markup,
      mountPoint: clientApp.settings.mountPoint,
      name,
      racerBundle,
      reduxState: JSON.stringify( reduxStore.getState() ),
    })
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
