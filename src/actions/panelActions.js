import 'whatwg-fetch'


import { fetchGeom } from './geomActions';
import { buildQuery, updateSid, haveSameResults } from '../api';

import { StnData, GridData} from 'context';
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
  return (dispatch, getState) => {
    dispatch(updateURL(query));
    const loc = window.location.pathname+'?c='+query.join('&c=');
    // ALWAYS replaceState
    history.pushState(null,loc);
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
        credentials: 'include',
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

      const url1 = `https://repository.staging.nescaum-ccsc-dataservices.com/data/ma/datagrapher/observed_${nParam.element}_${nParam.season}`,
            url2 = `https://repository.staging.nescaum-ccsc-dataservices.com/data/ma/datagrapher/projected_${nParam.element}_${nParam.season}`

      /*const url1 = `http://localhost:4000/data/ma/datagrapher/observed_${nParam.element}_${nParam.season}`,
            url2 = `http://localhost:4000/data/ma/datagrapher/projected_${nParam.element}_${nParam.season}`
      */

      const req1 = fetch(url1,{
          method:'get',
          credentials: 'include',
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
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(checkStatus)
        .then(res => res.json())
        .catch(error => {return {error};});

      req = Promise.all([req1,req2])
        .then(res => {
          if (nParam.season == "DJF") {
            let first_data = Object.values(res[1].data[0][1]);
            let all_zero = true;
            first_data.forEach((row) => {
              all_zero = all_zero && row[0] === 0 && row[1] === 0 && row[1] === 0;
            });

            if (all_zero) {
              console.log("Dropping first datapoint of 0,0,0 on winter");
              res[1].data.shift();
            }
          }
          return {data:res[0].data,proj:res[1].data};
        });
    }
    req.then(res => {
      return dispatch(setResult(key,nParam,res));
    });
  }
}
