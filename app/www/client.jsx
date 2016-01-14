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
	var racerModel = racer.connectClient();
	var test = racerModel.query( "test", {
		_id: "e042fa87-8d46-4e5d-8461-378fd23cbeee",
		$orderby: {
			ts:1
		},
		$limit: 3
	});
	test.subscribe( function(err){
		console.log( test.get() );
	});
	const router = (
		<racer.Provider racerModel={racerModel} >
			<Router
				history={ createHistory() }
			>
				{ routes() }
			</Router>
		</racer.Provider>
	);
	ReactDOM.render( router,  document.getElementById("app"));
});
