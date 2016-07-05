import { createStore, combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import stylus from './stylus/reducer.stylus.es6';

const getInitialState = process.title === 'node' ? require('./get-initial-state.es6') : null;

module.exports = {
  getInitialState,
  createStore: (initialState) =>
    createStore(
      combineReducers({
        stylus,
        routing: routerReducer,
      }),
      initialState
    ),
};
