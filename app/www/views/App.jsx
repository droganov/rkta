"use strict"

import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router";

var App = React.createClass({
  render: function () {
    return (
      <div className="App">
        <Helmet
          title="My Title"
          titleTemplate="rkta: %s"
        />
          { this.props.children }
      </div>
    )
  }
});
export default App;
