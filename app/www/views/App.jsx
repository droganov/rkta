"use strict"

import React, { Component } from "react";
import Helmet from "react-helmet";


// import Mq from "../blocks/mq/mq";


export default ({ children }) => (
   <div className="App">
      <Helmet
         title="My Title"
         titleTemplate="rkta: %s"
      />
      <div className="App__content">
         { children }
      </div>
   </div>
);
