import React, { PropTypes } from 'react';
import {geoms,seasons,elems} from '../constants/stn';

export default class StnParameters extends React.Component {
  static propTypes = {
    geomType: PropTypes.string.isRequired,
    meta: PropTypes.object,
    shownSeasons: PropTypes.array.isRequired,
    update: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)

    this.handleGeom = ::this.handleGeom
    this.handleStation = ::this.handleStation
    this.handleElement = ::this.handleElement
    this.handleSeason = ::this.handleSeason
  }

  render() {
    const meta = this.props.meta;

    const geomOptions = [];
    geoms.forEach((title,g) => {
      geomOptions.push(<option key={g} value={g}>{title}</option>);
    });

    const stnOptions = [];
    if (meta) meta.forEach((info,sid) => {
      stnOptions.push(<option key={sid} value={sid}>{info.name}</option>);
    });

    let seasonField;
    if (this.props.shownSeasons.length > 1) {
      const seasonOptions = this.props.shownSeasons.map((s) => (
        <option key={s} value={s}>{seasons.get(s).title}</option>
      ));
      seasonField = (
        <fieldset style={{border:"none"}} >
          <label style={{display:"inline", margin:"5px 0px"}} >Season: </label>
          <select
            value={this.props.season}
            onChange={this.handleSeason}
          >
            {seasonOptions}
          </select>
        </fieldset>
      );
    }

    const elemOptions = this.props.shownElems.map((elem) => 
      (<option key={elem} value={elem}>{elems.get(elem).label}</option>));

    return (
      <div className="row">

        <fieldset style={{border:"none", margin:"25px 0px 5px 0px"}} >
          <select
            value={this.props.geomType}
            onChange={this.handleGeom}
          >
            {geomOptions}
          </select>
          <select
            value={this.props.sid}
            onChange={this.handleStation}
           >
            {stnOptions}
          </select>
        </fieldset>

        <fieldset style={{border:"none"}} >
          <label style={{display:"block", margin:"5px 0px"}} >Element: </label>
          <select
            value={this.props.element}
            onChange={this.handleElement}
          >
            {elemOptions}
          </select>
        </fieldset>

        {seasonField}

      </div>
    )
  }

  handleGeom(evt) {
    this.props.update({geom:evt.target.value});
  }

  handleStation(evt) {
    this.props.update({sid:evt.target.value});
  }

  handleElement(evt) {
    this.props.update({element:evt.target.value});
  }

  handleSeason(evt) {
    this.props.update({season:evt.target.value});
  }

}

