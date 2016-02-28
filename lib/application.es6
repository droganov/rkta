import React from "react"
import ReactDOM from "react-dom"
import { Router, browserHistory } from "react-router"
import racer from "racer-react"


import util from "./util"

const defautlSettings = {
  mountPoint: "app",
}

export default class Application {
  constructor( Routes, Layout, settings ){
    this.Routes = Routes
    this.Layout = Layout
    this.settings = { ...defautlSettings, ...settings }
    this.util = util

    if( !util.isServer() ) this.startClient( Routes() )
  }
  getDomNode(){
    return document.getElementById( this.settings.mountPoint )
  }
  renderToDOM( routes, racerModel ){
    ReactDOM.render(
      React.createElement(
      	racer.Provider,
      	{ racerModel },
      	React.createElement( Router, {
      		history: browserHistory,
      		routes,
      	})
      ),
      this.getDomNode()
    )
  }
  preRender( routes, location, racerModel, cb ){
    racer.match( { routes, location, racerModel }, cb )
  }
  startClient( routes ){
    console.log( "startClient" )
    util.domReady( ()=> {
      const racerModel = racer.connectClient( this.settings.racerOptions )
      this.preRender( routes, location, racerModel, ( err, redirectLocation, renderProps ) => this.renderToDOM( routes, racerModel ) )
    })
    return this
  }
}
