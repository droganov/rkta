var debug = require( "debug" )( "build:build.js" )
var webpack = require( "webpack" )

// configs
var configClient = require( "../config/config.webpack.client" )
var configServer = require( "../config/config.webpack.client" )

// compilers
var compilerClient = webpack( configClient )
var compilerServer = webpack( configServer )



debug( "building..." )

var clientPromise = new Promise( function( resolve, reject ){
  debug( "client bundle..." )
  compilerClient.run( function( err, stats ){
    if( err ) return reject( err )
    debug( "client bundle built!" )
    resolve( stats )
  })
})

// var serverPromise = new Promise( function( resolve, reject ){
//   debug( "server bundle..." )
//   compilerServer.run( function( err, stats ){
//     if( err ) return reject( err )
//     debug( "server bundle built!" )
//     resolve( stats )
//   })
// })

Promise
  .all([ clientPromise ])
  .then( function(){
    debug( "All jobs done" );
  })
  .catch(function( err ){
    trow( err );
  })
