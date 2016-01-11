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
	// const test = racerModel.query("test");
	// test.subscribe( function(){
	// 	console.log( "arguments" );
	// });
	console.log( racerModel.connection.state );
	racerModel.add("test", {
		ts: Date.now()
	})
	const router = (
		<Router
			history={ createHistory() }
		>
			{ routes() }
		</Router>
	);
	ReactDOM.render( router,  document.getElementById("app"));
});
