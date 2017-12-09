import React, { PropTypes } from 'react';
import FileSaver from 'file-saver';
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

  getMedian(args) {
    if (!args.length) {return 0};
    var numbers = args.slice(0).sort((a,b) => a - b);
    var middle = Math.floor(numbers.length / 2);
    var isEven = numbers.length % 2 === 0;
    return isEven ? (numbers[middle] + numbers[middle - 1]) / 2 : numbers[middle];
  }
  calculate_median(data, start, end) {
    let slice = [];

    for (let i = start; i <=end; i++) {
      let v = data.get(i);
      slice.push(v.model[1]); // Get the MEDIAN, middle value
    }

    return {
      median: this.getMedian(slice),
      start: start,
      end: end
    }
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
      let cnt = 0, sum = [0.,0.,0.], oVal;
      const model_values = [];

      result.proj.forEach((d) => {
        const yr = +d[0].slice(0,4), datum = {};
        let v = d[1][sid];

        if (typeof v == 'undefined') return;
        v = v.map(x => +x.toFixed(2))

        datum.model = v;
        // we are already averaged!
        datum.model_avg = v;
        // get data range
        if (yr < xRange[0]) xRange[0] = yr;
        if (yr > xRange[1]) xRange[1] = yr;
        if (v[0] < yRange[0]) yRange[0] = v[0];
        if (v[2] > yRange[1]) yRange[1] = v[2];

        model_values.push([yr, ...v])
        data.set(yr,datum);
      })

      let medians = [
        this.calculate_median(data, 2020,2049),
        this.calculate_median(data, 2040,2069),
        this.calculate_median(data, 2060,2089),
        this.calculate_median(data, 2080,2097),
      ];

      data.set("medians.projected", medians);

      data.set("model_values",model_values);
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
          // For the firsrt 5 years, use an initial value of 0.0
          oVal = cnt > 5 ? data.get(yr-5).obs : 0.;
          // This is the value of this year, - the starting value
          sum += v - oVal;
          // Push into 'observed' the year and value
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

      let slice = [];
      for (let i = 1971; i <=2000; i++) {
        let v = data.get(i);
        slice.push(v.obs);
      }

      data.set("medians.observed", this.getMedian(slice));
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
    const node = ReactFauxDOM.createElement("svg"),
      svg = d3.select(node)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top +")")

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

      // add rect for mouse capture on webkit
      svg.append("rect")
        .style("opacity","0")
        .attr("x",0)
        .attr("y",0)
        .attr("width", width-margin.left-margin.right)
        .attr("height", height-margin.top-margin.bottom);

      // Year Label
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

      // Y Axis Label
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
        // This is the vertical line on hover (showing year highlighted)
        svg.append("path")
          .datum([
            [year,yRange[0]],
            [year,yRange[1]],
          ])
          .attr("class", styles.highlight)
          .attr("d",line)
      }

      /// THIS IS ADDING THE AREA GRAPHS

      if (data.has("model_values")) {
        const dc = data.get("model_values");
        svg.append("path").datum(dc).attr("class", styles.areaLo).attr("d", areaLo)
        svg.append("path").datum(dc).attr("class", styles.areaHi).attr("d", areaHi)

        svg.append("path").datum(dc).attr("class", styles.lineLo).attr("d",lineLo)
        svg.append("path").datum(dc).attr("class", styles.lineMd).attr("d",lineMd)
        svg.append("path").datum(dc).attr("class", styles.lineHi).attr("d",lineHi)
      }

      if (data.get("medians.observed") && data.get('medians.projected')) {
        /*
        // These are the lines
        let obs_median = data.get("medians.observed");
        data.get("medians.projected").forEach((median) => {
          let at = median.start +  Math.floor((median.end - median.start) / 2)
          let e = median.end;
          let s = median.start;
          let m = median.median;
          delta = ""+(m-obs_median).toFixed(1)
          svg.append("path")
            .datum([
              [at-1.5,obs_median],
              [at,obs_median],
              [at+1.5,obs_median],
              [at,obs_median],
              [at,m],
              [at-1.5,m],
              [at,m],
              [at+1.5,m],
            ])
            .attr("class", styles.prismLine)
            .attr("d", line)
        });
          */

          /*
          svg.append("text")
            .attr("x",x(at))
            .attr("y",y((m + obs_median)/2))
            .attr("dy","0.3em")
            .style("text-anchor","start")
            .style("stroke", "white")
            .style("stroke-width", "1px")
            .style("font-size", "16px")
            .style("fill", "black")
            .style("font-weight", "800")
            .text(delta+ttUnits)
          */
      }


      // THIS IS ADDING THE OBSERVED / HISTORICAL
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


    let obs_median = data.get("medians.observed");

    let medians = (data.get("medians.projected") || []).map((median, indx) => {
      let e = median.end;
      let s = median.start;
      let m = median.median;
      return (<tr key={indx}>
      <td className={styles.col1}> {s} - {e}</td>
      <td className={styles.col3}> {(m - obs_median).toFixed(2)}{ttUnits}</td>
      </tr>)
    });

    //<DownloadForm ref={(c) => this.download = c} title={["year","obs","model_min","model_median","model_max"]} rows={data.get("rows") || []} />
    //<DownloadForm ref="download" title={["year","obs","model"]} rows={data.get("rows") || []} />

    return <div className={styles.chartOutput}>
      <div className={styles.chartBody}>
      <div className={styles.chartHeader1}>{titleSeason + ' ' + titleElem}</div>
      <div className={styles.chartHeader2}>{stationName}</div>
      {chart}
      </div>
      <Info year={year} element={element} data={data.has(year) ? data.get(year) : {}}
        delta={delta}
        medians={medians}
        download_data={["year","obs","model_min","model_median","model_max"].join(',') + "\n" +
              (data.get('rows') || []).join("\n")}
        showInfo={this.props.showInfo}/>
      </div>
  }
};

class Info extends React.Component {

  static propTypes = {
    year: PropTypes.number.isRequired,
    element: PropTypes.string.isRequired,
    delta: PropTypes.string.isRequired,
    // data: PropTypes.object.isRequired,
  };

  on_download_data(dl_data) {
    var blob = new Blob([dl_data], {type: "text/csv;charset=utf-8"});
    FileSaver.saveAs(blob, "maccc_dg_download.csv");
  }

  render () {
    const {download_data, medians, year,element,delta,data} = this.props,
      { ttUnits } = elems.get(element);

    let obsYr=" ", obsYrRng=" ", obs=" ", obs_avg=" ";
    let modelYrRng=" ", model_min=" ", model_med=" ", model_max=" ";

    if (typeof data.obs != "undefined") {
      obsYr = ""+year;
      obs = ""+data.obs;
    }
    if (typeof data.obs_avg != "undefined") {
      obsYrRng = ""+(year-4)+"–"+(year);
      obs_avg = ""+data.obs_avg;
    }
    if (typeof data.model_avg != "undefined") {
      modelYrRng = ""+(year-2)+"–"+(year+2);
      model_min = ""+data.model_avg[0];
      model_med = ""+data.model_avg[1];
      model_max = ""+data.model_avg[2];
    }

    const col1=styles.col1, col2=styles.col2, col3=styles.col3,
      l_lo= <svg width="20" height="20"><path className={styles.lineLo} d="M0,15L5,12L10,7,L15,10L20,5"></path></svg>,
      l_md = <svg width="20" height="20"><path className={styles.lineMd} d="M0,15L5,12L10,7,L15,10L20,5"></path></svg>,
      l_hi = <svg width="20" height="20"><path className={styles.lineHi} d="M0,15L5,12L10,7,L15,10L20,5"></path></svg>,
      l_avg = <svg width="20" height="20"><path className={styles.prismLine} d="M0,15L5,12L10,7,L15,10L20,5"></path></svg>,
      //l_obs = <svg width="20" height="20"><circle className={styles.prismDots} r="2" cx="10" cy="10"></circle></svg>,
      l_delta = <svg width="20" height="40"><path className={styles.prismLine} d="M3,0L17,0M10,0L10,40L3,40L17,40"></path></svg>;

    return <div className={styles.chartTable} >
      <button onClick={() => this.on_download_data(download_data)}>Download Data</button>
      <table>
      <thead>
      <tr><th colSpan="3">Observed</th></tr>
      </thead>
      <tbody>
      <tr>
        <td className={col1}>{obsYr}</td>
        <td className={col2}>{obs}</td>
        <td className={col3}>{ttUnits}</td>
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
        <td className={col1}>Changes from 1971-2000 for: </td>
        <td className={col2}>{}</td>
        <td className={col3}>{l_delta}</td>
      </tr>
      {medians}
      </tbody>
      </table>
      <button onClick={this.props.showInfo}>About the Source Data</button>
      <a href="http://necsc.umass.edu"><img className='necsc-logo' src="data/images/NECSC-logo.png"/></a>
    </div>
  }
}
