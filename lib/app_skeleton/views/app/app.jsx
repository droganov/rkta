import React, { Component } from 'react';
import Helmet from 'react-helmet';

import { connectRacer } from 'racer-react';

import Hello from '../../blocks/hello/hello';

import styles from './app.styl';

class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        <Helmet
          title="My Title"
          titleTemplate="rkta: %s"
        />
        <Hello />
      I'm the new app
      </div>
    );
  }
}

export default connectRacer()(App);
