import React from 'react';
import { RouterContext } from 'react-router';
import Helmet from 'react-helmet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as RacerProvider } from 'racer-react';

function markup(props) {
  const { reduxStore, racerModel, renderProps } = props;
  return renderToStaticMarkup(
    <ReduxProvider store={reduxStore} >
      <RacerProvider racerModel={racerModel} >
        <RouterContext {...renderProps} />
      </RacerProvider>
    </ReduxProvider>
  );
}

function render(props) {
  const { hash, isProduction, markup: html, mountPoint, name, racerBundle, reduxState } = props;
  const { base, link, meta, script, title } = Helmet.rewind();

  return renderToStaticMarkup(
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        {isProduction && <script src={`/build/shared.js?${hash}`} async={isProduction} />}
        <script src={`/build/${name}.js?${hash}`} async={isProduction} />
        {isProduction && <link rel="stylesheet" href={`/build/${name}.css?${hash}`} />}
        {base.toComponent()}
        {link.toComponent()}
        {meta.toComponent()}
        {script.toComponent()}
        {title.toComponent()}
      </head>
      <body>
        <div id={mountPoint} dangerouslySetInnerHTML={{ __html: html }} />
        <div id="bundle" data-racer-bundle={racerBundle} data-redux-state={reduxState}></div>
      </body>
    </html>
  );
}

if (module.hot) {
  module.hot.accept();
}

module.exports = {
  markup,
  render,
};
