let rootElm = document.querySelector('.todo-list');
let todoInput = document.querySelector('.todo-input');
let todoSearch = document.querySelector('.todo-search');

let store = Redux.createStore(reducer);
let todos = JSON.parse(localStorage.getItem('todos')) || state.getState();

// Add todo
let handleAddTODO = (event) => {
  let value = event.target.value;
  if (event.keyCode === 13 && value) {
    let todo = { name: value, isDone: false };
    store.dispatch({ type: 'add', todo });
    event.target.value = '';
  }
};

todoInput.addEventListener('keyup', handleAddTODO);

// search todo
todoSearch.addEventListener('keyup', (event) => {
  if (event.target.value !== '') {
    let searchVal = todos.filter((t) => {
      return t.name.startsWith(event.target.value);
    });
    renderUI(searchVal.length ? searchVal : todos);
  }
  if (event.target.value === '') {
    renderUI(todos);
  }
});

store.subscribe(() => {
  renderUI(todos);
  localStorage.setItem(`todos`, JSON.stringify(todos));
});

function renderUI(arr = todos) {
  rootElm.innerHTML = '';
  arr.forEach((todo, index) => {
    // Create Element and add class
    let todoText = document.createElement('span');
    todoText.classList.add('todo-text');

    let span = document.createElement('span');
    span.classList.add('delete-todo');

    let li = document.createElement('li');
    li.classList.add('single-todo');

    let input = document.createElement('input');
    input.type = 'checkbox';
    input.classList.add('input-checkbox');

    // Delete todo
    span.addEventListener('click', (event) => {
      store.dispatch({ type: 'delete', index });
    });

    // Toggle isDone
    input.addEventListener('click', (event) => {
      store.dispatch({ type: 'toggle', index });
    });

    // Append Element
    todoText.innerText = todo.name;
    input.checked = todo.isDone;
    span.innerText = 'X';

    li.append(input, todoText, span);
    rootElm.append(li);
  });
}

function reducer(state = [], action) {
  if (action.type === 'delete') {
    todos.splice(action.index, 1);
  }
  if (action.type === 'add') {
    todos.push(action.todo);
  }
  if (action.type === 'toggle') {
    todos[action.index].isDone = !todos[action.index].isDone;
  }
  return state;
}

renderUI(todos);
