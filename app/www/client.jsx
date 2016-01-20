"use strict"

// deps
import React from "react";
import ReactDOM from "react-dom";
import { createHistory } from "history";
import { Router } from "react-router";

// components
import * as adapter from  "../../lib/applicationAdapterClient";

// webpack styles connect
require("./style.styl");

var appNode = null;
var routes = null;
var history = createHistory();

var renderRoutes = function () {
	try {
		ReactDOM.unmountComponentAtNode(appNode);
	}catch(e) {}
	routes =  require("./routes");
	const router = (
		<Router
			history={ history }
			routes={ routes() }
		/>
	);
	ReactDOM.render( router,  appNode);
}

// hot loading
if (module.hot) {
	module.hot.accept(renderRoutes);
	module.hot.accept("./style.styl", function () {
		adapter.attachStyle(require("./style.styl"));
	});
	adapter.attachStyle(require("./style.styl"));
}

// render
adapter.onReady(()=>{
	appNode = document.getElementById("app");
	renderRoutes();
});
