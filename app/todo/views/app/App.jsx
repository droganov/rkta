"use strict"

import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router";


// import Mq from "../blocks/mq/mq";


export default ({ children }) => (
   <div className="App">
      <Helmet
         title="My Title"
         titleTemplate="rkta: %s"
      />
      <div className="App__content">
        <h1>App 1</h1>
      </div>
   </div>
);
