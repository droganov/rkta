"use strict"
import React, { Component } from "react";
import Helmet from "react-helmet";

import Testblock from "../../blocks/testblock/testblock";

export default class IssuePage extends Component {
   render() {
      return (
         <div className="IssuePage">
            <Helmet title="Issue" />

            <h2>Manual list:</h2>
            <Testblock title="limit 1" limit={1} />
            <Testblock title="limit 2" limit={2} />
            <Testblock title="limit 3" limit={3} />

            <h2>In loop with keys:</h2>
            { [1,2,3].map((v)=> { return <Testblock key={"limit_"+v} title={"second limit "+v} limit={v} /> }) }
            
         </div>
      );
   }
}


