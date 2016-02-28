"use strict"
import React from "react";

export default ({
  children,
  hash,
  helmet,
  isProduction,
  mountPoint,
  name,
  racerBundle,
}) => {
  const { base, link, meta, script, title } = helmet
  return <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <script src={ "/assets/" + name + ".js?" + hash } />
      { isProduction && <link rel="stylesheet" href={ "/assets/" + name + ".css?" + hash } /> }
      { base.toComponent() }
      { link.toComponent() }
      { meta.toComponent() }
      { script.toComponent() }
      { title.toComponent() }
    </head>
    <body>
      <div id={ mountPoint } className={ mountPoint } >{ children }</div>
      <div id="racerBundle" data-json={ racerBundle }></div>
    </body>
  </html>
}

// module.exports = ({ name, hash, helmet, isProduction, markup, racerBundle }) => {
//   const { base, link, meta, script, title } = helmet;
//   const scriptName = getBundleScriptName( name, isProduction, hash );
//   return (
//     <html lang="en">
//       <head>
//         <meta charSet="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
//         <script src={ scriptName }></script>
//         { base.toComponent() }
//         { link.toComponent() }
//         { meta.toComponent() }
//         { script.toComponent() }
//         { title.toComponent() }
//         { /* <link rel="stylesheet" href={ "/assets/"+name+".css?" + hash } /> */ }
//       </head>
//       <body>
//         <div id="app" className="App" dangerouslySetInnerHTML={{ __html: markup }} />
//         <div id="racerBundle" data-json={ racerBundle }></div>
//       </body>
//     </html>
//   );
// };
