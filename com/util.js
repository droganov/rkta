module.exports = {
   getBundleScriptName( appName, isProduction, hash ){
      return ( isProduction ? "/assets" : "/_assets" ) + "/" + appName + ".js?" + hash;
   },
   isServer(){
      return process.title !== "browser";
   },
   isTouchDevice(){
      try {
         document.createEvent( "TouchEvent" );
         return true;
      } catch (e) {
         return false;
      }
   },
   throttle(threshhold, context, fn) {
      fn || (fn = context);
      var last, deferTimer;
      return function (){
         var context = context || this;
         var now = +new Date;
         var args = arguments;
         if (last && now < last + threshhold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
               last = now;
               fn.apply(context, args);
            }, threshhold);
         }
         else {
            last = now;
            fn.apply(context, args);
         }
      };
   }
}
