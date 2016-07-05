import { createStore as createStoreRedux, combineReducers, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';

import stylus from './stylus/reducer.stylus.es6';

const getInitialState = process.title === 'node' ? require('./get-initial-state.es6') : null;

function createStore(initialState) {
  return createStoreRedux(
    combineReducers({
      stylus,
      routing: routerReducer,
    }),
    initialState,
    applyMiddleware(thunk)
  );
}

module.exports = {
  createStore,
  getInitialState,
};
