import React, { PropTypes } from 'react';
import d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';

import {seasons,elems} from '../api';
import styles from './App.css';


export default class AreaChart extends React.Component {

  static propTypes = {
    meta: PropTypes.object,
    geomType: PropTypes.string.isRequired,
    sid: PropTypes.string.isRequired,
    element: PropTypes.string.isRequired,
    season: PropTypes.string.isRequired,
    result: PropTypes.object.isRequired,
    ready: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {year: 0};
    this.data = new Map();
  }

  render() {
    const { meta, geomType, sid, element, season, result, ready } = this.props;
    const width = 600, height = 400, margin = {top: 10, right: 15, bottom: 30, left: 50};

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

    const data = new Map();
    this.data = data;
    const xRange=[9999,0], yRange=[10000,-10000];
    const dStn = [];

    if (ready && result.data) {
      let cnt = 0, sum = 0., oVal;
      result.data.forEach((d) => {
        const yr = +d[0].slice(0,4);
        if (d[1] != 'M') {
          const idx = dStn.length, v = 0.0 ? d[1] == 'T' : +(+d[1]).toFixed(2);
          if (yr < xRange[0]) xRange[0] = yr;
          if (yr > xRange[1]) xRange[1] = yr;
          if (v < yRange[0]) yRange[0] = v;
          if (v > yRange[1]) yRange[1] = v;
          if (idx >= 4 && dStn[idx-4][0] == yr-4) {
            let mean = v;
            dStn.slice(idx-4,idx).forEach((d) => {mean += d[1];});
            mean = +(mean/5.).toFixed(2);
            dStn.push([yr,v,mean]);
            data.set(yr,{d:v, s: mean});
          } else {
            dStn.push([yr,v]);
            data.set(yr,{d:v});
          }
        }
      })
    }

    if (dStn.length > 0){
      const x = d3.scale.linear()
        .range([0, width - margin.left - margin.right])
        .domain([xRange[0]-2,xRange[1]]);
      const y = d3.scale.linear()
        .range([height - margin.top - margin.bottom, 0])
        .domain(yRange)
        .nice(5);

      const xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat(d3.format(".0f"))
        .orient('bottom');
      const yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');
      const line = d3.svg.line()
        .defined( function (d) {
          return d.length == 3;
        })
        .x(d => x(d[0]))
        .y(d => y(d[2]))

      const node = ReactFauxDOM.createElement("svg"),
        svg = d3.select(node)
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top +")")

      svg.append("g")
        .attr("class", styles.axis)
        .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
        .call(xAxis)
        .append("text")
          .attr("class", styles.axisLabel)
          .attr("x", width - margin.left - margin.right)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text("Year");

      svg.append("g")
        .attr("class", styles.axis)
        .call(yAxis)
        .append("text")
          .attr("class", styles.axisLabel)
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.7em")
          .style("text-anchor", "end")
          .text(yLabel);

      svg.append("path")
        .datum(dStn)
        .attr("class", styles.prismLine)
        .attr("d", line)

      const dots = svg.append('g');
      dStn.forEach((d)=>{
        dots.append('circle')
          .attr('class',styles.prismDots)
          .attr('r',2)
          .attr('cx',x(d[0]))
          .attr('cy',y(d[1]))
      });
      

      d3.select(node)
        .on("mouseleave",() => {
          this.setState({year:0});
        })
        .on("mousemove", (d,i)=>{
          const e = d3.event;
          const year = +x.invert(e.offsetX - margin.left).toFixed(0);
          this.setState({year});
        })

      chart = node.toReact();

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
      <div className={styles.chartHeader1}>{titleSeason + ' ' + titleElem}</div>
      <div className={styles.chartHeader2}>{stationName}</div>
      <Info year={this.state.year} data={data} />
      {chart}
      </div>
  }
};

class Info extends React.Component {

  static propTypes = {
    year: PropTypes.number.isRequired,
    // data: PropTypes.object.isRequired,
  };

  render () {
    const {year,data} = this.props;
    if (!data.has(year)) return <div style={{minHeight: '20px'}}></div>
    const d = data.get(year);
    let raw, sraw;
    raw = [<span>{''+year}: </span>,<span> {d.d} </span>]
    if (typeof d.s != "undefined") {
      sraw = [<span>Mean {year-4}-{year}: </span>,<span> {d.s}  </span>]
    }
    return <div style={{minHeight: '20px'}}>
      {raw}
      {sraw}
      </div>
  }
}
