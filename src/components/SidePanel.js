import React, { Component, PropTypes } from 'react';

import styles from "./App.css";

export default class SidePanel extends Component {
  static propTypes = {
    children: PropTypes.any
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className={this.props.className}>
        <div>SidePanel 1</div>
        <div>SidePanel 2</div>
        <div>SidePanel 3</div>
      </div>
    );
  }
}


