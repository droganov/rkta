var debug = require( "debug" )( "new:app.js" )
var fs = require( "fs" )
var path = require( "path" )
var _ = require( "lodash" )
var ncp = require( "ncp" ).ncp
var configApplicationsPath = "../config/config.applications.json"
var configApplications = require( configApplicationsPath )

var name = process.env.npm_config_name
if( !name ) return debug( 'Please privide application name! Example: "npm run app --name=newappname"' )

var ncpOptions = { stopOnErr: true, clobber: false }
ncp.limit = 16
ncp( "./lib/app_skeleton", "./app/" + name, ncpOptions, function ( err ){
  if( err ) return debug( err )

  var appConfigRec = [{
     name: name,
     mountPoint: "/" + name,
  }]

  var newConfigApplications = _.uniqBy( appConfigRec.concat( configApplications ), "name" )

  fs.writeFile(
    path.resolve(
      path.join( "./config", configApplicationsPath )
    ),
    JSON.stringify( newConfigApplications, null, 2 ),
    function( err ) {
      if( err ) return debug( err )
      debug( "App created: " + name )
  })
})
