import React, { PropTypes, Component } from 'react';
import Helmet from 'react-helmet';
import { connectRacer } from 'racer-react';

import Form from '../../blocks/form/form';
import Todo from '../../blocks/todo/todo';

import styles from './app.styl';

import {
  todoSubscribe,
  todoSelectList,
  todoCreate,
  todoMarkComplete,
  todoDelete,
} from '../../racer/index.es6';

class App extends Component {
  static propTypes = {
    todos: PropTypes.array,
    createTodo: PropTypes.func,
    markComplete: PropTypes.func,
    deleteTodo: PropTypes.func,
  };
  state = {};
  render() {
    const {
      oneTodo,
      otherTodos,
      todos,
      createTodo,
      markComplete,
      deleteTodo,
    } = this.props;
    // console.log(oneTodo, otherTodos);
    return (
      <div className={styles.app}>
        <Helmet
          title="My Title"
          titleTemplate="rkta: %s"
        />
        <div className={styles.header}>Todos</div>
        <div className={styles.content}>
          {todos && todos.map((todo, i) =>
            (todo && <Todo
              key={i}
              item={todo}
              markComplete={markComplete}
              delete={deleteTodo}
            />)
          )}
        </div>
        <div>
          <Form onCreate={createTodo} />
        </div>
      </div>
    );
  }
}

export default connectRacer({
  mapRemoteToProps: (query, doc, props) => {
    query('todos', {}).fetchAs('todos');
    doc('todos.32c54aeb-c408-4c8a-a228-4a6e90d88aed').subscribeAs('oneTodo');
    doc('todos',['32c54aeb-c408-4c8a-a228-4a6e90d88aee','32c54aeb-c408-4c8a-a228-4a6e90d88aef']).subscribeAs('otherTodos');

    return {};
  },
  mapSelectToProps: (select, props) => {
    return {
      // todos: select(todoSelectList),
    };
  },
  mapDispatchToProps: (dispatch, props) => {
    return {
      createTodo: form => dispatch(todoCreate(form)),
      markComplete: (todoID, isComplete) => dispatch(todoMarkComplete(todoID, isComplete)),
      deleteTodo: (todoID) => dispatch(todoDelete(todoID)),
    };
  }
})(App);
