"use strict"

import koa from "koa";
import React from "react";
import Helmet from "react-helmet";
import koaMount from "koa-mount";
import { join } from "path";

import { renderToStaticMarkup } from "react-dom/server";
import { match, RoutingContext } from "react-router";

import middleware from "./middleware";
import racer from "../tmp/racer-react/";


function getInstance ({ stats, Layout, routes, Store, dataProvider }){
   var app = koa();
   middleware( app );
   app.use( function *( next ){
      try {
         var body = yield racer.match(
            {
               routes: routes(),
               location: this.originalUrl,
               racerModel: this.req.getModel(),
               onSuccess: function( renderProps, racerBundle ){
                  const markup = renderToStaticMarkup(
                     <RoutingContext { ...renderProps } />
                  );
                  const response = renderToStaticMarkup(
                     <Layout
                        hash = { stats.hash }
                        isProduction = { process.env.NODE_ENV === "production" }
                        helmet = { Helmet.rewind() }
                        markup = { markup }
                        racerBundle={ racerBundle }
                     />
                  );
                  return response;
               }
            }
         );
         this.body = "<!DOCTYPE html>" + body;
      }
      catch ( error ) {
         if( error.status ){
            this.status = error.status;
            this.redirect( error.location.pathname + error.location.search );
         }
         this.throw( error.message, 500 );
      }
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
