Router         = require "koa-router"
url            = require "url"
{graphql}      = require "graphql"
# graphqlHTTP    = require "koa-graphql"
mount          = require "koa-mount"

schema         = require "../data/schema"


module.exports = ( app )->

   # app.use mount "/graphql", graphqlHTTP {
   #    schema: schema
   #    graphiql: true
   # }

   router = new Router()
   router.post "/graphql", ->
      query = @request.body.query
      # console?.log payload.query
      try
         response = yield graphql schema, query, @
         # console?.log response
         @body = response
      catch error
         @status = 400
         @body = "Bad request"

   app.use router.middleware()
