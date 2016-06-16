import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connectRacer } from 'racer-react';

import Form from '../../blocks/form/form';
import Todo from '../../blocks/todo/todo';

import styles from './app.css';

class App extends Component {
  static statics = {
    racer: (query) => {
      query('todos', {}).pipeAs('todos');
    },
  };

  constructor(props) {
    super(props);
    this.createTodo = this.createTodo.bind(this);
    this.markComplete = this.markComplete.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
  }

  createTodo(form) {
    const item = Object.assign({}, form, { isComplete: false });
    this.props.racerModel.root.add('todos', item);
  }

  markComplete(todoID, isComplete) {
    this.props.racerModel.root.set(`todos.${todoID}.isComplete`, isComplete);
  }

  deleteTodo(todoID) {
    this.props.racerModel.root.del(`todos.${todoID}`);
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
          {todos.map((todo, i) =>
            (<Todo
              key={i}
              item={todo}
              markComplete={this.markComplete}
              delete={this.deleteTodo}
            />)
          )}
        </div>
        <div>
          <Form onSubmit={this.createTodo} />
        </div>
      </div>
    );
  }
}

export default connectRacer(App);
