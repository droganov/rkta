"use strict"

var racer = require( "racer" );
var transport = require( "../racer-transport-koa/client" );
var matchRoutes = require( "react-router" ).match;

var defaultOptions = {
   base: "/racer-channel",
   reconnect: true,
   // srvProtocol: undefined,
   // srvHost: undefined,
   // srvPort: undefined,
   // srvSecurePort: undefined,
   timeout: 10000,
   timeoutIncrement: 100
}

function connect( options, bundle ){
   var clientOptions = Object.assign( {}, defaultOptions, options );
   var bundle = bundle || getClientBundle();
   transport( racer, clientOptions );
   var model = racer.createModel( bundle );
   return model;
}

function getClientBundle( id ){
   var bundleData = document.getElementById( id || "racerBundle" );
   return JSON.parse( bundleData.dataset.json );
}

function match( options ){
   return new Promise( function( resolve, reject ){
      matchRoutes(
         {
            routes: options.routes,
            location: options.location
         },
         function( error, redirectLocation, renderProps ){
            if( error ){
               return reject( error );
            }
            if( redirectLocation ){
               return reject({
                  location: redirectLocation,
                  status: 301
               });
            }
            options.racerModel.bundle( function( error, racerBundle ){
               if( error ){
                  return reject( error );
               }
               var json = JSON.stringify( racerBundle );
               resolve(
                  options.onSuccess( renderProps, json && json.replace(/<\//g, '<\\/') )
               );
            });
         }
      );
   });
}

module.exports = {
   connect: connect,
   match: match
}
