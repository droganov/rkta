import React, { Component } from 'react';
import Helmet from 'react-helmet';

import Hello from '../../blocks/hello/hello';

import OnScreen from '../../blocks/onscreen/onscreen';

import styles from './app.styl';

class App extends Component {
  state = {};
  render() {
    return (
      <div className={styles.app}>
        <Helmet
          title="My Title"
          titleTemplate="rkta: %s"
        />
        <Hello />
        We've got the examples: <a href="/todo">Todo app</a>
        {/* <OnScreen />
        <OnScreen />
        <OnScreen />
        <OnScreen /> */}
      </div>
    );
  }
}

export default App;
