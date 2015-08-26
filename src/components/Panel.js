import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';

import * as panelActions from '../actions/panelActions';
import SideBar from './SideBar';
import Parameters from './Parameters';
import MiniMap from './MiniMap';
import Chart from './Chart';
import styles from './App.css';

import { chartDefs } from '../api';

class StnPanel extends Component {

  static propTypes = {
    param: PropTypes.object.isRequired,
    result: PropTypes.object,
    loading: PropTypes.bool,
    geom: PropTypes.object,
    insertPanel: PropTypes.func.isRequired,
    deletePanel: PropTypes.func.isRequired,
    invalidateParam: PropTypes.func.isRequired,
  }

  updateParams(newParams) {
    this.props.invalidateParam({ ...this.props.param, ...newParams });
  }

  updateMap(sid, bbox) {
    this.props.invalidateParam({ ...this.props.param, sid });
  }
  
  render () {
    const { chart, geom, element, season, sid, bbox } = this.props.param;
    const { geojson, meta } = this.props.geom;
    const { elems:elements, seasons } = chartDefs.get(chart);

    return (
      <div className={styles.panel} >
        <SideBar
          current={chart}
          updatePanel={::this.updateParams}
          insertPanel={this.props.insertPanel}
          deletePanel={this.props.deletePanel}
        />
        <div className={styles.chart}>
          <div className={styles.chartInput}>
            <Parameters
              className={styles.paramForm}
              geomType={geom}
              meta={meta}
              shownElems={elements}
              shownSeasons={seasons}
              element={element}
              season={season}
              sid={sid}
              update={::this.updateParams}
            />
            <MiniMap
              className={styles.miniMap}
              geomType={geom}
              geoJSON={geojson}
              bbox={bbox}
              sid={sid}
              update={::this.updateMap}
            />
          </div>
          <Chart
            className={styles.chartOutput}
            geomType={geom}
            result={this.props.result}
            meta={meta}
            element={element}
            season={season}
            sid={sid}
            ready={this.props.ready}
          />
        </div>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return state;
}

function mergeProps(stateProps, dispatchProps, parentProps) {
  const idx = parentProps.index, panel = parentProps.panel,
    geom = stateProps.geoms[panel.param.geom] ? stateProps.geoms[panel.param.geom] : {};

  return {
    ...panel,
    geom,
    insertPanel: () => dispatchProps.insertPanel(idx),
    deletePanel: () => dispatchProps.deletePanel(idx),
    invalidateParam: (param) => dispatchProps.invalidateParam(idx,param),
    };
}

export default connect(mapStateToProps, panelActions, mergeProps)(StnPanel);

