getbabelRelayPlugin     = require "babel-relay-plugin"
schema                  = require "../build/schema.json"

# console?.log schema.data

module.exports = getbabelRelayPlugin schema.data
