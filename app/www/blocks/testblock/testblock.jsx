"use strict"

import React, { Component } from "react";
import { Link } from "react-router";
import { Connect } from "racer-react";

var testblock = React.createClass({
	getInitialState: function () {
		return {};
	},
	componentDidMount: function () {
    	this.props.racerQuery( "test", {
	        $orderby:{
	          ts: -1,
	        },
	        $limit: this.props.limit || 1
	    }).subscribeAs( "list" );
	},
	render: function () {
		let list = this.props.list || [];
		return (
			<div>
				<h2>{this.props.title || "without title"}</h2>
				<ul>
					{list.map((item,inx)=>{
						return (
							<li key={"li_"+inx}>{item.message} {item.ts}</li>
						);
					})}
				</ul>
			</div>
		);
	}
});

export default Connect( testblock );
