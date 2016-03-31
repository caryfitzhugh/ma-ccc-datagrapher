import {
    INVALIDATE_PARAM,
    UPDATE_PARAM,
    REQUEST_DATA,
    SET_RESULT,
    SET_YEAR,
    SHOW_INFO,
    INSERT_PANEL,
    DELETE_PANEL,
    UPDATE_URL,
    QUERY_TO_PARAMS,
  } from '../constants/actionTypes';
import createReducer from './create-reducer';
import { chartDefs, parseURL, correctParam } from '../api';

/*
  State has:
    panels (see below)
    nextKey (integer)
    query (array)
    locationValid: boolean
    showInfo: boolean
    hoverYear: integer
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
  nextKey: 1,
  locationValid: true,
  hoverYear: 0,
  showInfo: false,
  query: [],
};

const actionHandlers = {
  [INVALIDATE_PARAM]: (state, action) => {
    let { panels } = state;
    const { key, param } = action.payload,
      cPanel = panels.get(key);
    if (!cPanel) return state;

    let nPanel = {...cPanel}
    panels = new Map([...panels]);

    if (!cPanel.ready) nPanel.param = correctParam(param);
    else nPanel = { ...cPanel, param: correctParam(param), prevParam: cPanel.param, ready: false };
    panels.set(key, nPanel);
    return {...state, panels };
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

  [SET_YEAR]: (state, action) => {
    const { hoverYear } = state;
    const year = action.payload.year;
    if (year == hoverYear) return state;
    return {...state, hoverYear:year};
  },

  [SHOW_INFO]: (state, action) => {
    let { showInfo } = state;
    return {...state, showInfo:!showInfo};
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

  [UPDATE_URL]: (state, action) => {
    return {...state, ...action.payload }
  },

  [QUERY_TO_PARAMS]: (state, action) => {
    let {panels, nextKey} = state,
      newPanels = new Map(), noChange=true, valid=true;
    let query = action.payload.query;

    const panelIter = panels.entries();
    query.forEach((qStr) => {
      const p = panelIter.next(),
          qParam = parseURL(qStr),
          nParam = correctParam(qParam);
          if (nParam !== qParam) valid = false;
      if (!p.done) {
        const [key, panel] = p.value,
            pStr = chartDefs.get(panel.param.chart).toString(panel.param);
        if (qStr == pStr) {
          newPanels.set(key,panel);
        } else {
          noChange = false;
          newPanels.set(key,{param: nParam, result: {}, ready: false});
        }
      } else {
        noChange = false;
        newPanels.set(nextKey++,{ param: nParam, result: {}, ready: false });
      }
    })

    if (noChange && panelIter.next().done) return state;
    return { ...state, panels: newPanels, nextKey, query, locationValid: valid};
  }
};

export default createReducer(initialState, actionHandlers);
