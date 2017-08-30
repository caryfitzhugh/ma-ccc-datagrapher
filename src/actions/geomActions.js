import 'whatwg-fetch'

import {
    REQUEST_GEOMDATA,
    SET_GEOJSON,
  } from '../constants/actionTypes';

export function setGeoJson(geoType,geojson) {
  return {
    type: SET_GEOJSON,
    payload: {
      geoType,
      geojson
    }
  };
}

export function requestGeoData(geoType) {
  return {
    type: REQUEST_GEOMDATA,
    payload: {
      geoType
    }
  };
}

function transformToGeoJSON(res) {
  const out = {type:'FeatureCollection'};

  out.features = res.meta.map((f) => {
    return {
        type: 'Feature',
        id: f.id,
        properties: {
          name: f.name,
          id: f.id,
          bbox: f.bbox
        },
        geometry: f.geojson.geometry
      }
  });
  return out;
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

export function fetchGeom(geoType) {

  return (dispatch, getState) => {
    dispatch(requestGeoData(geoType));

    fetch('./data/'+geoType+'.json',{
      credentials: 'include',
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then(checkStatus)
    .then(res => res.json())
    .catch(function(error) {
      console.log('request failed', error)
    })
    .then(res => {
      if (geoType == 'stn') return dispatch(setGeoJson(geoType,res));
      return dispatch(setGeoJson(geoType,transformToGeoJSON(res)));
    });
  }
}
