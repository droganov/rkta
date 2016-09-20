import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './views/app/app';
import NotFound from './views/not-found/not-found';

module.exports = () => (
  <Route path="__path__">
    <IndexRoute component={App} />
    <Route path="*" status={404} component={NotFound} />
  </Route>
);
