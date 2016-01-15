"use strict"

import React, { Component } from "react";
import { Link } from "react-router";

var testblock = React.createClass({
	getInitialState: function () {
		return {
			list: [
				"foo",
				"bar",
				"neck"
			]
		}
	},
	render: function () {
		return (
			<ul>
				{this.state.list.map((item,inx)=>{
					return (
						<li key={"li_"+inx}>{item}</li>
					);
				})}
			</ul>
		);
	}
});
export default testblock;
