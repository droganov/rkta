import React, { Component } from 'react';

class OnScreen extends Component {
  state = {};
  componentDidMount() {
    const { observeDoc, docid } = this.props;
    if(docid && observeDoc) {
      console.log('observe', docid, this.refs.elem);
      observeDoc(docid);
    }
  }
  render = () => {
    const { onScreen, docid, oDoc } = this.props;
    return (
      <div style={{
        border:'1px solid #eee',
        height: '400px',
        backgroundColor: onScreen ? '#ffeeee' : 'transparent'
      }} ref="elem">
        <h1>onscreen test {docid}</h1>
        {oDoc && <h2>---{oDoc.text}---</h2>}
      </div>
    );
  }
}

export default OnScreen;
