var racerRPC = require('racer-rpc');
var graphql = require('graphql');

module.exports = {
  rpc: racerRPC,
  init: init
};

function init(backend) {
  backend.rpc.on('graphQlQuery', function (query, cb) {
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
        var racerQuery = model.query('todos', '{'+graphql.print(subQuery)+'}');
        racerQuery.fetch(function(error) {
          if (error) return reject(error) ;
          resolve(racerQuery.getExtra() || racerQuery.get());
        });
      });
    });

    Promise.all(queryPromises).then(function(results) {
      var itog = selections.reduce(function(rr, subQuery, index) {
        // console.log(subQuery);
        rr[subQuery.name.value] = results[index];
        return rr;
      }, {})
      cb(null, itog);
    }).catch(function(error) {
      cb(error, []);
    }).then(function() {
      model.destroy();
    });
  });
}
