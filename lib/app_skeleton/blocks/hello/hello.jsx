import React, { Component } from 'react';

import styles from './hello.css';

export default class Hello extends Component {
  render() {
    return (
      <div className={styles.hello}>Hello</div>
    );
  }
}
