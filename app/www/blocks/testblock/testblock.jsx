"use strict"

import React, { Component } from "react";
import { Connect } from "racer-react";

class Testblock extends Component {
   componentDidMount() {
      if(this.props.query){
         this.racerQuery("test",this.props.query).observeAs("qresult");
      }
   }
   render() {
      return (
         <div className={"Testblock onscreen_"+this.props.isOnscreen}>
            <h2>{this.props.title} ={this.props.qresultExtra||''}=</h2>
            <div>{this.props.text}</div>
         </div>
      );
   }
}

export default Connect( Testblock );
