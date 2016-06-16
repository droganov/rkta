import React from 'react';

export default ({
  hash,
  helmet,
  isProduction,
  markup,
  mountPoint,
  name,
  racerBundle,
  reduxState,
}) => {
  const { base, link, meta, script, title } = helmet;
  return (<html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
    {isProduction && <script src={`/assets/shared.js?${hash}`} async={isProduction} />}
      <script src={`/assets/${name}.js?${hash}`} async={isProduction} />
      {isProduction && <link rel="stylesheet" href={`/assets/${name}.css?${hash}`} />}
      {base.toComponent()}
      {link.toComponent()}
      {meta.toComponent()}
      {script.toComponent()}
      {title.toComponent()}
    </head>
    <body>
      <div id={mountPoint} dangerouslySetInnerHTML={{ __html: markup }} />
      <div id="bundle" data-racer-bundle={racerBundle} data-redux-state={reduxState}></div>
    </body>
  </html>);
};
if (module.hot) {
  module.hot.accept();
}
