"use strict"
import React, { Component } from "react";
import { isServer } from "../../../../com/util"

import MediaQuery from "react-responsive"

export default class Mq extends Component {
   static propTypes = {
      name: React.PropTypes.string.isRequired
   };
   render() {
      let props = {};
      let query;

      switch ( this.props.name ) {
         case "phone":
            query = "screen and (max-width: 768px)"
            break;
         case "non-phone":
            query = "screen and (min-width: 769px)"
            break;
         case "tablet":
            query = "screen and (max-width: 992px)"
            break;
         case "desktop":
            query = "screen and (min-width: 993px)"
            break;
         case "largeDesktop":
            query = "(min-width: 1200px)"
            break;
         // default:

      }
      if( isServer() ){
         props.minDeviceWidth = 1224;
         props.values = {
            deviceWidth: 1600,
            width: 1600,
            orientation: "landscape",
            type: "screen",
         };
      }
      return (
         <MediaQuery query={ query } { ...props }>
            { this.props.children }
         </MediaQuery>
      );
   }
}
