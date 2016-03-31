import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';

import * as panelActions from '../actions/panelActions';
import Parameters from './Parameters';
import MiniMap from './MiniMap';
import StationChart from './SChart';
import AreaChart from './NChart';
import styles from './App.css';

import { chartDefs } from '../api';

class StnPanel extends Component {

  static propTypes = {
    param: PropTypes.object.isRequired,
    result: PropTypes.object,
    geom: PropTypes.object,
    year: PropTypes.number.isRequired,
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
      plot = <StationChart
              className={styles.chartOutput}
              geomType={geom}
              result={this.props.result}
              meta={meta}
              element={element}
              season={season}
              sid={sid}
              ready={this.props.ready}
              showInfo={this.props.showInfo}
              year={this.props.year}
              setYear={this.props.setYear}
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
              showInfo={this.props.showInfo}
              year={this.props.year}
              setYear={this.props.setYear}
            />

    return (
      <div className={styles.panel} >
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
            <div className={styles.addDelPanels}>
              <button onClick={this.props.insertPanel} >Add Chart</button>
              {this.props.canDelete ? <button onClick={this.props.deletePanel} >Remove this Chart</button> : null}
            </div>
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
  const idx = parentProps.index, 
    panel = parentProps.panel,
    canDelete = parentProps.canDelete,
    year = parentProps.year,
    geom = stateProps.geoms[panel.param.geom] ? stateProps.geoms[panel.param.geom] : {};

  return {
    ...panel,
    geom,
    year,
    canDelete,
    showInfo: () => dispatchProps.showInfo(),
    insertPanel: () => dispatchProps.insertPanel(idx),
    deletePanel: () => dispatchProps.deletePanel(idx),
    invalidateParam: (param) => dispatchProps.invalidateParam(idx,param),
    setYear: (year) => dispatchProps.setYear(year),
    };
}

export default connect(mapStateToProps, panelActions, mergeProps)(StnPanel);

