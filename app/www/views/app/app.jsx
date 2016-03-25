"use strict"

import React, { Component, PropTypes } from "react";
import Helmet from "react-helmet";

import { connectRacer } from "racer-react";

import Hello from "../../blocks/hello/hello";

import styles from "./app.styl"

export default class App extends Component {
  // static statics = {
  //   racer: function( query ){
  //     query( "todos", {} ).pipeAs( "todos" );
  //   }
  // };
  render() {
    return (
      <div className={ styles.app }>
        <Helmet
          title="My Title"
          titleTemplate="rkta: %s"
        />
      <Hello />
      We've got the examples: <a href="/todo">Todo app</a>
      </div>
    );
  }
}

export default connectRacer( App );
