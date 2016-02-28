"use strict"
import React, { Component } from "react";
import Helmet from "react-helmet";

export default class NotFound extends Component {
   static propTypes = {};
   render() {
      return (
         <div className="NotFound">
            <Helmet title="Page not found" />
            <h1>404</h1>
            <p>Not found</p>
         </div>
      );
   }
}
