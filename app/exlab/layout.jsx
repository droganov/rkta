"use strict"
import React from "react";

module.exports = ({ hash, helmet, isProduction, markup, racerBundle }) => {
   const { base, link, meta, script, title } = helmet;
   const scriptName = ( isProduction ? "/assets" : "/_assets" ) + "/exlab.js?" + hash;
   return (
      <html lang="en">
         <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <script src={ scriptName }></script>
            { base.toComponent() }
            { link.toComponent() }
            { meta.toComponent() }
            { script.toComponent() }
            { title.toComponent() }
         </head>
         <body>
            <div id="app" className="App" dangerouslySetInnerHTML={{ __html: markup }} />
            <div id="racerBundle" data-json={ racerBundle }></div>
         </body>
      </html>
   );
};
