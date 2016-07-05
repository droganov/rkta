require( "../config/config.server" );

var path = require("path");
var packageHash = require("./packageHash");
var debug = require( "debug" )( "dev:builddll.js" );
var webpack = require( "webpack" );

// configs
var configDLL = require( "../config/config.webpack.dll" );

// compilers
var compilerDLL = webpack( configDLL );

var p = new Promise( function( resolve, reject ){
  debug( "Bundling DLLs..." );

  compilerDLL.run( function( err, stats ){
    if( err ) return reject( err );
    packageHash.write(path.join(__dirname,"../build/dll/stats.json"));
    resolve( stats )
  });

}).then(function () {
  debug( "done." )
},function (err) {
  trow( err );
});

if(module && module.parent) {
  module.exports = p;
}
