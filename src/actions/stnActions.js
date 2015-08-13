import 'whatwg-fetch'

import {
    INSERT_PANEL,
    DELETE_PANEL,
    RECONCILE_PARAMS,
    SET_PARAMS,
    SET_RESULT,
    SET_PRODUCT
  } from '../constants/actionTypes';

import { fetchGeom } from './geomActions';
import { buildQuery } from '../constants/stn';

import { StnData, GridData } from 'context';

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

export function reconcileQuery(query) {
  return {
    type: RECONCILE_PARAMS,
    payload: {query}
  }
}

export function setChartType(key, product) {
  return {
    type: SET_PRODUCT,
    payload: { key, product }
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

export function fetchResults(key,param) {
  return (dispatch, getState) => {
    const { geom, sid } = param;
    // check that geom is loaded
    const geomInfo = getState().geoms[geom];
    if (!geomInfo) {
      return dispatch(fetchGeom(geom));
    }
    if (geomInfo.readyState == 'loading') {
      return;
    }
    dispatch(setResult(key,param,{}));

    const reqParams = buildQuery(param, geomInfo.meta.get(sid));
    const url = geom == 'stn' ? StnData : GridData;

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
      return dispatch(setResult(key,param,res));
    })
    .catch(function(error) {
      console.log('request failed', error)
    });
  }
}

