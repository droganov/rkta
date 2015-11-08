"use strict"
import React, { Component } from "react";
import Helmet from "react-helmet";

export default class NotFound extends Component {
   // propTypes: {}
   // constructor(props) {
   //    super(props);
   //    this.state = {};
   //    this.defaultProps = {};
   //    this.statics = {};
   // }
   // componentWillMount(){}
   // componentDidMount(){}
   // componentWillReceiveProps(nextProps){}
   // shouldComponentUpdate(nextProps, nextState){}
   // shouldComponentUpdate(nextProps, nextState){}
   // componentWillUpdate(nextProps, nextState){}
   // componentDidUpdate(prevProps, prevState){}
   // componentWillUnmount(){}
   render() {
      return (
         <div className="NotFound">
            <Helmet title="Page not found" />
            <h1>404</h1>
            <p>Not found</p>
         </div>
      );
   }
}
