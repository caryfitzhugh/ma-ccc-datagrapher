import {
    REQUEST_GEOMDATA,
    SET_GEOJSON,
  } from '../constants/actionTypes';

import createReducer from './create-reducer';

/*
  State includes:
    stn, state, county, basin: {
      geojson
      meta
      readyState
    }
*/
const initialState = {};

const actionHandlers = {
  [REQUEST_GEOMDATA]: (state, action) => {
    const { geoType } = action.payload;
    return {...state, ...{[geoType]: {readyState: 'loading'}}}
  },

  [SET_GEOJSON]: (state, action) => {
    const {geoType, geojson} = action.payload;
    if (geojson) {
      let meta = new Map(), items = [];
      items = geojson.features.map( (f) => [f.id,f.properties] );
      items.sort((f1,f2) => {
        const n1 = f1[1].name, n2 = f2[1].name;
        return n1 < n2 ? -1 : n1 > n2 ? 1 : 0;
      });
      meta = new Map(items);
      return {...state, ...{[geoType]: {geojson, meta, readyState: 'ready'}}};
    }
    else {
      return {...state, ...{[geoType]: {readyState: 'error'}}};
    }
  }
};

export default createReducer(initialState, actionHandlers);

