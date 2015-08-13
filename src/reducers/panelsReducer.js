import {
    SET_RESULT,
    SET_PRODUCT,
    INSERT_PANEL,
    DELETE_PANEL,
    RECONCILE_PARAMS,
    SET_PARAMS,
  } from '../constants/actionTypes';
import createReducer from './create-reducer';
import { chartDefs, parseURL } from '../constants/stn';

/*
  Each panel state contains:
    param: {
      chart,
      geom,
      element,
      season,
      sid,
      bbox
    }
    results: {
      new: flag to trigger fetch
      meta,
      data
    }
    readyState: one of ['updated','valid','loading','ready']
*/
const initialState = {
  panels: new Map(),
  nextKey: 1
};

const actionHandlers = {
  [SET_RESULT]: (state, action) => {
    let { panels } = state;
    const { key, param, result } = action.payload,
      cPanel = panels.get(key);
    if (!cPanel) return state;

    panels = new Map([...panels]);
    panels.set(key,{ param, result });
    return {...state, panels};
  },

  [SET_PRODUCT]: (state, action) => {
    let { panels } = state;
    const { key, product } = action.payload,
      cPanel = panels.get(key),
      def = chartDefs.get(product);
    if (!cPanel) return state;
    if (!def) return state;

    var param = { ...cPanel.param, chart:product };
    def.validateParams(param);
    panels = new Map([...panels]);
    panels.set(key,{ param, result: {new:1} });
    return {...state, panels};
  },

  [INSERT_PANEL]: (state, action) => {
    let {panels, nextKey} = state;
    const dupKey = action.payload.key, newPanels = new Map();
    panels.forEach((val,key) => {
      newPanels.set(key,val);
      if (key == dupKey) {
        newPanels.set(nextKey,val);
        nextKey++;
      }
    });
    return {panels:newPanels, nextKey};
  },

  [DELETE_PANEL]: (state, action) => {
    const delKey = action.payload.key,
      panels = new Map();
    state.panels.forEach((val,key) => {
      if (key != delKey) panels.set(key,val);
    });
    return {...state, panels};
  },

  [RECONCILE_PARAMS]: (state, action) => {
    let {panels, nextKey} = state,
      newPanels = new Map(), noChange=true, idx=0;
    let query = action.payload.query;
    if (!query) { query = []; }
    if (!Array.isArray(query)) query = [query];

    panels.forEach((val,k) => {
      const pStr = chartDefs.get(val.param.chart).toString(val.param);
      if (query[idx++] != pStr ) noChange=false;
    })
    if ( noChange && query.length == panels.size ) return state;

    query.forEach((q) => {
      let found = false;
      panels.forEach((val,k) => {
        const pStr = chartDefs.get(val.param.chart).toString(val.param);
        if (pStr == q && !newPanels.has(k)) {
          newPanels.set(k,val);
          found = true;
        }
      });
      if (!found) newPanels.set(nextKey++,{ param: parseURL(q), result: {new:1} });
    })
    return { panels: newPanels, nextKey };
  }
};

export default createReducer(initialState, actionHandlers);
