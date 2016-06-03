const graphql = require('../../tmp/sharedb-graphql').graphql;
const racerSchema = require('../racer/schema');

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
      text: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
      isComplete: { type: new graphql.GraphQLNonNull(graphql.GraphQLBoolean) },
    },
  }),
  // реализация запросов
  queries: (Type) => ({
    List: {
      type: new graphql.GraphQLList(Type),
      args: {},
      resolve: () => {
        if (!GLOBAL.mongoConnection) return [];
        const collection = GLOBAL.mongoConnection.collection(Name);
        const q = { _type: { $ne: null } };
        return new Promise((rsv, rjt) => {
          collection.find(q).toArray((err, r) => {
            if (err) return rjt(err);
            return rsv(r);
          });
        });
      },
    },
  }),
};
