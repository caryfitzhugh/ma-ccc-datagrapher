import 'whatwg-fetch'


import { fetchGeom } from './geomActions';
import { buildQuery, validateParam, haveSameResults } from '../api';

import { StnData, GridData } from 'context';
import {
    INVALIDATE_PARAM,
    UPDATE_PARAM,
    INSERT_PANEL,
    DELETE_PANEL,
    QUERY_TO_PARAMS,
    REQUEST_DATA,
    SET_RESULT,
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

    const nParam = validateParam(param, panel.prevParam, getState().geoms);
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
    const reqParams = buildQuery(nParam, geomInfo.meta.get(nParam.sid));
    const url = nParam.geom == 'stn' ? StnData : GridData;

    fetch(url,{
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqParams)
    })
    .then(checkStatus)
    .then(res => {
      console.log('finish Fetch');
      return res.json();
    })
    .then(res => {
      return dispatch(setResult(key,nParam,res));
    })
    .catch(function(error) {
      console.log('request failed', error)
    });
  }
}

