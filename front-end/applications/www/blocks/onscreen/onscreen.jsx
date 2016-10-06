import React, { Component } from 'react';
import { connectRacer } from 'racer-react';

class OnScreen extends Component {
  state = {};
  render() {
    const { onScreen } = this.props;
    return (
      <div style={{
        border:'1px solid #eee',
        height: '100px',
        backgroundColor: onScreen ? '#ffeeee' : 'transparent'
      }} ref="elem">
        <h1>onscreen test</h1>
      </div>
    );
  }
}

export default connectRacer()(OnScreen);
