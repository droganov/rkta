const sharedbGraphQL = require('../../tmp/sharedb-graphql');

const mongodb = require('mongodb');

const collectionsByName = {};

global.mongoConnection = null;
global.graphQLTypes = {};

// схема типов  ==========
const schema = new sharedbGraphQL.Schema();

const todos = require(`${__dirname}/todos`);
const collections = [
  todos,
];

// коннект базы и создание индексов
mongodb.MongoClient.connect(process.env.MONGO_URL, (err, db) => {
  if (err) {
    throw (err);
  }
  global.mongoConnection = db;
});

collections.forEach((collection) => {
  const shape = collection.shape();
  const inputShape = collection.inputShape && collection.inputShape();
  const collectionName = shape.name;

  const Type = schema.implementType(shape, inputShape);

  global.graphQLTypes[collectionName] = Type;

  collectionsByName[collectionName] = collection;

  const collectionQueries = collection.queries(Type);
  if (collectionQueries) {
    schema.registerQuery(collectionName, collectionQueries);
  }
});

// функция что бы вытащить значение сущности из базы по названию коллекции и id
schema.itemFn = (typeName, id) => {
  if (!global.mongoConnection) {
    throw (new Error('Mongo is not connected yet'));
  }
  const collection = global.mongoConnection.collection(typeName);

  return new Promise((rsv, rjt) => {
    collection.findOne({ _id: id }, (err, r) => {
      if (err) return rjt(err);
      return rsv(r);
    });
  });
};

// функция что бы записать значение сущности в базу по названию коллекции и значению объекта
schema.writeItemFn = (typeName, obj) => {
  if (!global.mongoConnection) {
    throw (new Error('Mongo is not connected yet'));
  }
  const collection = global.mongoConnection.collection(typeName);

  return new Promise((rsv, rjt) => {
    if (obj._v === 1) {
      collection.insertOne(obj, (err) => {
        if (err) {
          // Return non-success instead of duplicate key error, since this is
          // expected to occur during simultaneous creates on the same id
          if (err.code === 11000) return rsv(false);

          return rjt(err);
        }
        return rsv(true);
      });
    } else {
      collection.replaceOne({ _id: obj._id, _v: obj._v - 1 }, obj, (err, result) => {
        if (err) return rjt(err);
        const succeeded = !!result.modifiedCount;
        return rsv(succeeded);
      });
    }
  });
};

// подключение оплога  ================
const opLog = require('./opLog.es6');
opLog.connectTo(schema);

module.exports = new sharedbGraphQL.Driver(schema);
