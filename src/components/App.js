import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as stnActions from '../actions/stnActions';
import StnPanel from './StnPanel';
import { chartDefs } from '../constants/stn';
import { BasePath } from 'context';


function fetchDataForPanels(panels, dispatch) {
  console.log('fetchDataForPanels');
  panels.forEach((panel,key) => {
    if (!panel.ready) {
      dispatch(stnActions.fetchResults(key));
    }
  });
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
    this.query = [];
  }

  locationChange(location) {
    let c = location.query.c;
    if (!c) {
      this.actions.changeQueryToParams(['Temp/stn/maxt/ANN/USH00304174/']);
      return;
    }
    if (!Array.isArray(c)) c = [c];
    if (this.query.length == c.length && this.query.every((p,i) => (p == c[i]))) return;
    this.actions.changeQueryToParams(c);
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
    const panels = this.props.panels;
    let q = [], ready = true, dirty = false;
    panels.forEach((panel,key) => {if (!panel.ready) ready = false;});
    if (!ready) return;
    
    panels.forEach((panel,key) => {
      q.push(chartDefs.get(panel.param.chart).toString(panel.param));
    });
    if (q.length == this.query.length && this.query.every((p,i) => (p == q[i]))) return;
    console.log('updating history');
    this.query = q;
    this.props.history.pushState(null,BasePath+'?c='+q.join('&c='));
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

