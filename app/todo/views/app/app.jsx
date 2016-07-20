import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connectRacer } from 'racer-react';

import Form from '../../blocks/form/form';
import Todo from '../../blocks/todo/todo';

import styles from './app.styl';

class App extends Component {
  static propTypes = {
    todos: PropTypes.array,
    createTodo: PropTypes.func,
    markComplete: PropTypes.func,
    deleteTodo: PropTypes.func,
  };
  antiPureFunction() {
    return 'tsss';
  }
  render() {
    const { todos } = this.props;
    return (
      <div className={styles.app}>
        <Helmet
          title="My Title"
          titleTemplate="rkta: %s"
        />
        <div className={styles.header}>Todos</div>
        <div className={styles.content}>
          {todos && todos.map((todo, i) =>
            (<Todo
              key={i}
              item={todo}
              markComplete={this.props.markComplete}
              delete={this.props.deleteTodo}
            />)
          )}
        </div>
        <div>
          <Form onSubmit={this.props.createTodo} />
        </div>
      </div>
    );
  }
}

export default connectRacer(
  query => {
    query('todos', {}).pipeAs('todos');
  },
  racerModel => ({
    createTodo: (form) => {
      const item = Object.assign({}, form, { isComplete: false });
      racerModel.root.add('todos', item);
    },
    markComplete: (todoID, isComplete) => {
      racerModel.root.set(`todos.${todoID}.isComplete`, isComplete);
    },
    deleteTodo: (todoID) => {
      racerModel.root.del(`todos.${todoID}`);
    },
  })
)(App);
