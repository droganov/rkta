import React from 'react';
import Helmet from 'react-helmet';

import { connectRacer } from 'racer-react';

import Hello from '../../blocks/hello/hello';

import styles from './app.styl';

const App = () => (
  <div className={styles.app}>
    <Helmet
      title="My Title"
      titleTemplate="rkta: %s"
    />
    <Hello />
    I'm the new app
  </div>
);

export default connectRacer()(App);
