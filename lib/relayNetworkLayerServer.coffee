# https://facebook.github.io/relay/docs/interfaces-relay-network-layer.html
module.exports =
   sendMutation: (mutationRequest) ->
      console?.log typeof mutationRequest
   sendQueries: ( queryRequests ) ->
      console?.log queryRequests
   supports: ( options ) ->
      console?.log options
