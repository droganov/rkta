import React from 'react';
import Helmet from 'react-helmet';

import styles from './not-found.styl';

export default () => (
  <div className={styles['not-found']}>
    <Helmet title="Page not found" />
    <h1>404</h1>
    <p>Not found</p>
  </div>
);
