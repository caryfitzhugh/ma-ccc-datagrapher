import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';

import * as panelActions from '../actions/panelActions';
import SideBar from './SideBar';
import Parameters from './Parameters';
import MiniMap from './MiniMap';
import Chart from './SChart';
import AreaChart from './NChart';
import styles from './App.css';

import { chartDefs } from '../api';

class StnPanel extends Component {

  static propTypes = {
    param: PropTypes.object.isRequired,
    result: PropTypes.object,
    geom: PropTypes.object,
    showInfo: PropTypes.func.isRequired,
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
    const { chart, geom, element, season, sid, bbox } = this.props.param,
          { geojson, meta } = this.props.geom, cDef = chartDefs.get(chart),
          seasons = element == 'grow_32' ? ['ANN'] : cDef.seasons, 
          elements = geom == 'stn' ? cDef.elems : cDef.gElems;

    let plot;
    if (geom == 'stn')
      plot = <Chart
              className={styles.chartOutput}
              geomType={geom}
              result={this.props.result}
              meta={meta}
              element={element}
              season={season}
              sid={sid}
              ready={this.props.ready}
            />
    else 
      plot = <AreaChart
              className={styles.chartOutput}
              geomType={geom}
              result={this.props.result}
              meta={meta}
              element={element}
              season={season}
              sid={sid}
              ready={this.props.ready}
            />

    return (
      <div className={styles.panel} >
        <SideBar
          current={chart}
          updatePanel={::this.updateParams}
          showInfo={this.props.showInfo}
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
          {plot}
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
    showInfo: () => dispatchProps.showInfo(),
    insertPanel: () => dispatchProps.insertPanel(idx),
    deletePanel: () => dispatchProps.deletePanel(idx),
    invalidateParam: (param) => dispatchProps.invalidateParam(idx,param),
    };
}

export default connect(mapStateToProps, panelActions, mergeProps)(StnPanel);

