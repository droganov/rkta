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
        <h1>App</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/page">Page</Link>
        </nav>
        { children }
      </div>
   </div>
);
