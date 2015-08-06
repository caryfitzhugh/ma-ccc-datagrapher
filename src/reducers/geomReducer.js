import {
    SET_STATIONS,
    SHOW_STATIONS,
  } from '../constants/actionTypes';
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
  hcnstns: stations,
  shownStns: stnList,
};

const actionHandlers = {
  [SET_STATIONS]: (state, action) => ({hcnstns: action.payload.stations}),
  [SHOW_STATIONS]: (state, action) => ({shownStns: action.payload.shownStns}),
};

export default createReducer(initialState, actionHandlers);
