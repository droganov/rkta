var async 		= require('async');
var Sharedb 	= require('sharedb');
var DB 				= Sharedb.DB;
var Schema   	= require("./schema");
var Util 			= require("./util");

module.exports = ShareDbGraphQl;

function ShareDbGraphQl(schemaInstance) {

  if (!(this instanceof ShareDbGraphQl)) {
    return new ShareDbGraphQl(schemaInstance);
  }

  if(!schemaInstance) {
  	throw("В качестве первого аргумента должен быть экземпляр класса схемы Schema.");
  }
	if(!(schemaInstance instanceof Schema)) {
		throw("Первый аргумент не является экземпляром класса схемы.");
	}
	if(!schemaInstance.grapQLschema) {
		schemaInstance.init();
	}

	// готовая схема
	this.schema = schemaInstance;

  // флаг закрытого драйвера
  this.closed = false;

  return this;
};

ShareDbGraphQl.prototype = Object.create(DB.prototype);

ShareDbGraphQl.prototype.registerBackend = function (backend) {
	if(!backend) throw("В качестве аргумента ожидается экземпляр Backend (Sharedb)");
	if(typeof backend.use !== "function") throw("Аргумент не является экземпляром Backend (Sharedb)");
	this.backend = backend;
	backend.use("op", function (shareRequest, next) {
		// перехват операций ...
		next();
	});
	backend.use("receive", function (shareRequest, next) {
		// хук для пометки запросов и созранения агентов
		// console.log(shareRequest.agent.clientId, shareRequest.data);
		next();
	});
};

ShareDbGraphQl.prototype.close = function(callback) {
  if (!callback) {
    callback = function(err) {
      if (err) throw err;
    };
  }
  this.closed = true;
  callback();
};

ShareDbGraphQl.prototype.projectsSnapshots = true;


ShareDbGraphQl.prototype._graphQLRequest = function  (queryString, variables, callback) {
	// определяем опущены ли переменые
	if(typeof variables == "function") {
		callback = variables;
		variables = null;
	}
	if(this.schema) {
		this.schema.request(queryString, variables).then(function (result) {
			// console.log("_graphQLRequest ===================================");
			// console.log(queryString, variables, result);
			// console.log("------------------------------------");
			if(result.errors) {
        return callback(result.errors[0]);
      }
			callback(null, result.data);
		}).catch(callback);
		return;
	}
	throw("ShareDbGraphQl._graphQLRequest - не задана схема");
};

// **** Snapshot methods

ShareDbGraphQl.prototype.getSnapshot = function(collectionName, id, fields, callback) {
	var type = this.schema.types[collectionName];
	if(!type) {
		return callback("Неверный запрос, неизвестный тип: "+collectionName);
	}
	var queryName = this.schema.snapshotQueryKey[collectionName];

	var idParsed = parseId(id);
	var queryString = '{'+queryName + '(id:"' + idParsed.id + '") { ... on ' + collectionName;

	// проекция полей первого уровня
	var queryFields = makeQueryFields(this.schema.surfaceStructureOfTypes[collectionName], fields);

	if(idParsed.query) { // обработка уточненного запроса
		queryString += this.schema.updateQuerySelection(idParsed.query, queryFields);
	} else { // обработка обычного запроса на основе автоматически изготовленного шаблона
		queryString += this.schema.getSnapshotQueryTemplate(collectionName, queryFields);
	}

	queryString += ',' + this.schema.emptySnapshotFragment();

	queryString += '}}';

	this._graphQLRequest(queryString, function (err, data) {
		if(err) return callback(err);
		var doc = data[queryName];
		var snapshot = (doc) ? castToSnapshot(doc) : new MongoSnapshot(idParsed.id, 0, null, undefined);
		callback(null,snapshot);
	});
};

ShareDbGraphQl.prototype.getSnapshotBulk = function(collectionName, ids, fields, callback) {
	var self = this;
	var docs = [];
	// TODO: сделать отдельный запрос для производительности
	async.each(ids, function (id, cbk) {
		self.getSnapshot(collectionName, id, fields,function (err,snapshot) {
			docs.push(snapshot);
			cbk(err);
		});
	}, function (err) {
		if(err) return callback(err);

		var snapshotMap = {};
		for (var i = 0; i < docs.length; i++) {
			var snapshot = castToSnapshot(docs[i]);
			snapshotMap[snapshot.id] = snapshot;
		}

		var uncreated = [];
		for (var i = 0; i < ids.length; i++) {
			var id = ids[i];
			if (snapshotMap[id]) continue;
			snapshotMap[id] = new MongoSnapshot(id, 0, null, undefined);
		}
		callback(null, snapshotMap);
	});
};

// **** Query methods

ShareDbGraphQl.prototype._query = function(collectionName, inputQuery, fields, callback) {
	var queryData = this.schema.updateQueryString(collectionName, inputQuery, fields);

	this._graphQLRequest(queryData.string, function(err, data) {
    var result = data && data[queryData.name];
    if(queryData.isExtra) return callback(err, [], result);
		callback(err, result);
	});
};

ShareDbGraphQl.prototype.query = function(collectionName, inputQuery, fields, options, callback) {
	this._query(collectionName, inputQuery, fields, function(err, results, extra) {
		if (err) return callback(err);
		var snapshots = [];
		for (var i = 0; i < results.length; i++) {
			var snapshot = castToSnapshot(results[i]);
			snapshots.push(snapshot);
		}
		callback(null, snapshots, extra);
	});
};

ShareDbGraphQl.prototype.queryPoll = function(collectionName, inputQuery, options, callback) {
  this._query(collectionName, inputQuery, { _id: true }, function(err, results, extra) {
    if (err) return callback(err);
    var ids = [];
    for (var i = 0; i < results.length; i++) {
      ids.push(results[i]._id);
    }
    callback(null, ids, extra);
  });
};

// **** Polling optimization

// Can we poll by checking the query limited to the particular doc only?
ShareDbGraphQl.prototype.canPollDoc = function(collectionName, query) {
  return false;
};

// Return true to avoid polling if there is no possibility that an op could
// affect a query's results
ShareDbGraphQl.prototype.skipPoll = function(collectionName, id, op, query) {
  // Livedb is in charge of doing the validation of ops, so at this point we
  // should be able to assume that the op is structured validly
  if (op.create || op.del) return false;
  if (!op.op) return true;

  // дефолттовое поведение без реализации
  return false;
};

// **** Oplog methods

ShareDbGraphQl.prototype.getOps = function(collectionName, id, from, to, callback) {
  var self = this;
  var queryName = this.schema.snapshotQueryKey[collectionName];
  var idParsed = parseId(id);
	var queryString = '{'+queryName + '(id:"' + idParsed.id + '") { ... on ' + collectionName;

	var queryFields = { _id:true, _v: true, _o: true };

	queryString += Util.fieldsStructToQueryString(queryFields);

	queryString +=  "," + this.schema.emptySnapshotFragment();

	queryString += '}}';

  this._graphQLRequest(queryString, function (err, data) {
    if (err) return callback(err);
    var doc = data[queryName];
    if (doc) {
      if (isCurrentVersion(doc, from)) {
        return callback(null, []);
      }
      var err = doc && checkDocHasOp(collectionName, idParsed.id, doc);
      if (err) return callback(err);
    }
    self._getOps(collectionName, idParsed.id, from, function(err, ops) {
      if (err) return callback(err);
      var filtered = filterOps(ops, doc, to);
      var err = checkOpsFrom(collectionName, idParsed.id, filtered, from);
      if (err) return callback(err);
      callback(null, filtered);
    });
  });
};

ShareDbGraphQl.prototype._getOps = function(collectionName, id, from, callback) {
	var self = this;
	var queryString = '{'+ this.schema.OpLog.listQueryKey + '(typeName:"'+collectionName+'",id:"'+id+'"';
	if(from !== null) {
		queryString += ',from:'+from;
	}
	queryString += ')';

  // Exclude the `d` field, which is only for use internal to livedb-mongo.
  // Also exclude the `m` field, which can be used to store metadata on ops
  // for tracking purposes

	var queryFields = {
		_id: true,
		src: true,
		seq: true,
		v: true,
		o: true,
		// d: true,
		// m: {
		// 	ts: true
		// },
		del: true
	};

	queryString += Util.fieldsStructToQueryString(queryFields);
	queryString += '}';

	this._graphQLRequest(queryString,function (err, data) {
		if(err) return callback(err);
		callback(null,data[self.schema.OpLog.listQueryKey]);
	});
};

ShareDbGraphQl.prototype._getOpsBulk = function(collectionName, docsToUpdate, callback) {
	var self = this;
	var opsMap = {};

	async.each(docsToUpdate, function (wdoc, cbk) {
		var id = wdoc.doc._id;
		var from = wdoc.from;
		self._getOps(collectionName, id, from, function (err, ops) {
			if(err) return cbk(err);
			opsMap[id] = ops;
			cbk()
		})
	}, function (err) {
		callback(err, opsMap);
	});
};

ShareDbGraphQl.prototype.getOpsBulk = function(collectionName, dirtyFromMap, dirtyToMap, callback) {
  var self = this;
  var fromMap = {};
  var toMap = {};

  for(var id in dirtyFromMap) fromMap[parseId(id).id] = dirtyFromMap[id];
  for(var id in dirtyToMap) toMap[parseId(id).id] = dirtyToMap[id];

  var ids = Object.keys(fromMap);

  this._getSnapshotOpLinkBulk(collectionName, ids, function(err, docs) {
    if (err) return callback(err);
    var docMap = getDocMap(docs);
    // Add empty array for snapshot versions that are up to date and create
    // the query conditions for ops that we need to get

    var docsToUpdate = [];
    var opsMap = {};

    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      var doc = docMap[id];
      var from = fromMap[id];
      if (doc) {
        if (isCurrentVersion(doc, from)) {
          opsMap[id] = [];
          continue;
        }
        var err = checkDocHasOp(collectionName, id, doc);
        if (err) return callback(err);
      }
      docsToUpdate.push({doc:doc,from:from});
    }
    // Return right away if none of the snapshot versions are newer than the
    // requested versions
    if (!docsToUpdate.length) return callback(null, opsMap);
    // Otherwise, get all of the ops that are newer
    self._getOpsBulk(collectionName, docsToUpdate, function(err, opsBulk) {
      if (err) return callback(err);
      for (var i = 0; i < docsToUpdate.length; i++) {
        var id = docsToUpdate[i].doc._id;
        var ops = opsBulk[id];
        var doc = docMap[id];
        var from = fromMap[id];
        var to = toMap && toMap[id];
        var filtered = filterOps(ops, doc, to);
        var err = checkOpsFrom(collectionName, id, filtered, from);
        if (err) return callback(err);
        opsMap[id] = filtered;
      }
      callback(null, opsMap);
    });
  });
};

ShareDbGraphQl.prototype._getSnapshotOpLinkBulk = function(collectionName, ids, callback) {
	var self = this;
	var queryName = this.schema.snapshotQueryKey[collectionName];
	var queryFields = { _id:true, _v: true, _o: true };
	var queryFieldsString = Util.fieldsStructToQueryString(queryFields);
	var result = [];

	// TODO: переделать на одинарный запрос для производительности
	async.each(ids, function  (id, cbk) {
		var queryString = '{'+queryName + '(id:"' + id + '") { ... on ' + collectionName;
		queryString += queryFieldsString;
		queryString +=  "," + self.schema.emptySnapshotFragment();
		queryString += '}}';

		self._graphQLRequest(queryString, function (err, data) {
			if(err) return cbk(err);
			result.push(data[queryName]);
			cbk();
		});
	},function (err) {
		if(err) return callback(err);
		callback(null, result);
	});
};

ShareDbGraphQl.prototype.getOpsToSnapshot = function(collectionName, dirtyId, from, snapshot, callback) {
	var id = parseId(dirtyId).id;

  if (snapshot._opLink == null) {
    var err = getSnapshotOpLinkErorr(collectionName, id);
    return callback(err);
  }
  this._getOps(collectionName, id, from, function(err, ops) {
    if (err) return callback(err);
    var filtered = getLinkedOps(ops, null, snapshot._opLink);
    var err = checkOpsFrom(collectionName, id, filtered, from);
    if (err) return callback(err);
    callback(null, filtered);
  });
};

DB.prototype.getCommittedOpVersion = function(collectionName, id, snapshot, op, callback) {
  var self = this;
  var queryString = '{'+this.schema.OpLog.itemQueryKey+'(typeName:"'+collectionName+'",src:"'+op.src+'",seq:'+op.seq+'){v}}';

  // Find the earliest version at which the op may have been committed.
  // Since ops are optimistically written prior to writing the snapshot, the
  // op could end up being written multiple times or have been written but
  // not count as committed if not backreferenced from the snapshot

  this._graphQLRequest(queryString, function (err, data) {
    if (err) return callback(err);
    // If we find no op with the same src and seq, we definitely don't have
    // any match. This should prevent us from accidentally querying a huge
    // history of ops
    var doc = data[self.schema.OpLog.itemQueryKey];
    if (!doc) return callback();
    // If we do find an op with the same src and seq, we still have to get
    // the ops from the snapshot to figure out if the op was actually
    // committed already, and at what version in case of multiple matches
    var from = doc.v;
    self.getOpsToSnapshot(collectionName, id, from, snapshot, function(err, ops) {
      if (err) return callback(err);
      for (var i = ops.length; i--;) {
        var item = ops[i];
        if (op.src === item.src && op.seq === item.seq) {
          return callback(null, item.v);
        }
      }
      callback();
    });
  });
};

function isCurrentVersion(doc, version) {
  return doc._v === version;
}
function checkDocHasOp(collectionName, id, doc) {
  if (doc._o) return;
  return getSnapshotOpLinkErorr(collectionName, id);
}
function filterOps(ops, doc, to) {
  // Always return in the case of no ops found whether or not consistent with
  // the snapshot
  if (!ops) return [];
  if (!ops.length) return ops;
  if (!doc) {
    // There is no snapshot currently. We already returned if there are no
    // ops, so this could happen if:
    //   1. The doc was deleted
    //   2. The doc create op is written but not the doc snapshot
    //   3. Same as 3 for a recreate
    //   4. We are in an inconsistent state because of an error
    //
    // We treat the snapshot as the canonical version, so if the snapshot
    // doesn't exist, the doc should be considered deleted. Thus, a delete op
    // should be in the last version if no commits are inflight or second to
    // last version if commit(s) are inflight. Rather than trying to detect
    // ops inconsistent with a deleted state, we are simply returning ops from
    // the last delete. Inconsistent states will ultimately cause write
    // failures on attempt to commit.
    //
    // Different delete ops must be identical and must link back to the same
    // prior version in order to be inserted, so if there are multiple delete
    // ops at the same version, we can grab any of them for this method.
    // However, the _id of the delete op might not ultimately match the delete
    // op that gets maintained if two are written as a result of two
    // simultanous delete commits. Thus, the _id of the op should *not* be
    // assumed to be consistent in the future.
    var deleteOp = getLatestDeleteOp(ops);
    // Don't return any ops if we don't find a delete operation, which is the
    // correct thing to do if the doc was just created and the op has been
    // written but not the snapshot. Note that this will simply return no ops
    // if there are ops but the snapshot doesn't exist.
    if (!deleteOp) return [];
    return getLinkedOps(ops, to, deleteOp._id);
  }
  return getLinkedOps(ops, to, doc._o);
}
function getLatestDeleteOp(ops) {
  for (var i = ops.length; i--;) {
    var op = ops[i];
    if (op.del) return op;
  }
}

function getLinkedOps(ops, to, link) {
  var linkedOps = []
  for (var i = ops.length; i-- && link;) {
    var op = ops[i];
    if (link.equals ? !link.equals(op._id) : link !== op._id) continue;
    link = op.o;
    if (to == null || op.v < to) {
      delete op._id;
      delete op.o;
      linkedOps.unshift(op);
    }
  }
  return linkedOps;
}

function checkOpsFrom(collectionName, id, ops, from) {
  if (ops.length === 0) return;
  if (ops[0] && ops[0].v === from) return;
  if (from == null) return;
  return {
    code: 5103,
    message: 'Missing ops from requested version ' + collectionName + '.' + id + ' ' + from
  }
};
function getSnapshotOpLinkErorr(collectionName, id) {
  return {
    code: 5102,
    message: 'Snapshot missing last operation field "_o" ' + collectionName + '.' + id
  };
}

function getDocMap(docs) {
  var docMap = {};
  for (var i = 0; i < docs.length; i++) {
    var doc = docs[i];
    docMap[doc._id] = doc;
  }
  return docMap;
}
function parseId(id) {
	// определяем есть ли уточняющий запрос в хвосте id ( пример: 12345__{filed1,fields2{subfield1, sufield2}} )
	var idParts = id.toString().split("__");
	return {
		id: idParts[0],
		query: idParts[1]
	}
}

// Utility methods

function makeQueryFields (originalQueryFields, fields) {
	var queryFields = Util.deepClone(originalQueryFields);

	// если не задана проекция, поля _m и _o все равно нужно удалить, они для внутреннего использования
	if(!fields) {
		delete queryFields._m;
		delete queryFields._o;
		return queryFields;
	}
	// вызов из submit-request не проецируется
	if(fields.$submit) return queryFields;

	// снятие полей не предусмотренных струкутрой fields
	stripFields(queryFields, fields);

	// установка постоянных полей
	queryFields._id = true;
	queryFields._type = true;
	queryFields._v = true;

	return queryFields;
}

function stripFields(queryFields, allowFields) {
	if(!allowFields || !Util.isObject(allowFields)) return;

	for(var fieldName in queryFields) {
		if(!allowFields[fieldName]) {
			delete queryFields[fieldName];
		}
	}
}

function castToDoc(id, snapshot, opLink) {
  var data = snapshot.data;
  var doc =
    (Util.isObject(data)) ? Util.shallowClone(data) :
    (data === undefined) ? {} :
    {_data: data};
  doc._id = id;
  doc._type = snapshot.type;
  doc._v = snapshot.v;
  doc._m = snapshot.m;
  doc._o = opLink;
  return doc;
}
function castToSnapshot(doc) {
  var id = doc._id;
  var version = doc._v;
  var type = doc._type;
  var data = doc._data;
  var meta = doc._m;
  var opLink = doc._o;
  if (type == null) {
    return new MongoSnapshot(id, version, null, undefined, meta, opLink);
  }
  // if (doc.hasOwnProperty('_data')) {
  //   return new MongoSnapshot(id, version, type, data, meta, opLink);
  // }
  data = Util.shallowClone(doc);
  delete data._id;
  delete data._v;
  delete data._type;
  delete data._m;
  delete data._o;
  return new MongoSnapshot(id, version, type, data, meta, opLink);
}
function MongoSnapshot(id, version, type, data, meta, opLink) {
  this.id = id;
  this.v = version;
  this.type = type;
  this.data = data;
  if (meta) this.m = meta;
  if (opLink) this._opLink = opLink;
}

// **** Commit methods

ShareDbGraphQl.prototype.commit = function(collectionName, id, op, snapshot, callback) {
  var self = this;
  this._writeOp(collectionName, id, op, snapshot, function(err, opId) {
    if (err) return callback(err);
    self._writeSnapshot(collectionName, id, snapshot, opId, function(err, succeeded) {
      if (succeeded) return callback(err, succeeded);
      // Cleanup unsuccessful op if snapshot write failed. This is not
      // neccessary for data correctness, but it gets rid of clutter
      self._deleteOp(collectionName, opId, function(removeErr) {
        callback(err || removeErr, succeeded);
      });
    });
  });
};

ShareDbGraphQl.prototype._writeSnapshot = function(collectionName, id, snapshot, opLink, callback) {
  var doc = castToDoc(id, snapshot, opLink);
  // учет записи пустого (удаленного) документа
  var typeName = Util.getInputTypeName( doc._type ? collectionName : this.schema.getEmptySnapshotTypeName() );
  var queryString = 'mutation _writeSnapshot($doc:'+typeName+'!){'+this.schema.writeSnapshotItemMutationKey+'(collectionName:"'+collectionName+'",'+typeName+':$doc)}';
  this._graphQLRequest(queryString,{doc:doc}, callback);
};

ShareDbGraphQl.prototype._writeOp = function(collectionName, id, op, snapshot, callback) {
	if (typeof op.v !== 'number') {
		var err = {
			code: 4101,
			message: 'Invalid op version ' + collectionName + '.' + id + ' ' + op.v
		};
		return callback(err);
	}

	var self = this;

	var doc = Util.shallowClone(op);
	doc.d = parseId(id).id;
	doc.o = snapshot._opLink;

	// сериализуем данные которые не описаны в схеме
	if(doc.create) {
		doc.create = JSON.stringify(doc.create);
	}

	if(doc.op) {
		doc.op = JSON.stringify(doc.op);
	}

	if(doc.m&&doc.m.data) {
		doc.m.data = JSON.stringify(doc.m.data);
	}

  var queryString = 'mutation _writeOp($op:'+Util.getInputTypeName(this.schema.OpLog.typeName)+'!) {'+this.schema.OpLog.writeMutationKey+'(';
  queryString += 'typeName:"'+collectionName+'",id:"'+doc.d+'",op:$op)}';
  var variables = {op: doc};

  this._graphQLRequest(queryString, variables, function (err,data) {
  	callback(err, data&&data[self.schema.OpLog.writeMutationKey]);
  });
};

ShareDbGraphQl.prototype._deleteOp = function(collectionName, opId, callback) {
	var queryString = 'mutation _deleteOp {'+this.schema.OpLog.deleteMutationKey+'(typeName:"'+collectionName+'",id:"'+opId+'")}';
	this._graphQLRequest(queryString, callback);
};
