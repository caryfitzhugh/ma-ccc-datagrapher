import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as panelActions from '../actions/panelActions';
import Panel from './Panel';
import { chartDefs } from '../api';
import { BasePath } from 'context';


@connect(state => {
  return { geoms: state.geoms, panels: state.panels.panels, locationValid: state.panels.locationValid }
})
export default class App extends Component {
  static propTypes = {
    panels: PropTypes.instanceOf(Map),
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.actions = bindActionCreators(panelActions, props.dispatch);
  }

  locationChange(location) {
    let c = location.query.c;
    if (!c) return this.props.history.replaceState(null,BasePath+'?c=Temp/stn/maxt/ANN/USH00300042/');
    if (!Array.isArray(c)) c = [c];
    this.actions.changeQueryToParams(c);
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(::this.locationChange);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.geoms != nextProps.geoms || this.props.panels != nextProps.panels) {
      let q = [], allReady = true;
      nextProps.panels.forEach((panel,key) => {
        if (!panel.ready) {
          allReady = false;
          this.props.dispatch(panelActions.fetchResults(key));
        } else {
          q.push(chartDefs.get(panel.param.chart).toString(panel.param));
        }
      });
      if (allReady) {
        this.props.dispatch(panelActions.maybeUpdateURL(this.props.history, q));
      }
    }
  }

  render() {
    const { geoms, panels, dispatch } = this.props;
    const charts = [];
    panels.forEach((p,key) => {
      charts.push(
        <Panel
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

