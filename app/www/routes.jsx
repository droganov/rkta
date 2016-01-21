"use strict"

import React from "react";
import { Router, Route, IndexRoute } from "react-router";

import App from "./views/App";
import FrontPage from "./views/front-page/front-page";
import TestPage from "./views/test-page/test-page";
import NotFound from "./views/not-found/not-found";

module.exports = () => (
   <Route
      path="/"
      component={ App }
   >
      <IndexRoute
         name="home"
         component={ FrontPage }
      />
      <Route path="/page" component={ TestPage } />
   <Route path="*" name="404" racerQueries="notFound" component={ NotFound } />
   </Route>
);
