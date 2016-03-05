import { createStore, combineReducers, applyMiddleware } from "redux"
import { routerReducer } from "react-router-redux"

import stylus from "./stylus/reducer.stylus"

import { serverRequire } from "racer/lib/util"


module.exports = {
  getInitialState: serverRequire( module, "./get-initial-state" ),
  createStore: function( initialState ){
    return createStore(
      combineReducers({
        stylus,
        routing: routerReducer,
      }),
      initialState
    )
  },
}
