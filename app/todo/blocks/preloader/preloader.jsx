import React from 'react';

import styles from './preloader.css';

export default () =>
  (<div className={styles.preloader}>
    <div className={styles.spinner} />
  </div>);
