module.exports = {
  isServer(){
    return process && process.title !== "browser";
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
    if( document.readyState !== "loading" ) return cb()
    document.addEventListener( "DOMContentLoaded", cb, false );
  },
}
