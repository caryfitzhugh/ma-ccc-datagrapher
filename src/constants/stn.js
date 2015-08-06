
export let seasons = new Map([
  ['ANN','Annual'],
  ['MAM','Spring'],
  ['JJA','Summer'],
  ['SON','Fall'],
  ['DJF','Winter'],
  ['Jan','January'],
  ['Feb','February'],
  ['Mar','March'],
  ['Apr','April'],
  ['May','May'],
  ['Jun','June'],
  ['Jul','July'],
  ['Aug','August'],
  ['Sep','September'],
  ['Oct','October'],
  ['Nov','November'],
  ['Dec','December'],
]);

export let elems = new Map([
// StnPrcp
  ['pcpn', {
    label:'Total Precipitation',
    yLabel: 'Inches', ttUnits: '"',
    acis: {vX:4, vN:0, reduce:'sum'}}],
  ['snow', {
    label:'Maximum Daily Snowfall',
    yLabel: 'Inches', ttUnits: '"',
    acis: {vX:10, vN:0, reduce:'max'}}],
  ['snwd', {
    label:'Maximum Daily Snowdepth',
    yLabel: 'Inches', ttUnits: '"',
    acis: {vX:11, vN:0, reduce:'max'}}],
// StnTemp
  ['maxt', {
    label:'Maximum Temperature',
    yLabel: 'Temperature', ttUnits: '°',
    acis: {vX:1, vN:0, reduce:'mean'}}],
  ['mint', {
    label:'Minimum Temperature',
    yLabel: 'Temperature', ttUnits: '°',
    acis: {vX:2, vN:0, reduce:'mean'}}],
  ['avgt', {
    label:'Average Temperature',
    yLabel: 'Temperature', ttUnits: '°',
    acis: {vX:43, vN:0, reduce:'mean'}}],
  ['gdd50', {
    label:'Growing Degree-Day Accumulation',
    yLabel: 'Degree-Day', ttUnits: '',
    acis: {vX:44, vN:0, base:50, reduce:'sum'}}],
  ['hdd65', {
    label:'Heating Degree-Day Accumulation',
    yLabel: 'Degree-Day', ttUnits: '',
    acis: {vX:45, vN:0, base:65, reduce:'sum'}}],
  ['cdd65', {
    label:'Cooling Degree-Day Accumulation',
    yLabel: 'Degree-Day', ttUnits: '',
    acis: {vX:44, vN:0, base:65, reduce:'sum'}}],
// StnTDays
  ['tx90', {
    label:'Days with Maximum Temperature Above 90°',
    yLabel: 'Days', ttUnits: '',
    acis: {vX:1, vN:0, reduce:'cnt_gt_90'}}],
  ['tx95', {
    label:'Days with Maximum Temperature Above 95°',
    yLabel: 'Days', ttUnits: '',
    acis: {vX:1, vN:0, reduce:'cnt_gt_95'}}],
  ['tx100', {
    label:'Days with Maximum Temperature Above 100°',
    yLabel: 'Days', ttUnits: '',
    acis: {vX:1, vN:0, reduce:'cnt_gt_100'}}],
  ['tn0', {
    label:'Days with Minimum Temperature Below 0°',
    yLabel: 'Days', ttUnits: '',
    acis: {vX:2, vN:0, reduce:'cnt_lt_0'}}],
  ['tn32', {
    label:'Days with Minimum Temperature Below 32°',
    yLabel: 'Days', ttUnits: '',
    acis: {vX:2, vN:0, reduce:'cnt_lt_32'}}],
// StnPDays
  ['prcp_1', {
    label:'Days with Precipitation > 1"',
    yLabel: 'Days', ttUnits: '',
    acis: {vX:4, vN:0, reduce:'cnt_gt_1'}}],
  ['prcp_2', {
    label:'Days with Precipitation > 2"',
    yLabel: 'Days', ttUnits: '',
    acis: {vX:4, vN:0, reduce:'cnt_gt_2'}}],
  ['prcp_4', {
    label:'Days with Precipitation > 4"',
    yLabel: 'Days', ttUnits: '',
    acis: {vX:4, vN:0, reduce:'cnt_gt_4'}}],
  ['snwd_1', {
    label:'Days with Snow Depth > 1"',
    yLabel: 'Days', ttUnits: '',
    acis: {vX:11, vN:0, reduce:'cnt_gt_1'}}],
// StnFrost
  ['grow_32', {
    label:'Growing Season Length (above 32°)',
    yLabel: 'Days', ttUnits: '',
    acis: {vX:2, vN:0, reduce:{reduce:'run_gt_32', n:1}}}],
]);


// "elems":[{"name":"maxt","interval":[1,0,0],"duration":"std","season_start":"07-30","reduce":"run_gt_40"}]}

export function parseURL(pStr) {
  let pFields = pStr.split('/');
  if (!chartDefs.has(pFields[0])) {
    pFields = 'StnTemp/maxt/ANN/HCN00304174/'.split('/');
  }
  const def = chartDefs.get(pFields[0]);
  let params = {
    chart: pFields[0],
    element: pFields[1],
    season: pFields[2],
    sid: pFields[3],
    bbox: pFields[4]
  };
  validateParams(def,params);
  return params;
}

function validateParams(def,params) {
  if (def.elems.indexOf(params.element) == -1) { params.element = def.elems[0]}
  if (def.seasons.indexOf(params.season) == -1) { params.season = def.seasons[0]}
}

const allSeasons = [ ...seasons.keys()];

export const chartDefs = new Map([
  ['StnTemp', {
      title: 'Station Temp',
      elems: ['maxt', 'mint', 'avgt', 'gdd50', 'hdd65', 'cdd65'],
      seasons: allSeasons
  }],
  ['StnPrcp',{
    title: 'Station Prcp',
    elems: ['pcpn','snow','snwd'],
    seasons: allSeasons
  }],
  ['StnTDays',{
    title: 'Station Temp-Days',
    elems: ['tx90','tx95','tx100',
            'tn0','tn32',
            // 'tx90_3','tx95_3','tx100_3',
            // 'tn0_3','tn32_3',
            // 'tx90_run', 'tx95_run', 'tx100_run', 'tn0_run', 'tn32_run'
           ],
    seasons: allSeasons
  }],
  ['StnPDays',{
    title: 'Station Prcp-Days',
    elems:['prcp_1', 'prcp_2', 'prcp_4', 'snwd_1',
           // 'prcp_lt01_run','prcp_lt1_run'
          ],
    seasons: allSeasons
  }],
  ['StnFrost',{
    title: 'Station Frost',
    elems:['grow_32'],
    seasons: ['ANN']
  }],
]);

chartDefs.forEach((def,chart) => {
  def.validateParams = (params) => {
    validateParams(def,params);
  };
  def.toString = (p) => {
    return [p.chart,p.element,p.season,p.sid,p.bbox].join('/');
  };
});


