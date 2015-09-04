import React, { PropTypes } from 'react';
import d3 from 'd3';
import {ScatterPlot, LinePlot} from 'react-d3-components';
import {seasons,elems} from '../api';


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
    let chart = <svg width={600} height={400} >
                  <text x="50%" y="50%"
                    alignmentBaseline="middle"
                    textAnchor="middle"
                    fontSize="150%">
                    Loading…
                  </text>
                </svg>;

    const data = [];
    if (ready && result.data) {
      if (geomType == 'stn') {
        result.data.forEach((d) => {
          if (d[1] != 'M') data.push([+(d[0].slice(0,4)), d[1] == 'T' ? 0.0 : +d[1]]);
        })
      } else {
        result.data.forEach((d) => {
          const v = d[1][sid];
          if (typeof v != 'undefined' && v == v) data.push([+(d[0].slice(0,4)), +v.toFixed(2)]);
        })
      }
    }
    if (data.length > 1){
      const xAccessor = (row) => (row[0]),
          xAxis = {label:'Year',tickFormat: (t) => {return ''+t;}},
          yAccessor = (row) => (row[1]),
          gdata = [{label:'MinT',values: data}];

      const toolTip = (x,y) => {
        return ''+x+': '+y+ttUnits;
      };
      const innerHeight = 400-10-50; //FIXME -- hack -- svg height - margin.top - margin.bottom
      const yExtent = d3.extent(data.map(yAccessor)),
        yScale = d3.scale.linear().domain(yExtent).range([innerHeight,0]),
        yIntercept = yScale(yScale.domain()[0]);

      chart = <ScatterPlot
        data={gdata}
        width={600}
        height={400}
        margin={{top: 10, bottom: 50, left: 50, right: 10}}
        x={xAccessor}
        xAxis={xAxis}
        y={yAccessor}
        yScale={yScale}
        yIntercept={yIntercept}
        // yAxis={{label:'Temperature'}}
        tooltipHtml={toolTip}
        />;
    } else if (ready && result.data) {
      chart = <svg width={600} height={400} >
      <text x="50%" y="50%"
        alignmentBaseline="middle"
        textAnchor="middle"
        fontSize="200%">
        Insufficient Data Coverage
        </text>
      </svg>;
    }

    return <div>
      <h3 style={{textAlign: 'center'}}>{titleSeason + ' ' + titleElem}</h3>
      <h4 style={{textAlign: 'center'}}>{stationName}</h4>
      {chart}
      </div>
  }
};

