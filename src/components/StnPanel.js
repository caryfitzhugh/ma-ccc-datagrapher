import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';

import * as stnActions from '../actions/stnActions';
import SidePanel from './SidePanel';
import StnParameters from './StnParameters';
import MiniMap from './MiniMap';
import StnChart from './StnChart';
import styles from './App.css';

import { chartDefs } from '../constants/stn';

class StnPanel extends Component {

  static propTypes = {
    param: PropTypes.object.isRequired,
    result: PropTypes.object,
    geom: PropTypes.object,
    setChartType: PropTypes.func.isRequired,
    insertPanel: PropTypes.func.isRequired,
    deletePanel: PropTypes.func.isRequired,
    fetchResults: PropTypes.func.isRequired
  }

  updateParams(newParams) {
    this.props.fetchResults({ ...this.props.param, ...newParams });
  }

  updateMap(sid, bbox) {
    this.props.fetchResults({ ...this.props.param, sid });
  }
  
  render () {
    const { chart, geom, element, season, sid, bbox } = this.props.param;
    const { geojson, meta } = this.props.geom;
    const { elems:elements, seasons } = chartDefs.get(chart);

    return (
      <div className={styles.panel} >
        <SidePanel
          current={chart}
          setChartType={this.props.setChartType}
          insertPanel={this.props.insertPanel}
          deletePanel={this.props.deletePanel}
        />
        <div className={styles.chart}>
          <div className={styles.chartInput}>
            <StnParameters
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
          <StnChart
            className={styles.chartOutput}
            geomType={geom}
            result={this.props.result}
            meta={meta}
            element={element}
            season={season}
            sid={sid}
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
    setChartType: (chart) => dispatchProps.setChartType(idx, chart),
    insertPanel: () => dispatchProps.insertPanel(idx),
    deletePanel: () => dispatchProps.deletePanel(idx),
    fetchResults: (param) => dispatchProps.fetchResults(idx, param),
    };
}

export default connect(mapStateToProps, stnActions, mergeProps)(StnPanel);

