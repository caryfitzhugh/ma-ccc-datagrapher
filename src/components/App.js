import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as panelActions from '../actions/panelActions';
import Panel from './Panel';
let Modal = require('react-modal');
import InfoModal from './InfoModal';
import { chartDefs } from '../api';


@connect(state => {
  return { geoms: state.geoms,
    panels: state.panels.panels,
    locationValid: state.panels.locationValid,
    hoverYear: state.panels.hoverYear,
    showInfo: state.panels.showInfo,
  }
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
    if (!c) return this.props.history.pushState(null,window.location.pathname+'?c=Temp/state/maxt/ANN/NY/');
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
    const { geoms, panels, hoverYear, showInfo, dispatch } = this.props;
    const charts = [];
    const canDelete = panels.size > 1;
    panels.forEach((p,key) => {
      charts.push(
        <Panel
          key={key}
          index={key}
          panel={p}
          canDelete={canDelete}
          year={hoverYear}
        />
      );
    });
    return (
      <div>
        {charts}
        <Modal
          closeTimeoutMS={150}
          onRequestClose={this.actions.showInfo}
          isOpen={showInfo}>
          <button onClick={this.actions.showInfo}>close</button>
          <InfoModal />
          <button onClick={this.actions.showInfo}>close</button>
        </Modal>
      </div>
      );
  }
}
