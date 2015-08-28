import 'babel-core/polyfill';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createHistory, useQueries } from 'history';

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

var history = useQueries(createHistory)({});

class Main extends Component {

  render () {
    return (
      <div>
        <Provider store={store}>
          {() =>
            <App history={history} />
          }
        </Provider>
        {devtools}
      </div>
    )
  }
}

React.render(<Main />,
  document.getElementById('root')
);


