"use strict"

import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router";


import Form from "../../blocks/form/form";


export default ({ children }) => (
  <div className="App">
    <Helmet
      title="My Title"
      titleTemplate="rkta: %s"
    />
    <div className="App__header">Todos</div>
    <div className="App__content">Todo list</div>
    <div className="App__footer">
      <Form />
    </div>
  </div>
);
