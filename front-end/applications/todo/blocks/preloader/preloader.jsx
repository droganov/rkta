import React from 'react';

import styles from './preloader.styl';

export default () =>
  (<div className={styles.preloader}>
    <div className={styles.spinner} />
  </div>);
