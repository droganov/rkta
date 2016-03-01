import { browserHistory } from "react-router"

import App from "../../lib/application"

import Routes from "./routes"
import Layout from "./layout"

import styles from "./style"

const rkta = new App( Routes, Layout )

if( "hot" in module ){
  // console.log( styles )
  // console.log( styles.toString() )
  // rkta.util.attachStyle( styles )
  module.hot.accept( "./style.styl", () => {
    rkta.util.attachStyle( require( "./style.styl" ) )
  })
}

module.exports = rkta
