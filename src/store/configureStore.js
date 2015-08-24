import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import loggerMiddleware from 'redux-logger';

import * as reducers from '../reducers';

let finalCreateStore;
if (__DEV__) {
  finalCreateStore = compose(
    applyMiddleware(thunk),
    applyMiddleware(loggerMiddleware),
    require('redux-devtools').devTools(),
    createStore
  );
} else {
  finalCreateStore = compose(
    applyMiddleware(thunk),
    createStore
  );
}

const reducer = combineReducers(reducers);

export default function configureStore(initialState) {
  return finalCreateStore(reducer, initialState);
}
