"use strict"

// deps
import React from "react";
import ReactDOM from "react-dom";
import { createHistory } from "history";
import { Router } from "react-router";

// components
import * as adapter from  "../../lib/applicationAdapterClient";

var appNode = null;
var routes = null;
var history = createHistory();

// append styles
require("./style.styl")

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

	// костыль автообновления, не ждет формирования нового файла со стилями
	const links = document.getElementsByTagName( "link" );
	for (var i = 0; i < links.length; i++) {
		var link = links[i];
		if(link.rel=="stylesheet") {
			link.href = link.href.replace(/\?\d+$/,"?"+Date.now())
			break;
		}
	};
}

// hot loading
if (module.hot) {
	module.hot.accept(renderRoutes);
}

// render
adapter.onReady(()=>{
	appNode = document.getElementById("app");
	renderRoutes();
});
