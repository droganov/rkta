"use strict"
var match = require( "react-router" ).match;

module.exports = function ( options ){
   return new Promise( function( resolve, reject ){
      match(
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
};
