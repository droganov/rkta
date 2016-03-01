module.exports = {
  attachStyle( data ){
    var styles = document.getElementsByTagName( "style" );
    var head, style;
    if( styles.length > 0 ){
      style = styles[ 0 ];
    }
    else {
      style = document.createElement( "style" );
      head = document.getElementsByTagName( "head" )[ 0 ];
      head.appendChild( style );
    }
    style.innerHTML = data;
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
  domReady( cb ){
    if( document.readyState == "complete" ) return cb()
    document.addEventListener( "DOMContentLoaded", cb, false );
  },
  // throttle(threshhold, context, fn) {
  //   fn || (fn = context);
  //   var last, deferTimer;
  //   return function (){
  //     var context = context || this;
  //     var now = +new Date;
  //     var args = arguments;
  //     if (last && now < last + threshhold) {
  //       // hold on to it
  //       clearTimeout(deferTimer);
  //       deferTimer = setTimeout(function () {
  //         last = now;
  //         fn.apply(context, args);
  //       }, threshhold);
  //     }
  //     else {
  //       last = now;
  //       fn.apply(context, args);
  //     }
  //   };
  // }
}
