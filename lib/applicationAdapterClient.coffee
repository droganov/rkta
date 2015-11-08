module.exports =
   # attach styles to page head
   attachStyle: ( data )->
      styles = document.getElementsByTagName "style"
      if styles.length
         style = styles[0]
      else
         style = document.createElement "style"
         head = document.getElementsByTagName("head")[0]
         head.appendChild style
      style.innerHTML = data

   # checking if document is ready
   onReady: ( cb )->
   	return cb() if document.readyState is "complete"
   	document.addEventListener "DOMContentLoaded", cb, false
