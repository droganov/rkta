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

type =
   item:
      new GraphQLObjectType
         name: "BlogItem"
         fields: ->
            title: GraphQLString

   list: "typeList"

field =
   list: type.list
   item: =>
      
mutation =
   updateItem: ""

module.exports = { type, field, mutation }
