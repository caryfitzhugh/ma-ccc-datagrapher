// var Acetate_terrain = L.tileLayer('http://a{s}.acetate.geoiq.com/tiles/terrain/{z}/{x}/{y}.png', {
//   attribution: '&copy;2012 Esri & Stamen, Data from OSM and Natural Earth',
//   subdomains: '0123',
//   minZoom: 2,
//   maxZoom: 18
// });

import React, { Component, PropTypes } from 'react';
import 'leaflet';
require('style-loader!css-loader!../../node_modules/leaflet/dist/leaflet.css');
import styles from "./App.css";

const position = [43,-76];

export default class MiniMap extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
      title: ''
    };
  }

  static propTypes = {
    // showGeom: PropTypes.string.isRequired,
    geom: PropTypes.object.isRequired,
    bbox: PropTypes.any.isRequired,
    sid: PropTypes.string.isRequired,
    update: PropTypes.func.isRequired,
  }

  updateSid() {
    const sid = this.props.sid;
    this.layer.setStyle((f) => ({
      fillColor: f.id == sid ? 'blue' : 'darkgrey',
    }));
    this.layer.eachLayer((l) => {
      if (l.feature.id == sid) {
        l.bringToFront();
      }
    });
  }

  updateLayer() {
    const sid = this.props.sid;
    const fl = this.layer = L.geoJson(this.props.geom,{
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
      filter(f) {return true;},
      style(f) {return {fillColor: f.id == sid ? 'blue' : 'darkgrey'}}
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
    this.map = L.map(React.findDOMNode(this.refs.map), {
    center: position,
    zoom: 5.6
    });
    L.tileLayer('http://a{s}.acetate.geoiq.com/tiles/terrain/{z}/{x}/{y}.png',
      {subdomains: '0123', minZoom: 5.6, maxZoom: 10}).addTo(this.map);
    this.updateLayer();
    this.updateSid();
  }

  componentWillUnmount() {
    this.map.removeEventListener();
    this.map = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.sid != this.props.sid) {
      this.updateSid();
    }
  }

  render() {
    const title = this.state.title;
    return (
      <div>
        <div>{title}</div>
        <div ref='map' className={styles.miniMap} ></div>
      </div>
    );
  }
}
