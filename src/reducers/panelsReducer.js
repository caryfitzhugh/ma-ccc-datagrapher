import {
    INVALIDATE_PARAM,
    UPDATE_PARAM,
    REQUEST_DATA,
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
    result: {
      meta,
      data
    }
    ready: boolean
    request: boolean
    prevParam: optional {}

*/
const initialState = {
  panels: new Map(),
  nextKey: 1
};

const actionHandlers = {
  [INVALIDATE_PARAM]: (state, action) => {
    let { panels } = state;
    const { key, param } = action.payload,
      cPanel = panels.get(key);
    if (!cPanel) return state;

    let nPanel = {...cPanel}
    panels = new Map([...panels]);

    if (!cPanel.ready) nPanel.param = param;
    else nPanel = { ...cPanel, param, prevParam: cPanel.param, ready: false };
    panels.set(key, nPanel);
    return {...state, panels};
  },

  [UPDATE_PARAM]: (state, action) => {
    let { panels } = state;
    const { key, param } = action.payload,
      cPanel = panels.get(key);
    if (!cPanel) return state;

    panels = new Map([...panels]);
    panels.set(key,{ ...cPanel, param });
    return {...state, panels};
  },

  [REQUEST_DATA]: (state, action) => {
    let { panels } = state;
    const { key } = action.payload,
      cPanel = panels.get(key);
    if (!cPanel) return state;

    panels = new Map([...panels]);
    panels.set(key,{ ...cPanel, request: true});
    return {...state, panels};
  },

  [SET_RESULT]: (state, action) => {
    let { panels } = state;
    const { key, param, result } = action.payload,
      cPanel = panels.get(key);
    if (!cPanel) return state;

    panels = new Map([...panels]);
    panels.set(key,{ param, result, ready: true });
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
    // if (!query) { query = []; }
    if (!query) { query = ['Temp/stn/maxt/ANN/USH00300042/']; }
    if (!Array.isArray(query)) query = [query];

    panels.forEach((panel,key) => {
      const pStr = chartDefs.get(panel.param.chart).toString(panel.param),
        q = query[idx++];
      if (q == pStr) {
        newPanels.set(key,panel);
      } else {
        noChange=false;
        newPanels.set(key,{param: parseURL(q), result: {}, ready: false})
      }
    })
    if ( noChange && query.length == panels.size ) return state;

    for (; idx < query.length; idx++) {
      newPanels.set(nextKey++,{ param: parseURL(query[idx]), result: {}, ready: false });
    }

    return { ...state, panels: newPanels, nextKey};
  }
};

export default createReducer(initialState, actionHandlers);
