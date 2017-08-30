import React, { PropTypes } from 'react';
import d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';

import {seasons,elems} from '../api';
import DownloadForm from './DownloadForm'
import styles from './App.css';


export default class AreaChart extends React.Component {

  static propTypes = {
    meta: PropTypes.object,
    geomType: PropTypes.string.isRequired,
    sid: PropTypes.string.isRequired,
    element: PropTypes.string.isRequired,
    season: PropTypes.string.isRequired,
    result: PropTypes.object.isRequired,
    showInfo: PropTypes.func.isRequired,
    year: PropTypes.number.isRequired,
    setYear: PropTypes.func.isRequired,
    ready: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.data = new Map();
    this.result = null;
  }

  summarizeData(sid,result) {
    /*
      data consists of map[yr] {
      model:       [low, median, high]
      model_avg:   [low, median, high]
      obs:                 value
      obs_avg:             value
    }
      plus entries for plotting (yr, v1, v2, v3...):
        model_current_avg
        model_future_avg
        medians (for future-current delta)
        obs
        obs_avg
        xrange
        yrange
    */
    const data = new Map();
    const xRange=[9999,0], yRange=[10000,-10000];
    this.data = data;
    this.result = result;
    // calculate model data
    if (result.proj) {
      let cnt = 0, sum = [0.,0.,0.], median_sum = 0., future = false, oVal;
      const model_current_avg = [], model_future_avg = [], medians = [0,0];

      result.proj.forEach((d) => {
        const yr = +d[0].slice(0,4), datum = {};
        let v = d[1][sid];

        if (typeof v == 'undefined') return;
        v = v.map(x => +x.toFixed(2))

        if (yr > 2020 && !future) { // reset the counters for future
          medians[0] = median_sum / cnt;
          cnt = 0; sum = [0.,0.,0.]; median_sum = 0.; future = true;
        }
        median_sum += v[1]; cnt++;
        datum.model = v;
        oVal = cnt > 5 ? data.get(yr-5).model : [0,0,0];
        v.forEach((x,i) => {sum[i] += x - oVal[i];});

        if (cnt >= 5) {
          const s = v.map((x,i) => +(sum[i]/5.).toFixed(2));
          // get data range
          if (yr < xRange[0]) xRange[0] = yr;
          if (yr > xRange[1]) xRange[1] = yr;
          if (s[0] < yRange[0]) yRange[0] = s[0];
          if (s[2] > yRange[1]) yRange[1] = s[2];
          if (future) model_future_avg.push([yr, ...s])
          else model_current_avg.push([yr, ...s]);
          datum.model_avg = s;
        }
        data.set(yr,datum);
      })
      medians[1] = median_sum/cnt;
      data.set("model_current_avg",model_current_avg);
      data.set("model_future_avg",model_future_avg);
      data.set("medians",medians);
    }

    // calculate prism obs data
    if (result.data) {
      let cnt = 0, sum = 0., oVal;
      const obs = [], obs_avg = [];

      result.data.forEach((d) => {
        const yr = +d[0].slice(0,4),
          datum = {};

        // It receives an array
        let v = d[1][sid][0];

        if (typeof v != 'undefined' && v == v) {
          v = +v.toFixed(2);

          // adjust data range
          if (yr < xRange[0]) xRange[0] = yr;
          if (yr > xRange[1]) xRange[1] = yr;
          if (v < yRange[0]) yRange[0] = v;
          if (v > yRange[1]) yRange[1] = v;

          cnt++;
          oVal = cnt > 5 ? data.get(yr-5).obs : 0.;
          sum += v - oVal;
          obs.push([yr,v]);
          datum.obs = v;
          if (cnt >= 5) {
            const s = +(sum/5).toFixed(2);
            obs_avg.push([yr,s]);
            datum.obs_avg = s;
          }
          if (data.has(yr)) data.set(yr,{...data.get(yr), ...datum})
          else data.set(yr,datum);
        }
      })
      data.set("obs",obs);
      data.set("obs_avg",obs_avg);
    }
    if (yRange[0]!=10000) {
      data.set("xrange",xRange);
      data.set("yrange",yRange);
      const rows = [];
      for (let yr=xRange[0]; yr<=xRange[1]; yr++) {
        if (data.has(yr)) {
          const datum = data.get(yr);
          let s = ""+yr+","
          if (typeof datum.obs != "undefined") s = s+datum.obs;
          if (typeof datum.model != "undefined") {
            s = s+","+datum.model[0]+","+datum.model[1]+","+datum.model[2];
          } else {
            s = s+",,,"
          }
          if (s.length > 8) rows.push(s)
        }
      }
      if (rows.length > 0) data.set("rows",rows);
    }
  }

  render() {
    const { meta, geomType, sid, element, season, result, year, ready } = this.props;
    const width = 500, height = 400, margin = {top: 10, right: 15, bottom: 30, left: 50};

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

    if (!ready || this.result != result) this.summarizeData(sid, result);
    let delta = "";

    const data = this.data;

    if (data.has("xrange")) {
      const xRange = data.get("xrange"), yRange = data.get("yrange");

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

      const areaLo = d3.svg.area()
        .x (d => x(d[0]))
        .y0(d => y(d[1]))
        .y1(d => y(d[2]))
      const areaHi = d3.svg.area()
        .x (d => x(d[0]))
        .y0(d => y(d[2]))
        .y1(d => y(d[3]))
      const lineLo = d3.svg.line()
        .x(d => x(d[0]))
        .y(d => y(d[1]))
      const lineMd = d3.svg.line()
        .x(d => x(d[0]))
        .y(d => y(d[2]))
      const lineHi = d3.svg.line()
        .x(d => x(d[0]))
        .y(d => y(d[3]))
      const line = d3.svg.line()
        .x(d => x(d[0]))
        .y(d => y(d[1]))

      const node = ReactFauxDOM.createElement("svg"),
        svg = d3.select(node)
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top +")")

      // add rect for mouse capture on webkit
      svg.append("rect")
        .style("opacity","0")
        .attr("x",0)
        .attr("y",0)
        .attr("width", width-margin.left-margin.right)
        .attr("height", height-margin.top-margin.bottom);

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

      if (data.has(year)) {
        svg.append("path")
          .datum([
            [year,yRange[0]],
            [year,yRange[1]],
          ])
          .attr("class", styles.highlight)
          .attr("d",line)
      }

      if (data.has("model_current_avg")) {

        const dc = data.get("model_current_avg");
        svg.append("path").datum(dc).attr("class", styles.areaLo).attr("d", areaLo)
        svg.append("path").datum(dc).attr("class", styles.areaHi).attr("d", areaHi)

        svg.append("path").datum(dc).attr("class", styles.lineLo).attr("d",lineLo)
        svg.append("path").datum(dc).attr("class", styles.lineMd).attr("d",lineMd)
        svg.append("path").datum(dc).attr("class", styles.lineHi).attr("d",lineHi)

        const df = data.get("model_future_avg");
        svg.append("path").datum(df).attr("class", styles.areaLo).attr("d", areaLo)
        svg.append("path").datum(df).attr("class", styles.areaHi).attr("d", areaHi)

        svg.append("path").datum(df).attr("class", styles.lineLo).attr("d",lineLo)
        svg.append("path").datum(df).attr("class", styles.lineMd).attr("d",lineMd)
        svg.append("path").datum(df).attr("class", styles.lineHi).attr("d",lineHi)

        const medians = data.get("medians");
        // for infotable
        delta = ""+(medians[1]-medians[0]).toFixed(1)
        svg.append("path")
          .datum([
            [2023,medians[0]],
            [2027,medians[0]],
            [2025,medians[0]],
            [2025,medians[1]],
            [2023,medians[1]],
            [2027,medians[1]],
          ])
          .attr("class", styles.prismLine)
          .attr("d", line)
        svg.append("text")
          .attr("x",x(2027))
          .attr("y",y((medians[0]+medians[1])/2))
          .attr("dy","0.3em")
          .style("text-anchor","start")
          .text(delta+ttUnits)
      }

      if (data.has("obs")) {
        svg.append("path")
          .datum(data.get("obs_avg"))
          .attr("class", styles.prismLine)
          .attr("d", line)

        const dots = svg.append('g');
        data.get("obs").forEach((d)=>{
          dots.append('circle')
            .attr('class', d[0]!= year ? styles.prismDots : styles.prismDotsOver)
            .attr('r',2)
            .attr('cx',x(d[0]))
            .attr('cy',y(d[1]))
        })
      }

      d3.select(node)
        .on("mouseleave",() => {
          this.props.setYear(0);
        })
        .on("mousemove", (d,i)=>{
          const e = d3.event;
          let year = 0;
          if (e.srcElement) { // non-firefox
            if (e.srcElement.nodeName != "text") { // range label
              year = +x.invert(e.offsetX - margin.left).toFixed(0);
            }
          } else {
            if (e.explicitOriginalTarget && e.target.nodeName != "text") {
              year = +x.invert(d3.mouse(e.explicitOriginalTarget)[0]).toFixed(0);
            }
          }
          if (this.data.has(year)) {
            const d = this.data.get(year);
            if (typeof d.obs == "undefined" && typeof d.model_avg == "undefined") year = 0;
          } else year = 0;
          this.props.setYear(year);
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

    let dload = ""
    if (data.has("rows")) {
      dload = <DownloadForm ref={(c) => this.download = c} title={["year","obs","model_min","model_median","model_max"]} rows={data.get("rows") || []} />
    }

    return <div className={styles.chartOutput}>
      <div className={styles.chartBody}>
      <div className={styles.chartHeader1}>{titleSeason + ' ' + titleElem}</div>
      <div className={styles.chartHeader2}>{stationName}</div>
      {chart}
      {dload}
      </div>
      <Info year={year} element={element} data={data.has(year) ? data.get(year) : {}}
        delta={delta}
        download={::this.doDownload}
        showInfo={this.props.showInfo}/>
      <DownloadForm ref="download" title={["year","obs","model"]} rows={data.get("rows") || []} />
      </div>
  }

  doDownload(e) {
    const f = this.download;
    if (typeof f != "undefined") {
      f._form.submit();
    }
  }
};

class Info extends React.Component {

  static propTypes = {
    year: PropTypes.number.isRequired,
    element: PropTypes.string.isRequired,
    delta: PropTypes.string.isRequired,
    // data: PropTypes.object.isRequired,
  };

  render () {
    const {year,element,delta,data,download} = this.props,
      { ttUnits } = elems.get(element);
    let obsYr=" ", obsYrRng=" ", obs=" ", obs_avg=" ";
    let modelYrRng=" ", model_min=" ", model_med=" ", model_max=" ";

    if (typeof data.obs != "undefined") {
      obsYr = ""+year;
      obs = ""+data.obs;
    }
    if (typeof data.obs_avg != "undefined") {
      obsYrRng = ""+(year-4)+"–"+year;
      obs_avg = ""+data.obs_avg;
    }
    if (typeof data.model_avg != "undefined") {
      modelYrRng = ""+(year-4)+"–"+year;
      model_min = ""+data.model_avg[0];
      model_med = ""+data.model_avg[1];
      model_max = ""+data.model_avg[2];
    }

    const col1=styles.col1, col2=styles.col2, col3=styles.col3,
      l_lo= <svg width="20" height="20"><path className={styles.lineLo} d="M0,15L5,12L10,7,L15,10L20,5"></path></svg>,
      l_md = <svg width="20" height="20"><path className={styles.lineMd} d="M0,15L5,12L10,7,L15,10L20,5"></path></svg>,
      l_hi = <svg width="20" height="20"><path className={styles.lineHi} d="M0,15L5,12L10,7,L15,10L20,5"></path></svg>,
      l_avg = <svg width="20" height="20"><path className={styles.prismLine} d="M0,15L5,12L10,7,L15,10L20,5"></path></svg>,
      l_obs = <svg width="20" height="20"><circle className={styles.prismDots} r="2" cx="10" cy="10"></circle></svg>,
      l_delta = <svg width="20" height="40"><path className={styles.prismLine} d="M3,0L17,0M10,0L10,40L3,40L17,40"></path></svg>;

    return <div className={styles.chartTable} >
      <button onClick={download}>Download Data</button>
      <table>
      <thead>
      <tr><th colSpan="3">Observed {ttUnits}</th></tr>
      </thead>
      <tbody>
      <tr>
        <td className={col1}>{obsYr}</td>
        <td className={col2}>{obs}</td>
        <td className={col3}>{l_obs}</td>
      </tr>
      <tr>
        <td className={col1}>5-yr Mean</td>
        <td className={col2} rowSpan="2">{obs_avg}</td>
        <td className={col3} rowSpan="2">{l_avg}</td>
      </tr>
      <tr>
        <td className={col1}>{obsYrRng}</td>
      </tr>
      <tr>
        <td>&nbsp;</td><td>&nbsp;</td>
      </tr>
      </tbody>
      <thead>
      <tr><th colSpan="3">Modeled {ttUnits}</th></tr>
      <tr><th colSpan="3">{modelYrRng}</th></tr>
      </thead>
      <tbody>
      <tr>
        <td className={col1}>Max</td>
        <td className={col2}>{model_max}</td>
        <td className={col3}>{l_hi}</td>
      </tr>
      <tr>
        <td className={col1}>Median</td>
        <td className={col2}>{model_med}</td>
        <td className={col3}>{l_md}</td>
      </tr>
      <tr>
        <td className={col1}>Min</td>
        <td className={col2}>{model_min}</td>
        <td className={col3}>{l_lo}</td>
      </tr>
      <tr>
        <td className={col1}>Change 1968-2000 to 2039-2069</td>
        <td className={col2}>{delta}</td>
        <td className={col3}>{l_delta}</td>
      </tr>
      </tbody>
      </table>
      <button onClick={this.props.showInfo}>About the Source Data</button>
      <a href="http://necsc.umass.edu"><img className='necsc-logo' src="data/images/NECSC-logo.png"/></a>
    </div>
  }
}
