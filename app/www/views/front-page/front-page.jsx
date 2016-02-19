"use strict"
import React, { Component } from "react";
import Helmet from "react-helmet";

class FrontPage extends Component {
  render() {
    return (
      <div className="FrontPage">
        <Helmet title="Home" />
        <h1>Hello</h1>
        <h2>Check out our sample apps</h2>
        <ul>
          <li>
            <a href="/todo">Todo app</a>
          </li>
        </ul>
      </div>
    );
  }
}

export default FrontPage
