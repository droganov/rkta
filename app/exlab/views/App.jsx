"use strict"

import React, { Component } from "react";
import Helmet from "react-helmet";
// import Relay from "react-relay";

import { Nav, NavLink } from "../blocks/nav/nav";
import Mq from "../blocks/mq/mq";

export default class App extends Component {
   componentWillMount(){
      this.setState({
         ts: Date.now(),
      });
   }
   render() {
      return (
         <div className="App">
            <Helmet
               title="My Title"
               titleTemplate="exlab: %s"
            />
            <Nav>
               <NavLink to="/exlab" name="Exlab Home"></NavLink>
               <NavLink to="/exlab/1" name="Link 1">child</NavLink>
               <NavLink to="/exlab/2" name="Link 2"></NavLink>
            </Nav>
            <div className="App__content">
               <div className="content-box">
                  <p>ts: { this.state.ts }</p>
               </div>

               { this.props.children }
            </div>
         </div>
      );
   }
}
