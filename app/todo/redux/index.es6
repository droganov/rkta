import { createStore, combineReducers, applyMiddleware } from "redux"
import { routerReducer } from "react-router-redux"

import stylus from "./stylus/reducer.stylus"

export default function( initialState ){
  return createStore(
    combineReducers({
      stylus,
      routing: routerReducer,
    }),
    initialState
  )
}
