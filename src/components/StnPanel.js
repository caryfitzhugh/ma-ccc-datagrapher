import React, { PropTypes } from 'react'

import StnParameters from './StnParameters';
import MiniMap from './MiniMap';
import StnChart from './StnChart';
import styles from './App.css';
const hcnstns = require('../hcnstns.json');

import { chartDefs } from '../constants/stn';

export default class StnPanel extends React.Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    geoms: PropTypes.object.isRequired,
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
    const {chart, element, season, sid, bbox} = this.props.params;
    const { elems:elements, seasons } = chartDefs.get(chart);

    return (
      <div className={styles.chart}>
        <div className={styles.chartInput}>
          <StnParameters
            className={styles.paramForm}
            stations={this.props.geoms.hcnstns}
            shownStns={this.props.geoms.shownStns}
            shownElems={elements}
            shownSeasons={seasons}
            element={element}
            season={season}
            sid={sid}
            update={::this.updateParams}
          />
          <MiniMap
            className={styles.miniMap}
            geom={ hcnstns }
            bbox={ bbox }
            sid={ sid }
            update={::this.updateMap}
          />
        </div>
        <StnChart
          className={styles.chartOutput}
          result={this.props.result}
          stations={this.props.geoms.hcnstns}
          element={element}
          season={season}
          sid={sid}
        />
      </div>
    )
  }
}

