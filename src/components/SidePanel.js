import React, { Component, PropTypes } from 'react';
import { chartDefs } from '../constants/stn';

import styles from "./App.css";

export default class SidePanel extends Component {
  static propTypes = {
    current: PropTypes.string.isRequired,
    setChartType: PropTypes.func.isRequired,
    insertPanel: PropTypes.func.isRequired,
    deletePanel: PropTypes.func.isRequired,
  };

  render() {
    const { actions, index, current } = this.props;
    const cButtons = [];

    chartDefs.forEach((def,key) => {
      const cName = key == this.props.current ? styles.sideitemCurrent : styles.sideitem;
      cButtons.push(
        <div
          className={cName}
          key={key}
          onClick={()=>{this.props.setChartType(key);}}
        >{def.title}</div>
      );
    });

    return (
      <div className={styles.sidepanel}>
        {cButtons}
        <div
          className={styles.sideControl}
          onClick={this.props.insertPanel}
        >Add</div>
        <div
          className={styles.sideControl}
          onClick={this.props.deletePanel}
        >Remove</div>
      </div>
    );
  }
}


