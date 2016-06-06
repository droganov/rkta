/* eslint-disable no-underscore-dangle */

const todos = [
  { text: 'Сonnect migration',
    isComplete: true,
    _id: '32c54aeb-c408-4c8a-a228-4a6e90d88aee',
    _type: 'http://sharejs.org/types/JSONv0',
    _v: 1,
    _m: {
      ctime: 1465223844124,
      mtime: 1465223844124,
    },
  },
  { text: 'Apply migration',
    isComplete: false,
    _id: '32c54aeb-c408-4c8a-a228-4a6e90d88aef',
    _type: 'http://sharejs.org/types/JSONv0',
    _v: 1,
    _m: {
      ctime: 1465223844124,
      mtime: 1465223844124,
    },
  },
  { text: 'Check the result of the application migration',
    isComplete: false,
    _id: '32c54aeb-c408-4c8a-a228-4a6e90d88aed',
    _type: 'http://sharejs.org/types/JSONv0',
    _v: 1,
    _m: {
      ctime: 1465223844124,
      mtime: 1465223844124,
    },
  },
];

module.exports = {
  id: '1465222683094-28776-todos_init',
  up: (db, cb) => {
    const todosCollection = db.collection('todos');
    todosCollection.count({}, (err, cnt) => {
      if (cnt > 0) {
        return cb();
      }
      let chain = Promise.resolve();
      todos.forEach((todo) => {
        chain = chain.then(() => todosCollection.insertOne(todo));
      });
      return chain.then(() => cb())
        .catch(cb);
    });
  },
  down: (db, cb) => {
    db.collection('todos').drop(cb);
  },
};
