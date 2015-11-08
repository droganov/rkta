"use strict"

import React, { Component } from "react";
import Helmet from "react-helmet";
// import Relay from "react-relay";

import Mq from "../blocks/mq/mq";

export default class App extends Component {
   render() {
      return (
         <div className="App">
            <Helmet
               title="My Title"
               titleTemplate="exlab: %s"
            />
            <div className="App__content">
               { this.props.children }
            </div>
         </div>
      );
   }
}
