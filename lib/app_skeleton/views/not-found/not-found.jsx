import React, { Component } from 'react';
import Helmet from 'react-helmet';

import styles from './not-found.css';

export default class NotFound extends Component {
  render() {
    return (
      <div className={styles['not-found']}>
        <Helmet title="Page not found" />
        <h1>404</h1>
        <p>Not found</p>
      </div>
    );
  }
}
