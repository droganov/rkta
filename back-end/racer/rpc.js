var racerRPC = require('racer-rpc');
var graphql = require('graphql');

module.exports = {
  rpc: racerRPC,
  init: init
};

function init(backend) {
  backend.rpc.on('graph', function (query, cb) {
    var parsedQuery = graphql.parse(query);
  	// выявляем определения запросов (query), все остальное отбрасываем
  	var queries = parsedQuery.definitions.filter(function (d) { return d.operation == "query" });

  	if(!queries.length) return cb(new Error("Query Definition not found."));

    var queryDef = queries[0];

    var selections = queryDef.selectionSet.selections.filter(function (s) {return s.kind == "Field"});

  	if(!selections.length) throw("Query field not found.");

    var model = backend.createModel();

    var queryPromises = selections.map(function(subQuery) {
      return new Promise(function(resolve, reject) {
        if (!subQuery.alias) return reject("Unknown alias for a query " + subQuery.name.value);


        backend.db.query(subQuery.alias.value, '{'+graphql.print(subQuery)+'}', null, null, function(error, snapshots, extra) {
          if (error) return reject(error) ;
          resolve(
            extra || snapshots.map(
              function(snap) {
                return {
                  id: snap.id,
                  v: snap.v,
                  data: snap.data
                };
              })
          );
        });

      });

    });

    Promise.all(queryPromises).then(function(results) {
      var itog = selections.reduce(function(rr, subQuery, index) {
        rr[subQuery.alias.value] = results[index];
        return rr;
      }, {});
      cb(null, itog);
    }).catch(function(error) {
      cb(error, []);
    }).then(function() {
      model.destroy();
    });
  });
}
