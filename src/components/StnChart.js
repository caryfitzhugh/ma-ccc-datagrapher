import React, { PropTypes } from 'react';
import {ScatterPlot, LinePlot} from 'react-d3-components';
import {seasons,elems} from '../constants/stn';

export default class StnChart {

  static propTypes = {
    stations: PropTypes.object.isRequired,
    sid: PropTypes.string.isRequired,
    element: PropTypes.string.isRequired,
    season: PropTypes.string.isRequired,
    result: PropTypes.object.isRequired
  };

  render() {
    // console.log('StnChart render');
    const { stations, sid, element, season, result } = this.props;
    const { label:titleElem, ttUnits } = elems.get(element),
          titleSeason = seasons.get(season),
          stationName = stations.get(sid).name;
    let chart;
    if (result && result.data) {
      const rawdata = result.data;
      let xAccessor = (row) => { return +(row[0].slice(0,4)); },
          xAxis = {label:'Year',tickFormat: (t) => {return ''+t;}},
          yAccessor = (row) => {
            if (row[1] == 'T') {
              return 0.0;
            } else {
              return +row[1];
            }
          },
          data = [{label:'MinT',values:rawdata.filter((d)=>{return d[1] != 'M';})}];

      let toolTip = (x,y) => {
        return ''+x+': '+y+ttUnits;
      };

      chart = <ScatterPlot
        data={data}
        width={600}
        height={400}
        margin={{top: 10, bottom: 50, left: 50, right: 10}}
        x={xAccessor}
        xAxis={xAxis}
        y={yAccessor}
        // yAxis={{label:'Temperature'}}
        tooltipHtml={toolTip}
        />;
    } else {
      chart = <svg width={600} height={400} />;
    }
    return <div>
      <h3 style={{textAlign: 'center'}}>{titleSeason + ' ' + titleElem}</h3>
      <h4 style={{textAlign: 'center'}}>{stationName}</h4>
      {chart}
      </div>
  }
};

