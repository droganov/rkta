"use strict"

// deps
import React from "react";
import ReactDOM from "react-dom";
import { createHistory } from "history";
import { Router } from "react-router";

// components
import * as adapter from  "../../lib/applicationAdapterClient";
import routes from "./routes";

import racer from "../../tmp/racer-react";

// append styles
adapter.attachStyle( require("./style.styl") );

// render
adapter.onReady( (ev) => {
	var racerModel = racer.connect();
	racerModel.on("change", "$connection.state", (newValue, prevValue)=> {
		console.log("new connection state is - ", newValue);
	});

	var test = racerModel.query("test", {
		$query: {},
		$orderby: {
			ts:-1
		},
		$limit: 3
	});
	test.subscribe( function(err){
		console.log(test.get());
	});
	const router = (
		<Router
			history={ createHistory() }
		>
			{ routes() }
		</Router>
	);
	ReactDOM.render( router,  document.getElementById("app"));
});
