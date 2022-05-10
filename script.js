let todoInput = document.querySelector('.todo-input');
let rootElm = document.querySelector('.todo-list');
let deleteTodo = document.querySelector('.delete-todo');
let todoCheckbox = document.querySelector('.todo-checkbox');
let todoText = document.querySelector('.todo-text');
let singleTodo = document.querySelector('.single-todo');
let todoSearch = document.querySelector('.todo-search');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

let store = Redux.createStore(reducer);

let handleLocalStorage = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
  renderUI(JSON.parse(localStorage.getItem('todos')) || todos);
};

todoInput.addEventListener('keyup', (event) => {
  store.dispatch({ type: 'add', event });
});

todoSearch.addEventListener('keyup', (event) => {
  if (event.target.value !== '') {
    let searchVal = todos.filter((t) => {
      return t.todoText.startsWith(event.target.value);
    });
    renderUI(searchVal.length ? searchVal : todos);
  }
  if (event.target.value === '') {
    handleLocalStorage(todos);
  }
});

store.subscribe(() => {
  todos = store.getState();
  handleLocalStorage(todos);
});

function renderUI(arr = todos) {
  rootElm.innerHTML = '';
  arr.forEach((todo, index) => {
    // Create Element and class
    let todoText = document.createElement('span');
    todoText.classList.add('todo-text');

    let span = document.createElement('span');
    span.classList.add('delete-todo');

    let li = document.createElement('li');
    li.classList.add('single-todo');

    let input = document.createElement('input');
    input.type = 'checkbox';
    input.classList.add('input-checkbox');

    // Event Listener
    span.addEventListener('click', (event) => {
      store.dispatch({ type: 'delete', index });
    });

    input.addEventListener('click', (event) => {
      store.dispatch({ type: 'toggle', index });
    });

    // Append Element
    todoText.innerText = todo.todoText;
    input.checked = todo.isDone;
    span.innerText = 'X';

    li.append(input, todoText, span);
    rootElm.append(li);
  });
}

function reducer(state = todos, action) {
  switch (action.type) {
    case 'delete':
      state = state.filter((t, i) => {
        if (i !== action.index) {
          return t;
        }
      });
      return state;
      break;
    case 'toggle':
      state[action.index].isDone = !state[action.index].isDone;
      return state;
      break;
    case 'add':
      if (action.event.keyCode === 13 && action.event.target.value !== '') {
        state.push({ isDone: false, todoText: action.event.target.value });
        action.event.target.value = '';
      }
      return state;
      break;

    default:
      return state;
      break;
  }
}

renderUI(todos);
