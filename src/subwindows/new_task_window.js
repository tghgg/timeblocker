'use strict';

const { ipcRenderer } = require('electron');

window.onblur = () => {
  window.close();
};

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();

  // Create task ID.
  // ID starts with 'task_' since HTML does not allow ID to start with a digit
  const CURRENT_TIME = new Date();
  const ID = `task_${document.getElementById('task-name').value}_${CURRENT_TIME.getFullYear()}${CURRENT_TIME.getMonth()}${CURRENT_TIME.getDate()}`;

  ipcRenderer.send('create-new-task', { name: document.getElementById('task-name').value, id: ID, timeSpan: `${document.getElementById('task-start').value} > ${document.getElementById('task-end').value}` });
  window.close();
});

document.querySelector('.main > button').addEventListener('click', (event) => {
  event.preventDefault();
  window.close();
});