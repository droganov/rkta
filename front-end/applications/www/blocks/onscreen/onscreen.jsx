import React, { Component } from 'react';
import { connectRacer } from 'racer-react';

class OnScreen extends Component {
  state = {};
  componentWillReceiveProps(nextProps) {
    nextProps.fetchTodo && nextProps.fetchTodo(this.props.docid);
  }
  render = () => {
    const { onScreen, docid, todo } = this.props;
    return (
      <div style={{
        border:'1px solid #eee',
        height: '400px',
        backgroundColor: onScreen ? '#ffeeee' : 'transparent'
      }} ref="elem">
        <h1>onscreen test {docid}</h1>
        {todo && <h3>{todo.text}</h3>}
      </div>
    );
  }
}

export default connectRacer({
  mapRemoteToProps: ({graph}, props) => Promise.resolve({
    fetchTodo: docid => graph(`{ todos: fetchOneTodo(id: "${docid}") { text } }`).resolve(),
  })

})(OnScreen);
