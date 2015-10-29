import React, { PropTypes } from 'react';
import d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';

import {seasons,elems} from '../api';
import styles from './App.css';


export default class AreaChart {

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
    const { meta, geomType, sid, element, season, result, ready } = this.props;
    const width = 600, height = 400, margin = {top: 10, right: 15, bottom: 50, left: 50};

    const { label:titleElem, yLabel, ttUnits } = elems.get(element),
          titleSeason = seasons.get(season).title,
          stationName = meta && meta.has(sid) ? meta.get(sid).name : 'loading';
    let chart = <svg width={width} height={height} >
                  <text x="50%" y="50%"
                    alignmentBaseline="middle"
                    textAnchor="middle"
                    fontSize="150%">
                    Loading…
                  </text>
                </svg>;

    const dPrism = [], dHist = [], dProj = [], xRange=[9999,0], yRange=[10000,-10000];
    if (ready && result.proj) {
      result.proj.forEach((d) => {
        const yr = +d[0].slice(0,4), vals = d[1][sid].map(v => +v.toFixed(2));
        if (vals[0] < yRange[0]) yRange[0] = vals[0];
        if (vals[2] > yRange[1]) yRange[1] = vals[2];
        if (yr < xRange[0]) xRange[0] = yr;
        if (yr > xRange[1]) xRange[1] = yr;
        if (yr < 2010) dHist.push([yr,...vals])
        else dProj.push([yr,...vals]);
      })
    }
    if (ready && result.data) {
      result.data.forEach((d) => {
        const yr = +d[0].slice(0,4);
        let v = d[1][sid];
        if (typeof v != 'undefined' && v == v) {
          v = +v.toFixed(2);
          if (v < yRange[0]) yRange[0] = v;
          if (v > yRange[1]) yRange[1] = v;
          if (yr < xRange[0]) xRange[0] = yr;
          if (yr > xRange[1]) xRange[1] = yr;
          dPrism.push([yr,v]);
        }
      })
    }

    if (dPrism.length > 5){
      const x = d3.scale.linear()
        .range([0, width - margin.left - margin.right])
        .domain([xRange[0]-2,xRange[1]]);
      const y = d3.scale.linear()
        .range([height - margin.top - margin.bottom, 0])
        .domain(yRange)
        .nice(5);

      const smooth = (data) => {
        const r = [];
        data.forEach((d,i) => {
          if (i>=4) r.push([d[0],
            d3.mean(data.slice(i-4,i+1).map(v=>v[1])),
            d3.mean(data.slice(i-4,i+1).map(v=>v[2])),
            d3.mean(data.slice(i-4,i+1).map(v=>v[3])),
            ])
        })
        return r;
      }
      const sdPrism = smooth(dPrism), sdHist = smooth(dHist), sdProj = smooth(dProj);

      const xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat(d3.format(".0f"))
        .orient('bottom');
      const yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

      const areaLo = d3.svg.area()
        .x (d => x(d[0]))
        .y0(d => y(d[1]))
        .y1(d => y(d[2]))
      const areaHi = d3.svg.area()
        .x (d => x(d[0]))
        .y0(d => y(d[2]))
        .y1(d => y(d[3]))
      const line = d3.svg.line()
        .x(d => x(d[0]))
        .y(d => y(d[1]))

      const node = ReactFauxDOM.createElement('svg'),
        svg = d3.select(node)
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top +')')

      svg.append('g')
        .attr('class', styles.axis)
        .attr('transform', 'translate(0,' + (height - margin.top - margin.bottom) + ')')
        .call(xAxis)
        .append("text")
          .attr("class", styles.axisLabel)
          .attr("x", width - margin.left - margin.right)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text("Year");

      svg.append('g')
        .attr('class', styles.axis)
        .call(yAxis)
        .append("text")
          .attr("class", styles.axisLabel)
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.7em")
          .style("text-anchor", "end")
          .text(yLabel);

      svg.append('path')
        .datum(sdHist)
        .attr('class', styles.areaLo)
        .attr('d', areaLo)
      svg.append('path')
        .datum(sdHist)
        .attr('class', styles.areaHi)
        .attr('d', areaHi)

      svg.append('path')
        .datum(sdProj)
        .attr('class', styles.areaLo)
        .attr('d', areaLo)
      svg.append('path')
        .datum(sdProj)
        .attr('class', styles.areaHi)
        .attr('d', areaHi)

      svg.append('path')
        .datum(sdPrism)
        .attr('class', styles.prismLine)
        .attr('d', line)

      const dots = svg.append('g');
      dPrism.forEach((d)=>{
        dots.append('circle')
          .attr('class',styles.prismDots)
          .attr('r',2)
          .attr('cx',x(d[0]))
          .attr('cy',y(d[1]))
      })

      chart = node.toReact()
    } else if (ready) {
      chart = <svg width={width} height={height} >
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

