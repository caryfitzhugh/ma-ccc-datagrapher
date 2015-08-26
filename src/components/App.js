import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as stnActions from '../actions/stnActions';
import StnPanel from './StnPanel';
import { chartDefs } from '../constants/stn';
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
    this.actions = bindActionCreators(stnActions, props.dispatch);
  }

  locationChange(location) {
    let c = location.query.c;
    if (!c) c = ['Temp/stn/maxt/ANN/USH00300042/'];
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
          this.props.dispatch(stnActions.fetchResults(key));
        } else {
          q.push(chartDefs.get(panel.param.chart).toString(panel.param));
        }
      });
      if (allReady && !nextProps.locationValid) {
        this.props.history.pushState(null,BasePath+'?c='+q.join('&c='));
      }
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

