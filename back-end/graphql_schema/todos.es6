const graphql = require('../../tmp/sharedb-graphql').graphql;

// название сущности по имени файла
const Name = __filename
  .split('/')
	.pop()
	.split('.')
	.shift();

module.exports = {
  // название и форма сущности
  shape: () => ({
    name: Name,
    fields: {
      text: { type: graphql.GraphQLString },
      isComplete: { type: new graphql.GraphQLNonNull(graphql.GraphQLBoolean) },
    },
  }),
  // реализация запросов
  queries: (Type) => ({
    fetchAllTodos: {
      type: new graphql.GraphQLList(Type),
      args: {},
      resolve: () => {
        if (!global.mongoConnection) return [];
        const collection = global.mongoConnection.collection(Name);
        const q = { _type: { $ne: null } };
        return collection.find(q).toArray();
      },
    },
  }),
};
