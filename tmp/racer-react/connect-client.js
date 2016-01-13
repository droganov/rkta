"use strict"

var racer = require( "racer" );
var highway = require( "racer-highway/lib/browser" );

var defaults = require("./defaults");

function connect( options, bundle ){
  var clientOptions = Object.assign( {}, defaults, options );
  var bundle = bundle || getClientBundle();
  highway( racer, clientOptions );
  var model = racer.createModel( bundle );
  return model;
}

function getClientBundle( id ){
  var bundleData = document.getElementById( id || "racerBundle" );
  return JSON.parse( bundleData.dataset.json );
}

module.exports = connect;
