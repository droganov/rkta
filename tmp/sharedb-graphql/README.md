# sharedb-mongo

MongoDB database adapter for [sharedb](https://github.com/share/sharedb). This
driver can be used both as a snapshot store and oplog.

Snapshots are stored where you'd expect (the named collection with _id=id). In
addition, operations are stored in `o_COLLECTION`. For example, if you have
a `users` collection, the operations are stored in `o_users`.

JSON document snapshots in sharedb-mongo are unwrapped so you can use mongo
queries directly against JSON documents. (They just have some extra fields in
the form of `_v` and `_type`). It is safe to query documents directly with the
MongoDB driver or command line. Any read only mongo features, including find,
aggregate, and map reduce are safe to perform concurrent with ShareDB.

However, you must *always* use ShareDB to edit documents. Never use the
MongoDB driver or command line to directly modify any documents that ShareDB
might create or edit. ShareDB must be used to properly persist operations
together with snapshots.


## Usage

`sharedb-mongo` wraps native [mongodb](https://github.com/mongodb/node-
mongodb-native), and it supports the same configuration options.

There are two ways to instantiate a sharedb-mongo wrapper:

1. The simplest way is to invoke the module and pass in your mongo DB
arguments as arguments to the module function. For example:

var db = require('sharedb-mongo')('localhost:27017/test');

2. If you already have a mongo connection that you want to use, you
alternatively can pass it into sharedb-mongo:

require('mongodb').connect('localhost:27017/test', function(err, mongo) {
  if (err) throw err;
  var db = require('sharedb-mongo')({mongo: mongo});
});


## Error codes

Mongo errors are passed back directly. Additional error codes:

#### 4100 -- Bad request - DB

* 4101 -- Invalid op version
* 4102 -- Invalid collection name
* 4103 -- $where queries disabled
* 4104 -- $mapReduce queries disabled
* 4105 -- $aggregate queries disabled

#### 5100 -- Internal error - DB

* 5101 -- Already closed
* 5102 -- Snapshot missing last operation field
* 5103 -- Missing ops from requested version


## MIT License
Copyright (c) 2015 by Joseph Gentle and Nate Smith

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
