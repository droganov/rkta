"use strict"

import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router";


// import Mq from "../blocks/mq/mq";

var App = React.createClass({
  render: function () {
    return (
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
            <Link to="/page4">Page4</Link>
          </nav>
          { this.props.children }
        </div>
      </div>
    )
  }
});
export default App;

