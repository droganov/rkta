"use strict"

// deps
import React from "react";
import ReactDOM from "react-dom";
import { createHistory, useBeforeUnload } from "history";
import { Router } from "react-router";

// components
import * as adapter from  "../../lib/applicationAdapterClient";
import racer from "racer-react";

// webpack styles connect
require("./style.styl");

var appNode = null;
var routes = null;
var history = useBeforeUnload( createHistory )();

// render
adapter.onReady( (ev) => {
	appNode = document.getElementById("app");
	const racerModel = racer.connectClient();

	var relLocation = null;

	function updateRelLocation (loc) {
		loc = loc || location;
		relLocation = loc.pathname + loc.search;
	}
	updateRelLocation();

	function match( cb ){
		racer
			.match({
				routes: routes,
				location: relLocation,
				racerModel: racerModel,
			},
			cb
		);
	}

	function renderRoutes() {
		try {
			ReactDOM.unmountComponentAtNode(appNode);
		}catch(e) {}

		routes =  require("./routes")();

		match( function( err ){
			if( err ) return console.log( err );
			const router = (
				<racer.Provider racerModel={racerModel} >
					<Router
						history={ history }
						routes={ routes }
					/>
				</racer.Provider>
			);
			ReactDOM.render( router,  appNode);
		});
	}

	// data prefetcing during user site navigation
	history.listenBefore( ( location, cb ) => {
		if( location.action !== "PUSH" ) return cb();
		updateRelLocation(location);
		match( cb );
	});

	// fix scrollop
	history.listen( location => {
		if( location.action === "PUSH" ) window.scrollTo(0, 0);
	});

	history.listenBeforeUnload( () => {
		// do something sync
		// then return nothing
		return;

		// or warining
		return "Are you sure you want to leave this page?";
	});

	// render onload
	renderRoutes();

	// hot loading
	if (module.hot) {
		module.hot.accept("./routes", renderRoutes);
		module.hot.accept("./style.styl", function () {
			adapter.attachStyle(require("./style.styl"));
		});
		adapter.attachStyle(require("./style.styl"));
	}
});
