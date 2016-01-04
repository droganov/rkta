"use strict"

import koa from "koa";
import React from "react";
import Helmet from "react-helmet";
import koaMount from "koa-mount";
import { join } from "path";

import { renderToStaticMarkup } from "react-dom/server";
import { match, RoutingContext } from "react-router";

import middleware from "./middleware";

function getInstance ({ stats, Layout, routes, Store, dataProvider }){
   const app = koa();
   middleware( app );
   app.use( function *( next ){
      let context = this;
      match({
            routes: routes(),
            location: this.originalUrl,
         },
         function( error, redirectLocation, renderProps ){
            if( error ){
               return context.throw( error.message, 500 );
            }
            if( redirectLocation ){
               context.status = 301;
               return context.redirect(redirectLocation.pathname + redirectLocation.search);
            }
            if( renderProps.routes.filter( route => route.name == "404" ).length > 0 ){
               context.status = 404;
            }
            const markup = renderToStaticMarkup(
               <RoutingContext {...renderProps} />
            );
            const response = renderToStaticMarkup(
               <Layout
                  hash = { stats.hash }
                  isProduction = { process.env.NODE_ENV === "production" }
                  helmet = { Helmet.rewind() }
                  markup = { markup }
               />
            );
            context.body = "<!DOCTYPE html>" + response;
      });
   });
   return app;
};

function mount( path, route ){
   return koaMount(
      route,
      getInstance({
         stats: require( "../build/stats" ),
         Layout: require( join( path, "layout")),
         routes: require( join( path, "routes")),
         // Store: require( join( path, "redux/store")),
         // dataProvider: require( join( path, "redux/dataProvider")),
      })
   )
}


module.exports = {
   getInstance,
   mount,
}
