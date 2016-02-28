import { browserHistory } from "react-router"

import App from "../../lib/application"

// import style from "./style.styl"
import Routes from "./routes"
import Layout from "./layout"

const rkta = new App( Routes, Layout )

if( "hot" in module ){
  rkta.util.attachStyle( require( "./style.styl" ) )
}

module.exports = rkta
