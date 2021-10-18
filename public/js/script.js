const todoList = document.getElementById('todo-list');
const newTodo = document.getElementById('new-todo');
const addButton = document.getElementById('add-button');
const errorText = document.getElementById('error');
const switchTodo = document.getElementById('switch-todo');
const switchDone = document.getElementById('switch-done');

let isDone = false;

switchTodo.addEventListener('click', async () => {
  switchTodo.classList.add('active');
  switchDone.classList.remove('active');
  isDone = false;
  const tasks = await getTasks();
  updateTasks(tasks);
});

switchDone.addEventListener('click', async () => {
  switchDone.classList.add('active');
  switchTodo.classList.remove('active');
  isDone = true;
  const tasks = await getTasks();
  updateTasks(tasks);
});

function updateTasks() {}

addButton.addEventListener('click', async () => {
  if (newTodo.value.length > 0) {
    const body = JSON.stringify({ task: newTodo.value });
    console.log(body);
    const response = await fetch('/app/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
    const json = await response.json();
    switchTodo.classList.add('active');
    switchDone.classList.remove('active');
    isDone = false;
    updateTasks(json.db);
    newTodo.value = '';
    errorText.innerText = '';
  } else {
    errorText.innerText = 'Please enter a new task';
  }
});

const getTasks = async () => {
  const response = await fetch('/app/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  return result;
};

const taskFetch = async (id, task) => {
  console.log('fetch', `/app/${task}/${id}`);
  const response = await fetch(`/app/${task}/${id}`, {
    method: 'POST',
  });
  const json = await response.json();
  const str = `[data-id="${id}"]`;
  const liElement = document.querySelector(str);
  liElement.classList.toggle(`${task}`);
  setTimeout(() => {
    updateTasks(json);
  }, 300);
};

updateTasks = async (tasks) => {
  console.log(tasks);
  todoList.innerHTML = '';
  if (tasks.length > 0) {
    document.getElementsByClassName('empty-todo')[0].classList.add('hide');
  } else {
    document.getElementsByClassName('empty-todo')[0].classList.remove('hide');
  }
  if (isDone) {
    tasks.forEach((el) => {
      if (el.done) {
        const li = document.createElement('li');
        li.classList.add('list-element');
        li.classList.add('line');
        li.innerText = el.task;
        li.dataset.id = el.id;

        const btnBox = document.createElement('div');
        btnBox.classList.add('list-btn');
        const buttonRemove = document.createElement('button');
        buttonRemove.classList.add('remove-btn');
        buttonRemove.addEventListener('click', () => taskFetch(el.id, 'delete'));
        const buttonUndone = document.createElement('button');
        buttonUndone.addEventListener('click', () => taskFetch(el.id, 'undone'));
        buttonUndone.classList.add('undone-btn');

        btnBox.appendChild(buttonRemove);
        btnBox.appendChild(buttonUndone);
        li.appendChild(btnBox);

        todoList.appendChild(li);
      }
    });
  } else {
    tasks.forEach((el) => {
      if (!el.done) {
        const li = document.createElement('li');
        li.classList.add('list-element');
        li.innerText = el.task;
        li.dataset.id = el.id;

        const btnBox = document.createElement('div');
        btnBox.classList.add('list-btn');
        const buttonRemove = document.createElement('button');
        buttonRemove.classList.add('remove-btn');
        buttonRemove.addEventListener('click', () => taskFetch(el.id, 'delete'));
        const buttonDone = document.createElement('button');
        buttonDone.addEventListener('click', () => taskFetch(el.id, 'done'));
        buttonDone.classList.add('done-btn');

        btnBox.appendChild(buttonRemove);
        btnBox.appendChild(buttonDone);
        li.appendChild(btnBox);

        todoList.appendChild(li);
      }
    });
  }
};
const onStart = async () => {
  const tasks = await getTasks();
  updateTasks(tasks);
};

onStart();
