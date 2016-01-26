"use strict"
import React from "react";
import { getBundleScriptName } from "../../com/util";

module.exports = ({ hash, helmet, isProduction, markup, racerBundle }) => {
   const { base, link, meta, script, title } = helmet;
   const scriptName = getBundleScriptName( isProduction, hash );
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
            { isProduction ? <link rel="stylesheet" href={ "/assets/www.css?"+hash } /> : null }
         </head>
         <body>
            <div id="app" className="App" dangerouslySetInnerHTML={{ __html: markup }} />
            <div id="racerBundle" data-json={ racerBundle }></div>
         </body>
      </html>
   );
};
