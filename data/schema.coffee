{
   GraphQLBoolean,
   GraphQLFloat,
   GraphQLID,
   GraphQLInt,
   GraphQLList,
   GraphQLNonNull,
   GraphQLObjectType,
   GraphQLSchema,
   GraphQLString
} = require "graphql"

{
   connectionArgs,
   connectionDefinitions,
   connectionFromArray,
   fromGlobalId,
   globalIdField,
   mutationWithClientMutationId,
   nodeDefinitions
} = require "graphql-relay"


blog = require "./model/blog/modelBlog"

blog.field.item()


GREETINGS =
   hello: "One, two.. One, two... GraphQL is speaking. Hello! Can you hear me?"
   test: "test done"

# Greetings type
GreetingsType = new GraphQLObjectType
   name: "Greetings"
   fields: ->
      hello:
         type: GraphQLString
      test:
         type: GraphQLString

schema = new GraphQLSchema
   query: new GraphQLObjectType
      name: "Query"
      fields: ->
         greetings:
            type: GreetingsType
            resolve: -> GREETINGS




module.exports = schema
