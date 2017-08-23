import 'whatwg-fetch'


import { fetchGeom } from './geomActions';
import { buildQuery, updateSid, haveSameResults } from '../api';

import { StnData, GridData, BasePath } from 'context';
import {
    INVALIDATE_PARAM,
    UPDATE_PARAM,
    SHOW_INFO,
    SET_YEAR,
    INSERT_PANEL,
    DELETE_PANEL,
    QUERY_TO_PARAMS,
    REQUEST_DATA,
    SET_RESULT,
    UPDATE_URL,
  } from '../constants/actionTypes';


export function invalidateParam(key, param) {
  return {
    type: INVALIDATE_PARAM,
    payload: { key, param }
  };
}

export function updateParam(key, param) {
  return {
    type: UPDATE_PARAM,
    payload: { key, param }
  };
}

export function showInfo() {
  return {
    type: SHOW_INFO,
    payload: {show: true}
  };
}

export function setYear(year) {
  return {
    type: SET_YEAR,
    payload: {year}
  };
}

export function insertPanel(key) {
  return {
    type: INSERT_PANEL,
    payload: {key}
  }
}

export function deletePanel(key) {
  return {
    type: DELETE_PANEL,
    payload: {key}
  }
}

export function changeQueryToParams(query) {
  return {
    type: QUERY_TO_PARAMS,
    payload: {query}
  }
}

function requestData(key) {
  return {
    type: REQUEST_DATA,
    payload: { key }
  };
}

export function setResult(key, param, result) {
  return {
    type: SET_RESULT,
    payload: { key, param, result }
  };
}

function updateURL(query) {
  return {
    type: UPDATE_URL,
    payload: {query}
  }
}

export function maybeUpdateURL(history,query) {
  // check to see if current query is valid
  //   if valid pushState else replaceState
  return (dispatch, getState) => {
    const cQuery = getState().panels.query, qValid = getState().panels.locationValid;
    if ((query.length == cQuery.length) && cQuery.every((e,i)=> query[i] == e)) {
      return;
    }

    dispatch(updateURL(query));
    const loc = BasePath+'?c='+query.join('&c=');
    if (qValid) history.pushState(null,loc)
    else history.replaceState(null,loc)
  }
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export function fetchResults(key) {
  return (dispatch, getState) => {
    const panel = getState().panels.panels.get(key);
    if (!panel || panel.ready) return;

    const param = panel.param
    // check that geom is loaded
    const geomInfo = getState().geoms[param.geom];
    if (!geomInfo) {
      return dispatch(fetchGeom(param.geom));
    }
    if (!geomInfo.ready) return;

    const nParam = updateSid(param, panel.prevParam, getState().geoms);
    if (nParam !== param) dispatch(updateParam(key,nParam))

    // check for data in another panel
    if (haveSameResults(nParam, panel.prevParam)) {
      return dispatch(setResult(key,nParam,panel.result));
    }

    let done = false;
    getState().panels.panels.forEach((val,k) => {
      if (!done && val.ready && haveSameResults(nParam,val.param)) {
        dispatch(setResult(key,nParam,val.result));
        done = true;
      }
    })

    if (done || panel.request) return;

    dispatch(requestData(key));

    let req;
    if (nParam.geom == 'stn') {
      const reqParams = buildQuery(nParam, geomInfo.meta.get(nParam.sid));
      req = fetch(StnData,{
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqParams)
      })
      .then(checkStatus)
      .then(res => res.json());
    } else {
      const url1 = 'https://s3.amazonaws.com/nyccsc-cache.nrcc.cornell.edu/prism/'+
        nParam.geom+'/'+nParam.element+'_'+nParam.season,
        url2 = 'https://s3.amazonaws.com/nyccsc-cache.nrcc.cornell.edu/narccap/'+
        nParam.geom+'/'+nParam.element+'_'+nParam.season;

      const req1 = fetch(url1,{
          method:'get',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(checkStatus)
        .then(res => res.json())
        .catch(error => {return {error};});

      const req2 = fetch(url2,{
          method:'get',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(checkStatus)
        .then(res => res.json())
        .catch(error => {return {error};});

      req = Promise.all([req1,req2])
        .then(res => {return {data:res[0].data,proj:res[1].data};});
    }
    req.then(res => {
      return dispatch(setResult(key,nParam,res));
    });
  }
}
