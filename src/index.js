import 'babel-core/polyfill';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Redirect } from 'react-router';
import BrowserHistory from 'react-router/lib/BrowserHistory';

import configureStore from './store/configureStore';
import App from './components/App';

const store = configureStore();

let devtools = null
if (__DEV__) {
  const {DevTools, DebugPanel, LogMonitor} = require('redux-devtools/react')

  devtools = (
    <DebugPanel top right bottom>
      <DevTools store={store}
                monitor={LogMonitor} />
    </DebugPanel>
  )
}

class Main extends Component {

  render () {
    return (
      <div>
        <Provider store={store}>
          {() =>
            <Router history={this.props.history}>
              <Redirect from='/' to='/App?c=Temp/stn/maxt/ANN/USH00300042/' />
              <Route path='/App' component={App}>
              </Route>
            </Router>
          }
        </Provider>
        {devtools}
      </div>
    )
  }
}

React.render(<Main history={new BrowserHistory()} />,
  document.getElementById('root')
);


