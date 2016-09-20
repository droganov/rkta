import { todoSubscribeQuery } from './queries.todos.es6';

export const todoSubscribe = (racerModel, queryHandler) => {
  queryHandler('todos', todoSubscribeQuery()).pipeAs('todos');
};

export const todoCreate = form => racerModel => {
  const item = Object.assign({}, form, { isComplete: false });
  racerModel.root.add('todos', item);
};

export const todoMarkComplete = (todoID, isComplete) => racerModel => {
  racerModel.root.set(`todos.${todoID}.isComplete`, isComplete);
};

export const todoDelete = todoID => racerModel => {
  racerModel.root.del(`todos.${todoID}`);
};
