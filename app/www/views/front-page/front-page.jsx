"use strict"
import React, { Component } from "react";
import Helmet from "react-helmet";

export default class FrontPage extends Component {
   static statics = {
      racerQueries: {
         one: "query",
      }
   };
   render() {
      return (
         <div className="FrontPage">
            <Helmet title="Home" />
            Hello
         </div>
      );
   }
}
