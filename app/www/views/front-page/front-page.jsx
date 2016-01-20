"use strict"
import React, { Component } from "react";
import Helmet from "react-helmet";

import Testblock from "../../blocks/testblock/testblock";

export default class FrontPage extends Component {
   render() {
    	return (
        	<div className="FrontPage">
            	<Helmet title="Home" />
            	Hello
            	<Testblock />
         	</div>
      	);
   }
}
