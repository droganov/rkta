"use strict"

import React, { Component } from "react";
import { Connect } from "racer-react";

import Form from "../form/form"

class Testblock extends Component {
  componentDidMount() {
    if(this.props.query){
      this.props.racerQuery( "test", this.props.query ).observeAs( "qresult" );
    }
  }
  render() {
    return (
      <div className={"Testblock onscreen_" + this.props.isOnscreen}>
        <h2>{this.props.title} ={this.props.qresult}=</h2>
        <div>{this.props.text}</div>
        <Form/>
      </div>
    );
  }
}

export default Connect( Testblock );
