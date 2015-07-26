
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
  ['pcpn', {label:'Total Precipitation', vX:4, vN:0, reduce:'sum'}],
  ['snow', {label:'Maximum Daily Snowfall', vX:10, vN:0, reduce:'max'}],
  ['snwd', {label:'Maximum Daily Snowdepth', vX:11, vN:0, reduce:'max'}],
  ['maxt', {label:'Maximum Temperature', vX:1, vN:0, reduce:'mean'}],
  ['mint', {label:'Minimum Temperature', vX:2, vN:0, reduce:'mean'}],
  ['avgt', {label:'Average Temperature', vX:43, vN:0, reduce:'mean'}],
]);

