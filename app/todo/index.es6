import { browserHistory } from "react-router"

import App from "../../lib/application"

import Routes from "./routes"
import Layout from "./layout"

import styles from "./style.styl"

const rkta = new App( Routes, Layout )

// if( "hot" in module ){}

module.exports = rkta
