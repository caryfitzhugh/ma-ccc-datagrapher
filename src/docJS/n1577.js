var React = require('react'),
    Immutable = require('immutable'),
    d3 = require('d3'),
    request = require('superagent'),
    {ScatterPlot, LinePlot} = require('react-d3-components');

// This is loaded for the side-effect of getting the css file loading onto the page.
var css = require('./stnchart.css');

var s1 = require('../hcnstns.json').features.map(
      (f)=>{
        return [f.id,f.properties];
      });

var stns = new Immutable.OrderedMap(s1);
var seasons = new Immutable.OrderedMap([
    ["ANN","Annual"],
    ["MAM","Spring"],
    ["JJA","Summer"],
    ["SON","Fall"],
    ["DJF","Winter"],
    ["Jan","January"],
    ["Feb","February"],
    ["Mar","March"],
    ["Apr","April"],
    ["May","May"],
    ["Jun","June"],
    ["Jul","July"],
    ["Aug","August"],
    ["Sep","September"],
    ["Oct","October"],
    ["Nov","November"],
    ["Dec","December"],
  ]);



var n1577Component = React.createClass({

  propTypes: {
    init: React.PropTypes.object
  },

  currentState() {
    return this.state.params.toJS();
  },

  defaultParams: Immutable.fromJS({
    sid: "USH00300042",
    element: "pcpn",
    season: "ANN",
  }),

  getInitialState() {
    return {
      params: this.defaultParams,
      results: null,
      labels: Immutable.Map({
        title:"Average Maximum Temperature",
        stnName: "ALBANY INTL AP"
      }),
      stations: stns
    };
  },

  componentDidMount() {
    this.makeRequest(this.state.params);
  },

  shouldComponentUpdate(nextProps, nextState, nextContext){
    let state = this.state;
    if (state.params !== nextState.params) {
      this.makeRequest(nextState.params);
      return true;
    }
    if (state.params === nextState.params 
      && state.labels === nextState.labels 
      && state.results === nextState.results 
      && state.stations === nextState.stations) return false;
    return true;
  },

  makeRequest(params) {
    let sid = params.get("sid"), season = params.get("season"),
        stn = stns.get(sid),
        elemLabel, reqParams = {edate:"por",sid: stn.ghcn},
        p = {
          ANN: [{interval:[1],duration:1,maxmissing:30}, [1900]],
          MAM: [{interval:[1,0],duration:3,maxmissing:10}, [1900,5]],
          JJA: [{interval:[1,0],duration:3,maxmissing:10}, [1900,8]],
          SON: [{interval:[1,0],duration:3,maxmissing:10}, [1900,11]],
          DJF: [{interval:[1,0],duration:3,maxmissing:10}, [1900,2]],
          Jan: [{interval:[1,0],duration:1,maxmissing:3}, [1900,1]],
          Feb: [{interval:[1,0],duration:1,maxmissing:3}, [1900,2]],
          Mar: [{interval:[1,0],duration:1,maxmissing:3}, [1900,3]],
          Apr: [{interval:[1,0],duration:1,maxmissing:3}, [1900,4]],
          May: [{interval:[1,0],duration:1,maxmissing:3}, [1900,5]],
          Jun: [{interval:[1,0],duration:1,maxmissing:3}, [1900,6]],
          Jul: [{interval:[1,0],duration:1,maxmissing:3}, [1900,7]],
          Aug: [{interval:[1,0],duration:1,maxmissing:3}, [1900,8]],
          Sep: [{interval:[1,0],duration:1,maxmissing:3}, [1900,9]],
          Oct: [{interval:[1,0],duration:1,maxmissing:3}, [1900,10]],
          Nov: [{interval:[1,0],duration:1,maxmissing:3}, [1900,11]],
          Dec: [{interval:[1,0],duration:1,maxmissing:3}, [1900,12]],
        }[season];
    let elem = p[0];
    switch (params.get("element")) {
      case "pcpn": 
        elem.vX = 4; elem.vN = 0; elem.reduce = "sum";
        elemLabel = seasons.get(season)+" Total Precipitation"
        break;
      case "snow":
        elem.vX = 10; elem.vN = 0; elem.reduce = "mean";
        elemLabel = seasons.get(season)+" Average Daily Snowfall"
        break;
      case "snwd":
        elem.vX = 11; elem.vN = 0; elem.reduce = "mean";
        elemLabel = seasons.get(season)+" Average Daily Snowdepth"
        break;
      default:
    }
    reqParams.elems = [elem];
    reqParams.sdate = p[1];
    request.post('http://data.rcc-acis.org/StnData')
      .send(reqParams)
      .accept('json')
      .end((res) => {
        this.setState({
          params: params,
          results: res.body,
          labels: Immutable.Map({
            title: elemLabel,
            stnName: stn.name})
        });
      })
  },

  handleStation(sid) {
    let p = this.state.params;
    if (sid == p.get('sid')) return;
    let n = p.set('sid',sid);
    this.setState({params: n});
  },

  handleElement(elem) {
    let p = this.state.params;
    if (elem == p.get('element')) return;
    let n = p.set('element',elem);
    this.setState({params: n});
  },

  handleSeason(season) {
    let p = this.state.params;
    if (season == p.get('season')) return;
    let n = p.set('season',season);
    this.setState({params: n});
  },

  render() {
    let labels = this.state.labels;
    let stns = [];
    this.state.stations.forEach((stn,sid) => {
      let name = stn.name;
      stns.push(<option key={sid} value={sid}>{stn.name}</option>);
    });

    let sOptions = [];
    seasons.forEach((v,k) => {
      sOptions.push(<option key={k} value={k} >{v}</option>);
    })


    return (
      <div>
        <div className="row vertical-offset-md">
          <div className="col-lg-3 col-md-3">
            <div className="row">

              <fieldset style={{border:"none"}} >
                <label style={{display:"block", margin:"5px 0px"}} >Station: </label>
                <select
                  value={this.state.params.get('sid')}
                  onChange={(e) => {
                    return this.handleStation(e.target.value);
                  }}
                >
                  {stns}
                </select>
              </fieldset>

              <fieldset style={{border:"none"}} >
                <label style={{display:"block", margin:"5px 0px"}} >Element: </label>
                <select
                  value={this.state.params.get('element')}
                  onChange={(e) => {
                    return this.handleElement(e.target.value);
                  }}
                >
                  <option key="pcpn" value="pcpn">Total Precipitation</option>
                  <option key="snow" value="snow">Average Daily Snowfall</option>
                  <option key="snwd" value="snwd">Average Daily Snowdepth</option>
                </select>
              </fieldset>

              <fieldset style={{border:"none"}} >
                <label style={{display:"block", margin:"5px 0px"}} >Season: </label>
                <select
                  value={this.state.params.get('season')}
                  onChange={(e) => {
                    return this.handleSeason(e.target.value);
                  }}
                >
                  {sOptions}
                </select>
              </fieldset>

            </div>
          </div>
          <div className="col-lg-offset-1 col-lg-8 col-md-offset-1 col-md-8">
            <StnChart
              elemName={labels.get("title")}
              stnName={labels.get("stnName")}
              data={this.state.results}
            />
          </div>
        </div>
      </div>
    )
  }
})

var StnChart = React.createClass({

  propTypes: {
    elemName: React.PropTypes.string,
    stnName: React.PropTypes.string,
    data: React.PropTypes.object
  },

  render() {
    if (this.props.data) {
      let xAccessor = (row) => { return new Date(row[0]); },
          yAccessor = (row) => {
            if (row[1] == "T") {
              return 0.0;
            } else {
              return +row[1];
            }
          },
          data = [{label:"MinT",values:this.props.data.data.filter((d)=>{return d[1] != 'M';})}];

      let toolTip = (x,y) => {
        return ""+x.getUTCFullYear()+": "+y+'"';
      };

      let chart = <ScatterPlot
        data={data}
        width={600}
        height={400}
        margin={{top: 10, bottom: 50, left: 50, right: 10}}
        x={xAccessor}
        // xAxis={{label:"Year"}}
        y={yAccessor}
        // yAxis={{label:"Temperature"}}
        tooltipHtml={toolTip}
        />;

      return <div>
        <h3 style={{textAlign: "center"}}>{this.props.elemName}</h3>
        <h4 style={{textAlign: "center"}}>{this.props.stnName}</h4>
        {chart}
        </div>
    } else {
      return <div></div>;
    }
  }
});



module.exports = function(el,opts) {
  let rx = React.createElement(n1577Component,{init:{}});
  let rc = React.render(rx,el);
  return rc.currentState;
};

