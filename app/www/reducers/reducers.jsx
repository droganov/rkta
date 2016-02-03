import { combineReducers, compose } from 'redux';
import { routeReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  routing: routeReducer,
  //app: rootReducer, //you can combine all your other reducers under a single namespace like so
});

module.exports = rootReducer;
