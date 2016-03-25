import { createStore, combineReducers, applyMiddleware } from "redux"
import { routerReducer } from "react-router-redux"

import stylus from "./stylus/reducer.stylus"

const getInitialState = process.title === "node" ? require( "./get-initial-state" ) : null

module.exports = {
  getInitialState,
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
