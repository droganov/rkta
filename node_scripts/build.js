var debug = require( "debug" )( "build:build.js" )
var webpack = require( "webpack" )

// configs
var configClient = require( "../config/config.webpack.build" )
var configServer = require( "../config/config.webpack.server" )

// compilers
var compilerClient = webpack( configClient )
var compilerServer = webpack( configServer )

var clientPromise = new Promise( function( resolve, reject ){
  debug( "Bundling client..." )
  compilerClient.run( function( err, stats ){
    if( err ) return reject( err )
    debug( "Bundling client done." )
    resolve( stats )
  })
})

var serverPromise = new Promise( function( resolve, reject ){
  debug( "Bundling server..." )
  compilerServer.run( function( err, stats ){
    if( err ) return reject( err )
    debug( "Bundling server done." )
    resolve( stats )
  })
})


Promise
  .all([ clientPromise, serverPromise ])
  .then( function( stats ){
    // console.log( stats )
    debug( "Ready!" );
  })
  .catch(function( err ){
    trow( err );
  })
