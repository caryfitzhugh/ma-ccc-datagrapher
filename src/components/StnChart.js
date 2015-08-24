import React, { PropTypes } from 'react';
import {ScatterPlot, LinePlot} from 'react-d3-components';
import {seasons,elems} from '../constants/stn';


export default class StnChart {

  static propTypes = {
    meta: PropTypes.object,
    geomType: PropTypes.string.isRequired,
    sid: PropTypes.string.isRequired,
    element: PropTypes.string.isRequired,
    season: PropTypes.string.isRequired,
    result: PropTypes.object.isRequired,
    ready: PropTypes.bool.isRequired
  };

  render() {
    console.log('StnChart render');
    const { meta, geomType, sid, element, season, result, ready } = this.props;
    const { label:titleElem, ttUnits } = elems.get(element),
          titleSeason = seasons.get(season).title,
          stationName = meta && meta.has(sid) ? meta.get(sid).name : 'loading';
    let chart = <svg width={600} height={400} />;
    const data = [];
    if (ready && result.data) {
      if (geomType == 'stn') {
        result.data.forEach((d) => {
          if (d[1] != 'M') data.push([+(d[0].slice(0,4)), d[1] == 'T' ? 0.0 : +d[1]]);
        })
      } else {
        result.data.forEach((d) => {
          const v = d[1][sid];
          if (!!v && v == v) data.push([+(d[0].slice(0,4)), +v.toFixed(2)]);
        })
      }
    }
    if (data.length > 1){
      let xAccessor = (row) => (row[0]),
          xAxis = {label:'Year',tickFormat: (t) => {return ''+t;}},
          yAccessor = (row) => (row[1]),
          gdata = [{label:'MinT',values: data}];

      let toolTip = (x,y) => {
        return ''+x+': '+y+ttUnits;
      };

      chart = <ScatterPlot
        data={gdata}
        width={600}
        height={400}
        margin={{top: 10, bottom: 50, left: 50, right: 10}}
        x={xAccessor}
        xAxis={xAxis}
        y={yAccessor}
        // yAxis={{label:'Temperature'}}
        tooltipHtml={toolTip}
        />;
    }

    return <div>
      <h3 style={{textAlign: 'center'}}>{titleSeason + ' ' + titleElem}</h3>
      <h4 style={{textAlign: 'center'}}>{stationName}</h4>
      {chart}
      </div>
  }
};

