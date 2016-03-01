"use strict"
import React from "react";

export default ({
  children,
  hash,
  helmet,
  isProduction,
  markup,
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
      <div id={ mountPoint } dangerouslySetInnerHTML={{ __html: markup }} />
      <div id="racerBundle" data-json={ racerBundle }></div>
    </body>
  </html>
}
