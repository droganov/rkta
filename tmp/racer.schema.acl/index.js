// https://github.com/epoberezkin/ajv

module.exports = function( backend, schema, acl ){

  backend.use( ["query", "submit"], function( req, next ){
    var operationType = getOperationType( req );
    var collectionName = req.collection;

    // deny access if no collection in schema
    if( !(collectionName in schema.schemas) ) return deny( next, "unknown collection " + collectionName, 403 );

    // apply access control
    console.log( "apply access control" );
    console.log( collectionName );
    next();
    // reject( next, "hui" );
  });

  backend.use( "commit", function( req, next ){
    // apply schema validation
    // console.log( "apply schema validation" );
    next();
    // reject( next, "hui" );
  });
}

function getOperationType( req ){
  if( req.action === "query" ) return "read";
  var op = req.op;
  if( "del" in op ) return "delete";
  if( "create" in op ) return "create";
  return "update"
}

function deny( next, reason, code ){
  var err = new Error( "Access denied: " + reason );
  err.code = code;
  next( err );
}
