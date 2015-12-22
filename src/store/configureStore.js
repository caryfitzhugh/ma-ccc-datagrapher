import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import loggerMiddleware from 'redux-logger';

import * as reducers from '../reducers';

const finalCreateStore = compose(
  applyMiddleware(thunk),
  createStore
);

const reducer = combineReducers(reducers);

export default function configureStore(initialState) {
  return finalCreateStore(reducer, initialState);
}
