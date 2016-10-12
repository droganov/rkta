export const todoCreate = form => dispatch => {
  const item = Object.assign({}, form, { isComplete: false });
  dispatch.add('todos', item);
};

export const todoMarkComplete = (todoID, isComplete) => dispatch =>
  dispatch.set(`todos.${todoID}.isComplete`, isComplete);

export const todoDelete = todoID => dispatch => dispatch.del(`todos.${todoID}`);
