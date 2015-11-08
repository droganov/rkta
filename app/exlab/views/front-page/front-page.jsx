"use strict"
import React, { Component } from "react";
import Helmet from "react-helmet";

export default class FrontPage extends Component {
   render() {
      return (
         <div className="FrontPage">
            <Helmet title="Home" />
            Exlab
         </div>
      );
   }
}
