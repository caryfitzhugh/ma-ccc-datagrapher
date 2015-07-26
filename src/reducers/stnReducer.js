import {
    SET_STATIONS,
    SHOW_STATIONS,
    SET_RESULTS,
    SET_PARAMS,
  } from '../constants/stnActionTypes';
import createReducer from './create-reducer';

const stations = new Map(), stnList = [];

require('../hcnstns.json').features.forEach(
  (f) => {
    stations.set(f.id, f.properties);
    stnList.push(f.id);
  }
);

stnList.sort((s1, s2) => {return s1 < s2 ? -1 : s1 > s2 ? 1 : 0; });


const initialState = {
  stations,
  shownStns: stnList,
  params: new Map([
    ['sid', 'USH00300042'],
    ['element', 'pcpn'],
    ['season', 'ANN']
  ]),
  results: {}
};

const actionHandlers = {
  [SET_STATIONS]: (state, action) => ({stations: action.payload.stations}),
  [SHOW_STATIONS]: (state, action) => ({shownStns: action.payload.shownStns}),
  [SET_RESULTS]: (state, action) => ({results: action.payload.results}),
  [SET_PARAMS]: (state, action) => ({params: action.payload.params})
};

export default createReducer(initialState, actionHandlers);
