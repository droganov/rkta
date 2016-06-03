const sharedbGraphQL = require('../../tmp/sharedb-graphql');

const mongodb = require('mongodb');

const collectionsByName = {};

GLOBAL.mongoConnection = null;

// схема типов  ==========
const schema = new sharedbGraphQL.Schema();

const todos = require(`${__dirname}/todos`);
const collections = [
  todos,
];

// коннект базы и создание индексов
mongodb.MongoClient.connect(process.env.MONGO_URL, (err, db) => {
  if (err) {
    console.log('MongoDB connected error:', err);
    return;
  }
  GLOBAL.mongoConnection = db;
  console.log('MongoDB connected succefully.');
});

collections.forEach((collection) => {
  const collectionShape = collection.shape();
  const Type = schema.implementType(collectionShape);

  collectionsByName[collectionShape.name] = collection;

  const collectionQueries = collection.queries(Type);
  if (collectionQueries) {
    schema.registerQuery(collectionShape.name, collectionQueries);
  }
});

// функция что бы вытащить значение сущности из базы по названию коллекции и id
schema.itemFn = (typeName, id) => {
  if (!GLOBAL.mongoConnection) {
    console.log('Mongo is not connected yet');
    return null;
  }
  const collection = GLOBAL.mongoConnection.collection(typeName);

  return new Promise((rsv, rjt) => {
    collection.findOne({ _id: id }, (err, r) => {
      if (err) return rjt(err);
      return rsv(r);
    });
  });
};
// функция что бы записать значение сущности в базу по названию коллекции и значению объекта
schema.writeItemFn = (typeName, obj) => {
  if (!GLOBAL.mongoConnection) {
    console.log('Mongo is not connected yet');
    return null;
  }
  const collection = GLOBAL.mongoConnection.collection(typeName);

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

// схема оплога  ================
const oplog = new sharedbGraphQL.OpLog();
// реализация работы с данными оплога
let oplogCollection = null;
function getOplogCollection() {
  if (!oplogCollection) {
    oplogCollection = GLOBAL.mongoConnection.collection('opLog');
  }
  return oplogCollection;
}
// функция для получения списка операций по параметрам d и from (не обязателен), сортировка {v:1}
oplog.list = (params, args) => {
  if (!GLOBAL.mongoConnection) return [];
  const collection = getOplogCollection();
  const q = {
    collection: args.typeName,
    d: args.id,
  };
  if (typeof args.from !== 'undefined') {
    q.v = {
      $gte: args.from,
    };
  }
  return new Promise((rsv, rjt) => {
    collection.find(q).sort({ v: 1 }).toArray((err, r) => {
      if (err) return rjt(err);
      return rsv(r);
    });
  });
};
// функция для получения одной опреции по параметрам src и seq, сортировка {v:1}
oplog.item = (params, args) => {
  if (!GLOBAL.mongoConnection) return [];
  const collection = getOplogCollection();
  const q = {
    $query: {
      collection: args.typeName,
      src: args.src,
      seq: args.seq,
    },
    $orderby: { v: 1 },
  };
  return new Promise((rsv, rjt) => {
    collection.findOne(q, (err, r) => {
      if (err) return rjt(err);
      return rsv(r);
    });
  });
};
// функция удаления одной операции по id (строка)
oplog.remove = (params, args) => {
  if (!GLOBAL.mongoConnection) return [];
  const collection = getOplogCollection();
  const q = { _id: new mongodb.ObjectId(args.id) };
  return new Promise((rsv, rjt) => {
    collection.deleteOne(q, (err) => {
      if (err) return rjt(err);
      return rsv(true);
    });
  });
};
// функция записи одной операции, возвращает сгенерированый _id в виде строки
oplog.write = (params, args) => {
  if (!GLOBAL.mongoConnection) return [];
  const collection = getOplogCollection();
  return new Promise((rsv, rjt) => {
    const op = args.op;
    op.collection = args.typeName;
    collection.insertOne(op, (err, r) => {
      if (err) return rjt(err);
      return rsv(r.insertedId.toString());
    });
  });
};
oplog.connectTo(schema);

module.exports = new sharedbGraphQL.Driver(schema);
