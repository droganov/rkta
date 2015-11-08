module.exports =
   isServer: -> process.title isnt "browser"
   isTouchDevice: ->
      try
        document.createEvent "TouchEvent"
        return true
      catch error
        return false
