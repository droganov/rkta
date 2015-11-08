"use strict"

koa                                 = require "koa"
React                               = require "react"
Helmet                              = require "react-helmet"

# Relay                               = require "react-relay"
# https://github.com/facebook/relay/issues/440
{ renderToString, renderToStaticMarkup }            = require "react-dom/server"
{ RoutingContext, match }           = require "react-router"
{ createLocation }                  = require "history"

# Relay.injectNetworkLayer(
#    new Relay.DefaultNetworkLayer("http://localhost:3000/graphql")
# )

# Relay.injectNetworkLayer require "./relayNetworkLayerServer"

# stats                               = require "../../build/stats"
# Layout                              = require "./layout"

preRender = ( routes, location ) ->
   new Promise (resolve) ->
      match(
         { routes, location }, -> resolve arguments
      )

module.exports = ( stats, Layout, Routes ) ->
   # console?.log Routes()
   app = koa()
   require("./middleware")( app )

   # app.use ( next )->
   #    @session.ts ?= Date.now()
   #    console?.log @session
   #    yield next

   app.use ( next ) ->
      [ error, redirect, renderProps ] = yield preRender Routes, @originalUrl

      yield return @status = 500 if error?
      if redirect?
         @status = 301
         yield return @redirect redirect

      isNotFound = renderProps.routes.filter ( route ) -> route.name is "404"
      @status = 404 if isNotFound.length

      markup = renderToStaticMarkup(
         <RoutingContext {...renderProps} />
      )
      # helmet = Helmet.rewind()

      # https://github.com/facebook/relay/issues/136
      response = renderToStaticMarkup(
         <Layout
            hash={ stats.hash }
            isProduction={ process.env.NODE_ENV is "production" }
            helmet={ Helmet.rewind() }
            markup={ markup }
         />
      )
      yield return @body = "<!DOCTYPE html>" + response
