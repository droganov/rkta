require( "../config/config.server" );

var debug = require( "debug" )( "builddll:builddll.js" );
var webpack = require( "webpack" );

// configs
var configDLL = require( "../config/config.webpack.dll" );

// compilers
var compilerDLL = webpack( configDLL );

new Promise( function( resolve, reject ){
  debug( "Bundling DLLs..." );

  compilerDLL.run( function( err, stats ){
    if( err ) return reject( err )
    resolve( stats )
  });

}).then(function () {
  debug( "Bundling DLLs done." )
},function (err) {
  trow( err );
});
