import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connectRacer } from 'racer-react';

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

        <div style={{height: '1500px', backgroundColor: '#ccc'}}></div>
        <OnScreen {...this.props} docid='32c54aeb-c408-4c8a-a228-4a6e90d88aee'/>
        <div style={{height: '1500px', backgroundColor: '#ccc'}}></div>
        
      </div>
    );
  }
}

export default connectRacer({
  mapRemoteToProps: ({doc}, props) => Promise.resolve({
    observeDoc: docid => doc('todos.'+docid).observerAs('oDoc')
  }),
})(App);
