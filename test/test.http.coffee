debug          = require "debug"

printError     = debug "test:http:error"
printSuccess   = debug "test:http"


urlMap = []

seed = ( list, status ) ->
   list.forEach ( url ) ->
      urlMap.push
         url: url
         status: status

ok = [
   "/"
]

seed ok, 200

module.exports = ( agent )->
   jobs = []
   urlMap.forEach ( item, i ) ->
      agent
         .get item.url
         .expect item.status
         .end ( err, res ) ->
            if err?
               printError item.url + " — " + err.toString()
            else
               printSuccess item.url + " — OK"
