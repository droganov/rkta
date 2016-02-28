var debug = require( "debug" )( "build:build.js" )
var webpack = require( "webpack" )

// configs
var configClient = require( "../config/config.webpack.build" )

// compilers
var compilerClient = webpack( configClient )



var clientPromise = new Promise( function( resolve, reject ){
  debug( "Bundling..." )
  compilerClient.run( function( err, stats ){
    if( err ) return reject( err )
    debug( "Bundling done." )
    resolve( stats )
  })
})


Promise
  .all([ clientPromise ])
  .then( function(){
    debug( "Ready!" );
  })
  .catch(function( err ){
    trow( err );
  })
