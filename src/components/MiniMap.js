// var Acetate_terrain = L.tileLayer('http://a{s}.acetate.geoiq.com/tiles/terrain/{z}/{x}/{y}.png', {
//   attribution: '&copy;2012 Esri & Stamen, Data from OSM and Natural Earth',
//   subdomains: '0123',
//   minZoom: 2,
//   maxZoom: 18
// });

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import 'leaflet';
require('style-loader!css-loader!../../node_modules/leaflet/dist/leaflet.css');
import styles from "./App.css";

const position = [42.2373,-71.5314];

export default class MiniMap extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
      title: ''
    };
  }

  static propTypes = {
    // showGeom: PropTypes.string.isRequired,
    geomType: PropTypes.string.isRequired,
    geoJSON: PropTypes.object,
    bbox: PropTypes.any.isRequired,
    sid: PropTypes.string.isRequired,
    update: PropTypes.func.isRequired,
  }

  updateSid() {
    const sid = this.props.sid;
    const isPoint = this.props.geomType == 'stn';
    this.layer.setStyle((f) => (isPoint ? {
        fillColor: f.id == sid ? 'blue' : 'black',
        opacity: 0.0,
        fillOpacity: 0.5,
        color: 'black'
      } : {
        fillColor: f.id == sid ? 'blue' : 'lightgrey',
        weight: 1.5,
        opacity: 0.6,
        fillOpacity: 0.4,
        color: 'black'
    }));
    this.layer.eachLayer((l) => {
      if (l.feature.id == sid) {
        l.bringToFront();
      }
    });
  }

  updateLayer() {
    const sid = this.props.sid;
    if (this.layer && this.map.hasLayer(this.layer)) {
      this.map.removeLayer(this.layer);
    }
    this.geomType = this.props.geomType;
    const isPoint = this.geomType == 'stn';

    const fl = this.layer = L.geoJson(this.props.geoJSON,{
      pointToLayer: (geojson, latlng) =>
        new L.CircleMarker(latlng,
          {
            radius:5,
            fillColor: 'darkgrey',
            fillOpacity: 1.0,
            stroke: false,
            fill: true
          }
        ),
      filter: (f) => (true),
      style: (f) => (isPoint ? {
          fillColor: f.id == sid ? 'blue' : 'black',
          opacity: 0.0,
          fillOpacity: 0.5,
          color: 'black'
        } : {
          fillColor: f.id == sid ? 'blue' : 'lightgrey',
          weight: 1.5,
          opacity: 0.6,
          fillOpacity: 0.4,
          color: 'black'
      })
    });

    fl.on('mouseover', (e) => {
      this.setState({title: e.layer.feature.properties.name})
    });
    fl.on('mouseout', (e) => {
      this.setState({title: ''})
    });
    fl.on('click', (e) => {
      this.props.update(e.layer.feature.id, '');
    })
    fl.addTo(this.map);
  }

  componentDidMount() {
    this.map = L.map(ReactDOM.findDOMNode(this.refs.map), {
    center: position,
    zoom: 6.5
    });

    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
      {subdomains: 'abcd', minZoom: 5.6, maxZoom: 10, opacity: 0.3}).addTo(this.map);
    if (this.props.geoJSON) {
      this.updateLayer();
      this.updateSid();
    }
  }

  componentWillUnmount() {
    this.map.removeEventListener();
    this.map = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.geoJSON && this.geomType != this.props.geomType) {
      this.updateLayer();
      this.updateSid();
    } else {
      if (prevProps.sid != this.props.sid) this.updateSid();
    }
  }

  render() {
    const title = this.state.title;
    return (
      <div>
        <div className={styles.miniMapTitle} >{title}</div>
        <div ref='map' className={styles.miniMap} ></div>
      </div>
    );
  }
}
