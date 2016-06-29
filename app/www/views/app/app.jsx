import React, { Component } from 'react';
import Helmet from 'react-helmet';

import { connectRacer } from 'racer-react';

import Hello from '../../blocks/hello/hello';

import styles from './app.styl';

class App extends Component {
  antiPureFunction() {
    return 'anti';
  }
  render() {
    return (
      <div className={styles.app}>
        <Helmet
          title="My Title"
          titleTemplate="rkta: %s"
        />
        <Hello />
        We've got the examples: <a href="/todo">Todo app</a>
      </div>
    );
  }
}

export default connectRacer()(App);
