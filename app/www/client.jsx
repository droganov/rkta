"use strict"

// deps
import React from "react";
import ReactDOM from "react-dom";
import { createHistory, useBeforeUnload } from "history";
import { Router } from "react-router";

// components
import * as adapter from  "../../lib/applicationAdapterClient";
import routesFunc from "./routes";

import racer from "racer-react";

// append styles
adapter.attachStyle( require("./style.styl") );

// render
adapter.onReady( (ev) => {
	const racerModel = racer.connectClient();
	const history = useBeforeUnload( createHistory )();
	const relLocation = location.pathname + location.search;
	const routes = routesFunc();

	// var test = racerModel.query( "test", {
	// 	_id: "e042fa87-8d46-4e5d-8461-378fd23cbeee",
	// 	$orderby: {
	// 		ts:1
	// 	},
	// 	$limit: 3
	// });
	// test.subscribe( function(err){
	// 	console.log( test.get() );
	// });

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

	// data prefetcing during user site navigation
	history.listenBefore( ( location, cb ) => {
		if( location.action !== "PUSH" ) return cb();
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

	match( function( err ){
		if( err ) return console.log( err );
		const router = <racer.Provider racerModel={racerModel} >
			<Router
				history={ history }
			>
				{ routes }
			</Router>
		</racer.Provider>
		ReactDOM.render( router,  document.getElementById("app"));
	})

});
