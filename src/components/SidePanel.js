import React, { Component, PropTypes } from 'react';
import { chartDefs } from '../constants/stn';

import styles from "./App.css";

export default class SidePanel extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    const { actions, index, current } = this.props;
    const cButtons = [];

    chartDefs.forEach((def,key) => {
      const cName = key == current ? styles.sideitemCurrent : styles.sideitem;
      cButtons.push(
        <div
          className={cName}
          key={key}
          onClick={()=>{actions.setChartType(index,key)}}
        >{def.title}</div>
      );
    });

    return (
      <div className={styles.sidepanel}>
        {cButtons}
        <div
          className={styles.sideControl}
          onClick={this.props.actions.insertPanel.bind(this,this.props.index)}
        >Add</div>
        <div
          className={styles.sideControl}
          onClick={this.props.actions.deletePanel.bind(this,this.props.index)}
        >Remove</div>
      </div>
    );
  }
}


