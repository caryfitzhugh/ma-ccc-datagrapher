import React, { PropTypes } from 'react';
import {ScatterPlot, LinePlot} from 'react-d3-components';
import {seasons,elems} from '../constants/stn';

export default class StnChart {

  static propTypes = {
    station: PropTypes.object.isRequired,
  };

  render() {
    console.log('StnChart render');
    const s = this.props.station;
    const params = this.props.params,
          elemLabel = elems.get(params.element).label,
          seasonLabel = seasons.get(params.season),
          stationName = s.stations.get(params.sid).name;
    let chart;
    if (s.results && s.results.data) {
      const rawdata = s.results.data;
      let xAccessor = (row) => { return +(row[0].slice(0,4)); },
          xAxis = {label:"Year",tickFormat: (t) => {return ""+t;}},
          yAccessor = (row) => {
            if (row[1] == "T") {
              return 0.0;
            } else {
              return +row[1];
            }
          },
          data = [{label:"MinT",values:rawdata.filter((d)=>{return d[1] != 'M';})}];

      let toolTip = (x,y) => {
        return ""+x+": "+y+'"';
      };

      chart = <ScatterPlot
        data={data}
        width={600}
        height={400}
        margin={{top: 10, bottom: 50, left: 50, right: 10}}
        x={xAccessor}
        xAxis={xAxis}
        y={yAccessor}
        // yAxis={{label:"Temperature"}}
        tooltipHtml={toolTip}
        />;
    } else {
      chart = <svg width={600} height={400} />;
    }
    return <div>
      <h3 style={{textAlign: "center"}}>{seasonLabel + ' ' + elemLabel}</h3>
      <h4 style={{textAlign: "center"}}>{stationName}</h4>
      {chart}
      </div>
  }
};

