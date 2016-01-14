export function attachStyle( data ){
   const styles = document.getElementsByTagName( "style" );
   let head, style;
   if( styles.length > 0){
      style = styles[0];
   }
   else{
      style = document.createElement("style");
      head = document.getElementsByTagName("head")[0];
      head.appendChild(style);
   }
   style.innerHTML = data;
};

export function onReady( cb ){
   if( document.readyState == "complete" ){
      return cb();
   }
   document.addEventListener( "DOMContentLoaded", cb, false );
};
