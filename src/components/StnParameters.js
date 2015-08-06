import React, { PropTypes } from 'react';
import {seasons,elems} from '../constants/stn';

export default class StnParameters extends React.Component {
  static propTypes = {
    stations: PropTypes.object.isRequired,
    shownStns: PropTypes.array.isRequired,
    shownSeasons: PropTypes.array.isRequired,
    update: PropTypes.func.isRequired,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.handleStation = ::this.handleStation
    this.handleElement = ::this.handleElement
    this.handleSeason = ::this.handleSeason
  }

  render() {
    const stations = this.props.stations;
    const stnOptions = this.props.shownStns.map((sid) => 
      ( <option key={sid} value={sid}>{stations.get(sid).name}</option>));

    let seasonField;
    if (this.props.shownSeasons.length > 1) {
      const seasonOptions = this.props.shownSeasons.map((s) => (
        <option key={s} value={s}>{seasons.get(s)}</option>
      ));
      seasonField = (
        <fieldset style={{border:"none"}} >
          <label style={{display:"block", margin:"5px 0px"}} >Season: </label>
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

        <fieldset style={{border:"none"}} >
          <label style={{display:"block", margin:"5px 0px"}} >Station: </label>
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

