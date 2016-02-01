"use strict"
import React, { Component } from "react";
import { Connect } from "racer-react";

export default class TestBlock extends Component {
	componentDidMount() {
		this.props.racerQuery("test",{
			$limit: (this.props.limit || 1),
			$orderby: {
				ts:-1
			}
		}).fetchAs("list");
	}
   	render() {
         var list = this.props.list || [];
      	return (
         	<div className="testblock">
            	<h3 style={{color:"#aaa"}}>{this.props.title}</h3>
            	<div>
            		{list.map((item,inx)=>{
            			return (
            				<div style={{marginLeft:"2em"}} key={"testblock_item_"+inx}>{item.message} {item.ts}</div>
            			);
            		})}
            	</div>
         	</div>
      	);
   	}
}

export default Connect( TestBlock );
