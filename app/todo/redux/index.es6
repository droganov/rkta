import { createStore, combineReducers, applyMiddleware } from "redux"
import { routerReducer } from "react-router-redux"

import stylus from "./stylus/reducer.stylus"

// const racer = require( "racer/lib/util" )

// можно зайти через окружение: https://www.youtube.com/watch?v=ZLrzAhhbt6s&index=9&list=PLDyvV36pndZHfBThhg4Z0822EEG9VGenn
// uglify должен будет вырезать неиспользуемое

// import { serverRequire } from "racer/lib/util"

module.exports = {
  getInitialState: function(){ return {} },
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
