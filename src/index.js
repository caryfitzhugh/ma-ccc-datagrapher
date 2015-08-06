import React from 'react';
import { Router, Route, Redirect } from 'react-router';
import { history } from 'react-router/lib/BrowserHistory';

import App from './components/App';

class Main extends React.Component {

  render () {
    console.log('Main: render');
    return (
      <Router history={history}>
        <Redirect from='/' to='/App?c=StnTemp/maxt/ANN/USH00300042/' />
        <Route path='/App' component={App}>
        </Route>
      </Router>
    )
  }
}

console.log('index.js');

React.render(<Main />, document.getElementById('root'));


