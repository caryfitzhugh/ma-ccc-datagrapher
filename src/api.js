export const geoms = new Map([
  ['state','State'],
  ['county','County'],
  ['basin','Basin'],
//  ['stn', 'Station'],
]);

export let seasons = new Map([
  ['ANN',{title:'Annual',interval:[1],duration:1,maxmissing:30}],
  ['MAM',{title:'Spring',interval:[1,0],duration:3,maxmissing:10,smonth:5}],
  ['JJA',{title:'Summer',interval:[1,0],duration:3,maxmissing:10,smonth:8}],
  ['SON',{title:'Fall',interval:[1,0],duration:3,maxmissing:10,smonth:11}],
  ['DJF',{title:'Winter',interval:[1,0],duration:3,maxmissing:10,smonth:2}],
]);

export let elems = new Map([
// StnPrcp
  ['pcpn', {
    label:'Total Precipitation',
    yLabel: 'Precipitation (Inch)', ttUnits: '"',
    acis: {vX:4, vN:0, reduce:'sum'},
    grid: {vX:94,maxmissing:0},
    gridY: {vX:98,maxmissing:0},
    gYr: [1895,2016]}],
  ['snow', {
    label:'Total Snowfall',
    yLabel: 'Snowfall (Inch)', ttUnits: '"',
    acis: {vX:10, vN:0, reduce:'sum'}}],
  ['snwd', {
    label:'Maximum Daily Snowdepth',
    yLabel: 'Snowdepth (Inch)', ttUnits: '"',
    acis: {vX:11, vN:0, reduce:'max'}}],
// StnTemp
  ['maxt', {
    label:'Maximum Temperature',
    yLabel: 'Temperature °F', ttUnits: '°F',
    acis: {vX:1, vN:0, reduce:'mean'},
    grid: {vX:91,maxmissing:0},
    gridY: {vX:95,maxmissing:0},
    gYr: [1895,3096]}],
  ['mint', {
    label:'Minimum Temperature',
    yLabel: 'Temperature °F', ttUnits: '°F',
    acis: {vX:2, vN:0, reduce:'mean'},
    grid: {vX:92,maxmissing:0},
    gridY: {vX:96,maxmissing:0},
    gYr: [1895,2016]}],
  ['avgt', {
    label:'Average Temperature',
    yLabel: 'Temperature °F', ttUnits: '°F',
    acis: {vX:43, vN:0, reduce:'mean'},
    grid: {vX:99,maxmissing:0},
    gridY: {vX:100,maxmissing:0},
    gYr: [1895,2016]}],
  ['gdd50', {
    label:'Growing Degree-Day Accumulation (GDD)',
    yLabel: 'Degree-Day °F', ttUnits: 'GDD',
    acis: {vX:44, vN:0, base:50, reduce:'sum'},
    grid: {},
    gYr: [1981,2016]}],
  ['hdd65', {
    label:'Heating Degree-Day Accumulation (HDD)',
    yLabel: 'Degree-Day °F', ttUnits: 'HDD',
    acis: {vX:45, vN:0, base:65, reduce:'sum'},
    grid: {},
    gYr: [1981,2016]}],
  ['cdd65', {
    label:'Cooling Degree-Day Accumulation (CDD)',
    yLabel: 'Degree-Day °F', ttUnits: 'CDD',
    acis: {vX:44, vN:0, base:65, reduce:'sum'},
    grid: {},
    gYr: [1981,2016]}],
// StnTDays
  ['tx90', {
    label:'Days with Maximum Temperature Above 90°F',
    yLabel: 'Days', ttUnits: ' days',
    acis: {vX:1, vN:0, reduce:'cnt_gt_90'},
    grid: {},
    gYr: [1981,2016]}],
  ['tx95', {
    label:'Days with Maximum Temperature Above 95°F',
    yLabel: 'Days', ttUnits: ' days',
    acis: {vX:1, vN:0, reduce:'cnt_gt_95'},
    grid: {},
    gYr: [1981,2016]}],
  ['tx100', {
    label:'Days with Maximum Temperature Above 100°F',
    yLabel: 'Days', ttUnits: 'days',
    acis: {vX:1, vN:0, reduce:'cnt_gt_100'},
    grid: {},
    gYr: [1981,2016]}],
  ['tn0', {
    label:'Days with Minimum Temperature Below 0°F',
    yLabel: 'Days', ttUnits: 'days',
    acis: {vX:2, vN:0, reduce:'cnt_lt_0'},
    grid: {},
    gYr: [1981,2016]}],
  ['tn32', {
    label:'Days with Minimum Temperature Below 32°F',
    yLabel: 'Days', ttUnits: 'days',
    acis: {vX:2, vN:0, reduce:'cnt_lt_32'},
    grid: {},
    gYr: [1981,2016]}],
// StnPDays
  ['pcpn_1', {
    label:'Days with Precipitation > 1"',
    yLabel: 'Days', ttUnits: 'days',
    acis: {vX:4, vN:0, reduce:'cnt_gt_1'},
    grid: {},
    gYr: [1981,2016]}],
  ['pcpn_2', {
    label:'Days with Precipitation > 2"',
    yLabel: 'Days', ttUnits: 'days',
    acis: {vX:4, vN:0, reduce:'cnt_gt_2'},
    grid: {},
    gYr: [1981,2016]}],
  ['pcpn_4', {
    label:'Days with Precipitation > 4"',
    yLabel: 'Days', ttUnits: 'days',
    acis: {vX:4, vN:0, reduce:'cnt_gt_4'},
    grid: {},
    gYr: [1981,2016]}],
  ['snwd_1', {
    label:'Days with Snow Depth > 1"',
    yLabel: 'Days', ttUnits: 'days',
    acis: {vX:11, vN:0, reduce:'cnt_gt_1'}}],
// StnFrost
  ['grow_32', {
    label:'Growing Season Length (above 32°F)',
    yLabel: 'Days', ttUnits: '',
    acis: {vX:2, vN:0, reduce:{reduce:'run_gt_32', n:1}}}],
]);


// "elems":[{"name":"maxt","interval":[1,0,0],"duration":"std","season_start":"07-30","reduce":"run_gt_40"}]}

export function buildQuery(params, meta) {
  const s = seasons.get(params.season),
    e = elems.get(params.element);
  let p = {};
  let elem = {
    interval: s.interval,
    duration: s.duration,
    maxmissing: s.maxmissing,
  }
  if (params.geom == 'stn') {
    p.edate = 'por';
    p.sid = meta.ghcn;
    p.sdate = s.smonth ? ['por',s.smonth] : ['por'];
    elem = {...elem, ...e.acis};
  } else {
    switch (params.geom) {
      case 'state' :
        p.state = 'pa,nj,nh,ma';
        break;
      case 'basin' :
        p.state = 'oh,nj,me';
        break;
      default :
        p.state = 'ny';
    }
    p.grid = 21;
    p.sdate = s.smonth ? [e.gYr[0],s.smonth]: [e.gYr[0]];
    p.edate = s.smonth ? [e.gYr[1],s.smonth]: [e.gYr[1]];
    if (params.season == 'DJF') p.sdate[0]++; // winter will start before POR
    elem.area_reduce = params.geom+'_mean';
    if (!s.smonth && e.gridY) { elem = {...elem, ...e.acis, ...e.gridY}; }
    else { elem = {...elem, ...e.acis, ...e.grid}; }
  }
  p.elems = [elem];
  return p;
}

export function parseURL(pStr) {
  let pFields = pStr.split('/');
  return {
    chart: pFields[0],
    geom: pFields[1],
    element: pFields[2],
    season: pFields[3],
    sid: pFields[4],
    bbox: pFields[5]
  };
}

export function correctParam(param) {
  let { chart, geom, element, season, sid, bbox } = param;
  let sane = true;
  if (['stn','state','county','basin'].indexOf(geom) == -1) {
    geom = 'state';
    sane = false;
  }
  if (!chartDefs.has(chart)) {
    chart = 'Temp';
    sane = false;
  }
  let def = chartDefs.get(chart);
  if (geom == 'stn') {
    if (def.elems.indexOf(element) == -1) {
      element = def.elems[0];
      sane = false;
    }
    if (element == 'grow_32') {
      if (season != 'ANN') {
        season = 'ANN';
        sane = false;
      }
    }
  } else {
    if (def.gElems.length == 0) {
      chart = 'Temp';
      def = chartDefs.get(chart);
      sane = false;
    }
    if (def.gElems.indexOf(element) == -1) {
      element = def.gElems[0];
      sane = false;
    }
  }
  if (def.seasons.indexOf(season) == -1) {
    season = def.seasons[0];
    sane = false;
  }
  if (sane) return param;
  return { chart, geom, element, season, sid, bbox };
}

export function updateSid(param, prevParam, geoms) {
  let {sid, geom} = param;
  const nGeom = geoms[geom];

  if (!prevParam) {
    if (nGeom && nGeom.ready) sid = nGeom.meta.has(sid) ? sid : defaultSids[geom]
    else sid = "";
  } else {
    const pGeom = geoms[prevParam.geom];
    if (pGeom && pGeom.ready && nGeom && nGeom.ready) {
      if (geom != prevParam.geom) sid = nGeom.meta.has(sid) ? sid : defaultSids[geom];
    } else sid = "";
  }

  if (sid == param.sid) return param;
  return {...param, sid}
}

const defaultSids = {
  stn: "USH00300042",
  state: "MA",
  county: "25001",
  basin: "Blackstone",
};

function nearestGeom(nSid, nGeom, pSid, pGeom) {
  if (!pGeom && !pSid) {
    if (nGeom && nGeom.ready) {
      return nGeom.meta.has(nSid) ? nSid : [...nGeom.meta.keys()][0];
    }
    return '';
  }
  if (pGeom && pGeom.ready && nGeom && nGeom.ready) {
    if (pGeom == nGeom) return nSid;
    return nGeom.meta.has(nSid) ? nSid : [...nGeom.meta.keys()][0];
  }
  return '';
}

export function haveSameResults(p1,p2) {
  if (!p2) return false;
  const { chart, geom, element, season, sid, bbox } = p1;
  if (p2.chart != chart) return false;
  if (p2.geom != geom) return false;
  if (p2.element != element) return false;
  if (p2.season != season) return false;
  if (geom == 'stn' && p2.sid != sid) return false;
  return true;
}

const allSeasons = [ ...seasons.keys()];

export const chartDefs = new Map([
  ['Temp', {
      title: 'Temp',
      elems: ['maxt', 'mint', 'avgt', 'gdd50', 'hdd65', 'cdd65',
              'tx90','tx95','tx100',
              'tn0','tn32',
              'grow_32',
              // 'tx90_3','tx95_3','tx100_3',
              // 'tn0_3','tn32_3',
              // 'tx90_run', 'tx95_run', 'tx100_run', 'tn0_run', 'tn32_run'
              'pcpn','snow','snwd',
              'pcpn_1', 'pcpn_2', 'pcpn_4', 'snwd_1',
              // 'pcpn_lt01_run','pcpn_lt1_run'
             ],
      seasons: allSeasons
  }],
  ['Prcp',{
    title: 'Prcp',
    elems: ['maxt', 'mint', 'avgt', 'gdd50', 'hdd65', 'cdd65',
            'tx90','tx95','tx100',
            'tn0','tn32',
            'grow_32',
            // 'tx90_3','tx95_3','tx100_3',
            // 'tn0_3','tn32_3',
            // 'tx90_run', 'tx95_run', 'tx100_run', 'tn0_run', 'tn32_run'
            'pcpn','snow','snwd',
            'pcpn_1', 'pcpn_2', 'pcpn_4', 'snwd_1',
            // 'pcpn_lt01_run','pcpn_lt1_run'
           ],
    seasons: allSeasons
  }],
]);

chartDefs.forEach((def,chart) => {
  def.gElems = def.elems.filter((e) => (typeof elems.get(e).gYr != 'undefined'));
  def.toString = (p) => {
    return [p.chart,p.geom,p.element,p.season,p.sid,p.bbox].join('/');
  };
});
