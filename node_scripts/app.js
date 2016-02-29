var debug = require( "debug" )( "new:app.js" )

var name = process.env.npm_config_name;

if( !name ) return debug( 'Please privide application name! Example: npm run app --name="newappname"' )

console.log( "todo: new app from template" )
