# https://github.com/visionmedia/superagent/issues/230

request = require "superagent"

module.exports =
   fetchNews: ->
      yield request
         .get "https://ajax.googleapis.com/ajax/services/feed/load?v=2.0&q=https://facebook.github.io/react/feed.xml&num=5"
         .set "Accept", "application/json"
         .query
            search: "sloths"
         .end()
