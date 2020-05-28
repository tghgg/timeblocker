const { ipcRenderer } = require('electron');

class Task {
  constructor (timeSpan, name, id) {
    this.timeSpan = timeSpan;
    this.name = name;
    this.id = id;
  }
}

const TASKS_LIST = new Vue({
  el: '.tasks',
  data: {
    tasks: []
  }
});

// Menu bar actions
document.getElementById('create-new-task').addEventListener('click', (event) => {
  ipcRenderer.send('ask-new-task');
});
document.getElementById('about').addEventListener('click', (event) => {
  ipcRenderer.send('about');
});
document.getElementById('quit').addEventListener('click', (event) => {
  ipcRenderer.send('quit');
});

// Auto resize the page
ipcRenderer.on('resize', (event, height) => {
  document.querySelector('body').style.height = `${height}px`;
});

// Receive an object containing tasks with their respective names as keys
ipcRenderer.on('create-task', (event, tasks) => {
  console.log('Add task(s) to the current list');
  const TASKS_TO_ADD = Object.keys(tasks);
  for (let i = 0; i < TASKS_TO_ADD.length; i++) {
    const NEW_TASK = new Task(tasks[TASKS_TO_ADD[i]].timeSpan, tasks[TASKS_TO_ADD[i]].name, tasks[TASKS_TO_ADD[i]].id);
    TASKS_LIST.tasks.push(NEW_TASK);
  }
});

// Remove task. Obviously.
ipcRenderer.on('remove-task', (event, taskId) => {
  document.getElementById(taskId).remove();
});
