"use strict"

var connectClient = require( "./connect-client" );
var match = require( "./match" );
var Provider = require( "./provider" );

module.exports = {
  connectClient: connectClient,
  match: match,
  Provider: Provider
}
