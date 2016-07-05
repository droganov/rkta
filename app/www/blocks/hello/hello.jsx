import React, { Component } from 'react';

import styles from './hello.styl';

export default class Hello extends Component {
  _change(ev) {
    this.props.markComplete(this.props.item.id, ev.target.checked);
  }
  render() {
    return (
      <div className={styles.hello}>Hello</div>
    );
  }
}
