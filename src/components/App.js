import React, { Component, PropTypes } from 'react';
import { createStore, combineReducers, applyMiddleware, bindActionCreators } from 'redux';
import { provide, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
// import { devTools, persistState } from 'redux-devtools';
// import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

// import DiffMonitor from 'redux-devtools-diff-monitor';

import * as reducers from '../reducers';
import * as stnActions from '../actions/stnActions';
import SidePanel from './SidePanel';
import StnPanel from './StnPanel';
import { chartDefs, parseURL } from '../constants/stn';

import styles from "./App.css";

function loggerMiddleware ({ getState }) {
  return next => action => {
    console.log('action', action)
    console.log('state before', getState())
    const result = next(action);
    console.log('state after', getState());
    return result;
  }
}

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware,
  // devTools(),
  // persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
)(createStore);

const reducer = combineReducers(reducers);

const store = createStoreWithMiddleware(reducer);

function fetchDataForPanels(panels, dispatch) {
  console.log('fetchDataForPanels');
  panels.forEach((panel,key) => {
    if (panel.result.new) {
      dispatch(stnActions.fetchResults(key,panel.param));
    }
  });
}

function updateQueryIfNeeded(panels,query,router) {
  if (!query) { query = [] };
  if (!Array.isArray(query)) { query = [query]; }
  let newQuery = [], dirty = false;
  panels.forEach((panel,key) => {
    const pStr = chartDefs.get(panel.param.chart).toString(panel.param);

    if (query[newQuery.length] != pStr) { dirty = true; }
    newQuery.push(pStr);
  })
  if (dirty || newQuery.length != query.length) {
    console.log('updating history');
    router.transitionTo('/App','c='+newQuery.join('&c='));
  }
}

@provide(store)
@connect(state => {
  return {geoms: state.geoms, panels: state.panels.panels}
})
export default class App extends Component {
  static propTypes = {
    panels: PropTypes.instanceOf(Map),
    dispatch: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.any
  }

  constructor(props, context) {
    super(props, context);
    this.actions = bindActionCreators(stnActions, props.dispatch);
  }

  componentDidMount() {
    this.actions.reconcileQuery(this.props.location.query.c);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.geoms != nextProps.geoms || this.props.panels != nextProps.panels) {
      fetchDataForPanels(nextProps.panels, this.props.dispatch);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if ( this.props.isTransitioning ) {
      this.actions.reconcileQuery(this.props.location.query.c);
    } else {
      updateQueryIfNeeded(this.props.panels, this.props.location.query.c, this.context.router);
    }
  }

  render() {
    const { geoms, panels, dispatch } = this.props;
    const charts = [];
    panels.forEach((p,key) => {
      const geom = geoms[p.param.geom] ? geoms[p.param.geom] : {};
      charts.push((
        <div className={styles.panel} key={key} >
          <SidePanel
            current={p.param.chart}
            index={key}
            actions={this.actions}
          />
          <StnPanel
            params={p.param}
            index={key}
            geom={geom.geojson}
            meta={geom.meta}
            result={p.result}
            update={::this.actions.fetchResults}
          />
        </div>
        ));
    });
    return (
      <div>
        {charts}
      </div>
      );
  }
}

