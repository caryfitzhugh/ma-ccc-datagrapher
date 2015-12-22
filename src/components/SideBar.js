import React, { Component, PropTypes } from 'react';
import { chartDefs } from '../api';
const TempIcon = require('babel!svg-react!../../data/images/temp.svg?name=TempIcon');
const PrcpIcon = require('babel!svg-react!../../data/images/prcp.svg?name=PrcpIcon');

import styles from "./App.css";

export default class SidePanel extends Component {
  static propTypes = {
    current: PropTypes.string.isRequired,
    updatePanel: PropTypes.func.isRequired,
    insertPanel: PropTypes.func.isRequired,
    deletePanel: PropTypes.func.isRequired,
    showInfo: PropTypes.func.isRequired,
  };

  render() {
    const { actions, index, current } = this.props;

    return (
      <div className={styles.sidepanel}>
        <div className={current == 'Temp' ? styles.sideitemCurrent : styles.sideitem}
          onClick={()=>{this.props.updatePanel({chart:'Temp'});}}
        >
        <TempIcon />
        </div>
        <div className={current == 'Prcp' ? styles.sideitemCurrent : styles.sideitem}
          onClick={()=>{this.props.updatePanel({chart:'Prcp'});}}
        >
        <PrcpIcon />
        </div>
        <div
          className={styles.sideitem}
          onClick={this.props.showInfo}
        >
        Info
        </div>
        <div
          className={styles.sideitem}
          onClick={this.props.insertPanel}
        >Add</div>
        <div
          className={styles.sideitem}
          onClick={this.props.deletePanel}
        >Remove</div>
      </div>
    );
  }
}


