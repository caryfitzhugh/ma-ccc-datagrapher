import React, { Component, PropTypes } from 'react';
import SidePanel from './SidePanel';

import styles from "./App.css";

export default class App extends Component {
  static propTypes = {
    children: PropTypes.any
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className={styles.app}>
        <SidePanel className={styles.sidepanel} />
        {this.props.children}
      </div>
    );
  }
}

