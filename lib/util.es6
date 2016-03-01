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
}
