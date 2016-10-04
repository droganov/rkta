const mongodb = require('mongodb');
const sharedbGraphQL = require('../../tmp/sharedb-graphql');

const opLog = new sharedbGraphQL.OpLog();

// реализация работы с данными оплога
let oplogCollection = null;
function getOplogCollection() {
  if (!oplogCollection) {
    oplogCollection = global.mongoConnection.collection('opLog');
  }
  return oplogCollection;
}

// функция для получения списка операций по параметрам d и from (не обязателен), сортировка {v:1}
opLog.list = (params, args) => {
  if (!global.mongoConnection) {
    throw (new Error('Mongo is not connected yet'));
  }
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
opLog.item = (params, args) => {
  if (!global.mongoConnection) {
    throw (new Error('Mongo is not connected yet'));
  }
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
opLog.remove = (params, args) => {
  if (!global.mongoConnection) {
    throw (new Error('Mongo is not connected yet'));
  }
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
opLog.write = (params, args) => {
  if (!global.mongoConnection) {
    throw (new Error('Mongo is not connected yet'));
  }
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

module.exports = opLog;
