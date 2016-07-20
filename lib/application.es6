import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { Router, browserHistory } from "react-router"
import { syncHistoryWithStore } from "react-router-redux"
import racer from "racer-react"


import util from "./util"

const defautlSettings = {
  mountPoint: "app",
}

export default class Application {
  constructor( Routes, Layout, redux, settings ){
    this.Routes = Routes
    this.Layout = Layout
    this.redux = redux
    this.settings = { ...defautlSettings, ...settings }
    this.util = util

    if( !util.isServer() ) this.startClient( Routes() )
  }
  getDomNode(){
    return document.getElementById( this.settings.mountPoint )
  }
  getBundleData(){
    const bundleData = document.getElementById( "bundle" )
    const racerBundle = JSON.parse( bundleData.getAttribute("data-racer-bundle") )
    const reduxStore = JSON.parse( bundleData.getAttribute("data-redux-state") )
    return { racerBundle, reduxStore, }
  }
  renderToDOM( routes, racerModel, reduxState ){
    const store = this.redux.configureStore( reduxState )
    const history = syncHistoryWithStore( browserHistory, store )
    ReactDOM.render(
      React.createElement(
      	Provider,
      	{ store },
        React.createElement(
        	racer.Provider,
        	{ racerModel },
        	React.createElement( Router, {
        		history,
        		routes,
        	})
        )
      ),
      this.getDomNode()
    )
  }
  preRender( routes, location, racerModel, reduxStore, cb ){
    racer.match( { routes, location, racerModel, reduxStore }, cb )
  }
  startClient( routes ){
    util.domReady( ()=> {
      const { racerBundle, reduxStore } = this.getBundleData()
      const racerModel = racer.connectClient( racerBundle, this.settings.racerOptions )
      this.preRender( routes, location, racerModel, reduxStore, ( err, redirectLocation, renderProps ) => this.renderToDOM( routes, racerModel, reduxStore ) )
    })
    return this
  }
}
