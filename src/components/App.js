import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as stnActions from '../actions/stnActions';
import StnPanel from './StnPanel';
import { chartDefs } from '../constants/stn';


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
      charts.push(
        <StnPanel
          key={key}
          index={key}
          panel={p}
        />
      );
    });
    return (
      <div>
        {charts}
      </div>
      );
  }
}

