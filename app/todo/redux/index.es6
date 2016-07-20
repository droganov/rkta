import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import reduxLogger from 'redux-logger';

import stylus from './stylus/reducer.stylus.es6';

const getInitialState = process.title === 'node' ? require('./get-initial-state.es6') : null;

const middleware = [thunk];
if (console.group && (process.env.NODE_ENV !== 'production')) {
  middleware.push(reduxLogger());
}

function configureStore(initialState) {
  return createStore(
    combineReducers({
      stylus,
      routing: routerReducer,
    }),
    initialState,
    applyMiddleware(...middleware)
  );
}

module.exports = {
  configureStore,
  getInitialState,
};
