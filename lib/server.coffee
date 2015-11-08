"use strict"

# cjsx runtime
require "node-cjsx/register"

# babel runtime
require "babel/register"

port           = process.env.PORT or 3000

# modules
koa            = require "koa"
serve          = require "koa-static"
mount          = require "koa-mount"

# isomorphic app adapter
adapter        = require "./applicationAdapterServer"

# webpack stats
stats          = require "../build/stats"

# config
app            = koa()

# tracking response time
app.use require("koa-response-time")()

# adding middleware
require("./middleware")( app )

# app.use ( next )->
#    @session.ts ?= Date.now()
#    console?.log @session
#    yield next

# serving static files
app.use serve "./www_root"

# GraphQL Server
require("./graphqlWorker")( app )

# mounting applications
# dev
# if app.env is "development"
console?.log require("../app/exlab/layout")
app.use mount("/exlab", adapter( stats, require("../app/exlab/layout"), require("../app/exlab/routes") ))

# production
app.use mount("/", adapter( stats, require("../app/www/layout"), require("../app/www/routes") ))

# starting server
start = ->
   app.listen port, -> console?.log "koa is listening @port: " + port

start() unless module.parent

module.exports = app
