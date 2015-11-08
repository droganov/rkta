"use strict"

// deps
import React from "react";
import ReactDOM from "react-dom";
import { createHistory } from "history";

// components
import adapter from  "../../lib/applicationAdapterClient";
import routes from "./routes";
import { Router } from "react-router";

// append styles
adapter.attachStyle( require("./style.styl") );

// render
adapter.onReady( (ev) => {
	let router = (
		<Router
			history={ createHistory() }
		>
			{ routes }
		</Router>
	);
	ReactDOM.render( router,  document.getElementById("app"));
});
