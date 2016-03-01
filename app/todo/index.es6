import { browserHistory } from "react-router"

import App from "../../lib/application"

import Routes from "./routes"
import Layout from "./layout"

const rkta = new App( Routes, Layout )


if( "hot" in module ){
  rkta.util.attachStyle( require( "./style.styl" ) )
  module.hot.accept( "./style.styl", () => {
    rkta.util.attachStyle( require( "./style.styl" ) )
  })
}

// console.log( rkta )

module.exports = rkta
