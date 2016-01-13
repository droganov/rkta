"use strict"
import React, { Component } from "react";
import Helmet from "react-helmet";

export default class FrontPage extends Component {
  static statics = {
    racerQueries: {
      one: "query",
    }
  };

  static contextTypes = {
    racerModel: React.PropTypes.object.isRequired,
  };

  constructor( props, context ) {
    super(props, context);
    const racerModel = props.racerModel || context.racerModel;
  }

  render() {
    return (
      <div className="FrontPage">
        <Helmet title="Home" />
        Hello
      </div>
    );
  }
}
