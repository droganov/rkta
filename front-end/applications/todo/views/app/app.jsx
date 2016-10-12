import React, { PropTypes, Component } from 'react';
import Helmet from 'react-helmet';
import { connectRacer } from 'racer-react';

import Form from '../../blocks/form/form';
import Todo from '../../blocks/todo/todo';

import styles from './app.styl';

import {
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
      todos,
      createTodo,
      markComplete,
      deleteTodo,
    } = this.props;
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
  mapRemoteToProps: ({graph, doc}, props) => Promise.all([
      graph('{ todos: fetchAllTodos { text, isComplete } }').resolve(),
    ]).then(
      () => ({})
    ),
  mapSelectToProps: (select, props) => {
    return {
      getTodo: id => select.getCopy(`todos.${id}`),
    };
  },
  mapDispatchToProps: (dispatch, props) => {
    return {
      createTodo: form => dispatch.add(todoCreate(form)),
      markComplete: (todoID, isComplete) => dispatch.set(todoMarkComplete(todoID, isComplete)),
      deleteTodo: todoID => dispatch.del(todoDelete(todoID)),
    };
  }
})(App);
