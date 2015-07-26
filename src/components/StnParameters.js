import React, { PropTypes } from 'react';
import {seasons,elems} from '../constants/stn';

export default class StnParameters extends React.Component {
  static propTypes = {
    station: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
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
    const s = this.props.station, params = this.props.params;
    const stations = s.stations;
    const stnOptions = s.shownStns.map((sid) => 
      ( <option key={sid} value={sid}>{stations.get(sid).name}</option>));

    const seasonOptions = [];
    seasons.forEach((v,k) => {seasonOptions.push(<option key={k} value={k}>{v}</option>)});

    const elemOptions = this.props.shownElems.map((elem) => 
      (<option key={elem} value={elem}>{elems.get(elem).label}</option>));

    return (
      <div className="row">

        <fieldset style={{border:"none"}} >
          <label style={{display:"block", margin:"5px 0px"}} >Station: </label>
          <select
            value={params.sid}
            onChange={this.handleStation}
           >
            {stnOptions}
          </select>
        </fieldset>

        <fieldset style={{border:"none"}} >
          <label style={{display:"block", margin:"5px 0px"}} >Element: </label>
          <select
            value={params.element}
            onChange={this.handleElement}
          >
            {elemOptions}
          </select>
        </fieldset>

        <fieldset style={{border:"none"}} >
          <label style={{display:"block", margin:"5px 0px"}} >Season: </label>
          <select
            value={params.season}
            onChange={this.handleSeason}
          >
            {seasonOptions}
          </select>
        </fieldset>

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

