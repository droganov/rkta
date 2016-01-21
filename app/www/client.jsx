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
	const racerModel = racer.connect();
	var $test = racerModel.query("test", {
		$orderby:{
			ts: -1
		},
		$limit: 2
	});
	$test.subscribe( function(){
		console.log( $test.get() );
	});
	// racerModel.add("test",{ts:Date.now()});
	const router = (
		<Router
			history={ createHistory() }
		>
			{ routes() }
		</Router>
	);
	ReactDOM.render( router,  document.getElementById("app"));
});
