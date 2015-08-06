import 'whatwg-fetch'

import {
    APPEND_PANEL,
    INSERT_PANEL,
    DELETE_PANEL,
    RECONCILE_PARAMS,
    SET_PARAMS,
    SET_STATIONS,
    SET_RESULT,
    SET_PRODUCT
  } from '../constants/actionTypes';

import {elems} from '../constants/stn';

let StnData = require('context').StnData;

export function setStations(stations) {
  return {
    type: SET_STATIONS,
    payload: {
      stations
    }
  };
}

export function appendPanel(param) {
  return {
    type: APPEND_PANEL,
    payload: {param}
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

export function fetchStnResults(key,param) {
  console.log('fetchStnResults '+key+' '+param);

  return (dispatch, getState) => {
    console.log('start Fetch');
    dispatch(setResult(key,param,{}));
    const { chart, element, season, sid } = param;
    const stn = getState().geoms.hcnstns.get(sid);

    const {label:elemLabel, acis} = elems.get(element);
    let reqParams = {edate: 'por', sid: stn.ghcn},
        p = {
          ANN: [{interval:[1],duration:1,maxmissing:30}, [1900]],
          MAM: [{interval:[1,0],duration:3,maxmissing:10}, [1900,5]],
          JJA: [{interval:[1,0],duration:3,maxmissing:10}, [1900,8]],
          SON: [{interval:[1,0],duration:3,maxmissing:10}, [1900,11]],
          DJF: [{interval:[1,0],duration:3,maxmissing:10}, [1900,2]],
          Jan: [{interval:[1,0],duration:1,maxmissing:3}, [1900,1]],
          Feb: [{interval:[1,0],duration:1,maxmissing:3}, [1900,2]],
          Mar: [{interval:[1,0],duration:1,maxmissing:3}, [1900,3]],
          Apr: [{interval:[1,0],duration:1,maxmissing:3}, [1900,4]],
          May: [{interval:[1,0],duration:1,maxmissing:3}, [1900,5]],
          Jun: [{interval:[1,0],duration:1,maxmissing:3}, [1900,6]],
          Jul: [{interval:[1,0],duration:1,maxmissing:3}, [1900,7]],
          Aug: [{interval:[1,0],duration:1,maxmissing:3}, [1900,8]],
          Sep: [{interval:[1,0],duration:1,maxmissing:3}, [1900,9]],
          Oct: [{interval:[1,0],duration:1,maxmissing:3}, [1900,10]],
          Nov: [{interval:[1,0],duration:1,maxmissing:3}, [1900,11]],
          Dec: [{interval:[1,0],duration:1,maxmissing:3}, [1900,12]],
        }[season];
    let elem = {...p[0], ...acis};
    reqParams.elems = [elem];
    reqParams.sdate = p[1];
    fetch(StnData,{
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

