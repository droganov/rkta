"use strict"

// deps
import React from "react"
import ReactDOM from "react-dom"
// import { createHistory, useBeforeUnload } from "history"
import { Router, browserHistory } from "react-router"
import racer from "racer-react"

// components
import * as adapter from  "../../lib/applicationAdapterClient"

import Routes from "./routes"

// webpack styles connect
require("./style.styl");

// const history = useBeforeUnload( createHistory )();

// render
adapter.onReady( (ev) => {
	let appNode = document.getElementById( "app" );
	const racerModel = racer.connectClient();

	// data prefetcing during user site navigation
	browserHistory.listenBefore( ( location, cb ) => {
		if( location.action !== "PUSH" ) return cb();
		racer.match(
			{
				routes,
				location,
				racerModel,
			}, cb );
	});

	// fix scrollop
	browserHistory.listen( location => {
		if( location.action === "PUSH" ) window.scrollTo( 0, 0 );
		// console.log( location );
	});

	// history.listenBeforeUnload( () => {
	// 	return "Are you sure you want to leave this page?";
	// });

	// rendering and hotload
	function renderRoutes() {
		try {
			ReactDOM.unmountComponentAtNode(appNode);
		}catch(e) {}

		const routes = Routes();
		console.log( "piu" );

		racer.match(
			{
				routes,
				location,
				racerModel,
			},
			function( err ){
				if( err ) return console.log( err );
				ReactDOM.render(
					(
						<racer.Provider racerModel={racerModel} >
							<Router
								history={ browserHistory }
								routes={ routes }
							/>
						</racer.Provider>
					),  appNode);
			});
	}

	// render onload
	renderRoutes();

	console.log( module.hot );

	// hot loading
	// if (module.hot) {
	// 	module.hot.accept("./routes", renderRoutes);
	// 	module.hot.accept("./style.styl", function () {
	// 		adapter.attachStyle(require("./style.styl"));
	// 	});
	// 	adapter.attachStyle(require("./style.styl"));
	// }
});
