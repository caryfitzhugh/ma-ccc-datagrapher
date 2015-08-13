import React, { PropTypes } from 'react'

import StnParameters from './StnParameters';
import MiniMap from './MiniMap';
import StnChart from './StnChart';
import styles from './App.css';

import { chartDefs } from '../constants/stn';

export default class StnPanel extends React.Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    geom: PropTypes.object,
    meta: PropTypes.object,
    result: PropTypes.object,
    update: PropTypes.func.isRequired
  }

  updateParams(newParams) {
    this.props.update(this.props.index,{ ...this.props.params, ...newParams });
  }

  updateMap(sid, bbox) {
    this.props.update(this.props.index,{ ...this.props.params, sid });
  }
  
  render () {
    const {chart, geom, element, season, sid, bbox} = this.props.params;
    const geomMeta = this.props.meta;
    const geoJSON = this.props.geom;
    const { elems:elements, seasons } = chartDefs.get(chart);

    return (
      <div className={styles.chart}>
        <div className={styles.chartInput}>
          <StnParameters
            className={styles.paramForm}
            geomType={geom}
            meta={geomMeta}
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
            geoJSON={geoJSON}
            bbox={bbox}
            sid={sid}
            update={::this.updateMap}
          />
        </div>
        <StnChart
          className={styles.chartOutput}
          geomType={geom}
          result={this.props.result}
          meta={geomMeta}
          element={element}
          season={season}
          sid={sid}
        />
      </div>
    )
  }
}

