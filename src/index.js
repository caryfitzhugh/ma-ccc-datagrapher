import 'babel-core/polyfill';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createHistory, useQueries } from 'history';

import configureStore from './store/configureStore';
import App from './components/App';

const store = configureStore();

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
      </div>
    )
  }
}

ReactDOM.render(<Main />,
  document.getElementById('root')
);


