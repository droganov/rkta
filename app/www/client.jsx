"use strict"

// deps
import React from "react";
import ReactDOM from "react-dom";
import { createHistory } from "history";
import { Router } from "react-router";

// components
import * as adapter from  "../../lib/applicationAdapterClient";
import routes from "./routes";

// append styles
adapter.attachStyle( require("./style.styl") );

// render
adapter.onReady( (ev) => {
	const router = (
		<Router
			history={ createHistory() }
		>
			{ routes() }
		</Router>
	);
	ReactDOM.render( router,  document.getElementById("app"));
});
