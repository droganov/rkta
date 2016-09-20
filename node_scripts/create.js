var debug = require( "debug" )( "create:create.js" )
var fs = require( "fs" )
var path = require( "path" )
var _ = require( "lodash" )
var ncp = require( "ncp" ).ncp
var configApplicationsPath = "../config/config.applications.json"
var configApplications = require( configApplicationsPath )

var name = process.env.npm_config_app
if( !name ) return debug( 'Please pass the application name! Example: "npm run create --app=name"' )

var ncpOptions = { stopOnErr: true, clobber: false }
ncp.limit = 16

var pathToNewApp = "./front-end/applications/" + name
var pathToNewRoutes = path.join( pathToNewApp, "routes.jsx" )

ncp( "./front-end/_skeleton", pathToNewApp, ncpOptions, function ( err ){
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

      fs.readFile( pathToNewRoutes, "utf8", function ( err, data ){
        if ( err ) return debug( err )
        var result = data.replace( /__path__/g, "/" + name )

        fs.writeFile( pathToNewRoutes, result, "utf8", function ( err ){
           if ( err ) return debug( err )
           debug( "App created: " + name )
        });
      });

  })
})
