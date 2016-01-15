"use strict"

import React from "react";
import { Router, Route, IndexRoute } from "react-router";

import App from "./views/App";
import FrontPage from "./views/front-page/front-page";
import NotFound from "./views/not-found/not-found";

// https://github.com/rackt/react-router/blob/latest/docs/guides/basics/RouteConfiguration.md#alternate-configuration
const routeConfig = [
  { path: '/',
   component: App,
   indexRoute: {
      name: "home",
      component: FrontPage
   },
   childRoutes: [
      { path: '*', name:"404", component: NotFound },
   ]
  }
]

module.exports = routeConfig
//    <Route
//       path="/"
//       component={ App }
//    >
//       <IndexRoute
//          name="home"
//          component={ FrontPage }
//       />
//       <Route path="*" name="404" component={ NotFound } />
//    </Route>
// );
