import { history } from 'react-router/lib/BrowserHistory';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from './logger';
import { Provider } from 'react-redux';
// import { batchedUpdates } from 'redux-batched-updates';
import React from 'react';
//import ReactDOM from 'react-dom';
import { Router, Route, Redirect } from 'react-router';

// import devTools from 'redux-devtools/index';
// import DebugPanel from 'redux-devtools/DebugPanel';
// import ReduxMonitor from 'redux-devtools/ReduxMonitor';
import * as reducers from './reducers';

import App from './components/App';
import StnTemp from './components/StnTemp';
// import StnPrcp from './components/StnPrcp';

const reducer = combineReducers(reducers);
const finalCreateStore = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware
)(createStore)
const store = finalCreateStore(reducer, {})

class Main extends React.Component {

  render () {
    console.log('Main: render');
    return (
      <Provider store={store}>
        {renderRoutes.bind(null, history)}
      </Provider>
    )
  }
}

console.log('index.js');

function renderRoutes (history) {
  console.log('renderRoutes');
  return (
    <Router history={history}>
      <Route component={App}>
        <Redirect from='/' to='/StnTemp/maxt/ANN/USH00300042' />
        <Route path='StnTemp/:element/:season/:sid' component={StnTemp} />
        <Route path='StnTemp/:element' component={StnTemp} />
        <Route path='StnPrcp/:element/:season/:sid' component={StnTemp} />
        <Route path='StnPrcp/:element' component={StnTemp} />
      </Route>
    </Router>
  )
}

React.render(<Main />, document.getElementById('root'));


