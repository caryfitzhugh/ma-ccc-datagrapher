import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as stnActions from '../actions/stnActions';
import StnPanel from './StnPanel';
import { chartDefs } from '../constants/stn';


function fetchDataForPanels(panels, dispatch) {
  console.log('fetchDataForPanels');
  panels.forEach((panel,key) => {
    if (!panel.ready) {
      dispatch(stnActions.fetchResults(key));
    }
  });
}

function updateQueryIfNeeded(panels,query,history) {
  if (!query) { query = [] };
  if (!Array.isArray(query)) { query = [query]; }
  let newQuery = [], ready = true, dirty = false;
  panels.forEach((panel,key) => {if (!panel.ready) ready = false;});
  if (!ready) return;
  
  panels.forEach((panel,key) => {
    const pStr = chartDefs.get(panel.param.chart).toString(panel.param);

    if (query[newQuery.length] != pStr) { dirty = true; }
    newQuery.push(pStr);
  })
  if (dirty || newQuery.length != query.length) {
    console.log('updating history');
    history.replaceState(null,'/?c='+newQuery.join('&c='));
    // router.transitionTo('/App','c='+newQuery.join('&c='));
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

  constructor(props, context) {
    super(props, context);
    this.actions = bindActionCreators(stnActions, props.dispatch);
  }

  locationChange(location) {
    this.actions.reconcileQuery(location.query.c);
    this.query = location.query.c;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(::this.locationChange);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.geoms != nextProps.geoms || this.props.panels != nextProps.panels) {
      fetchDataForPanels(nextProps.panels, this.props.dispatch);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    updateQueryIfNeeded(this.props.panels, this.query, this.props.history);
    // if ( this.props.isTransitioning ) {
    //   this.actions.reconcileQuery(this.props.location.query.c);
    // } else {
    //   updateQueryIfNeeded(this.props.panels, this.props.location.query.c);
    // }
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

