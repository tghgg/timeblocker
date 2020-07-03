'use strict';

const { ipcRenderer } = require('electron');

window.onblur = () => {
  window.close();
};

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();

  // Create task ID.
  // ID starts with 'task_' since HTML does not allow ID to start with a digit
  // Remove spaces in the task name for the ID
  const CURRENT_TIME = new Date();
  let safeTaskName = document.getElementById('task-name').value;
  safeTaskName = safeTaskName.trim();
  safeTaskName = safeTaskName.replace(/ /g, '-');

  const ID = `task_${safeTaskName}_${CURRENT_TIME.getFullYear()}${CURRENT_TIME.getMonth()}${CURRENT_TIME.getDate()}`;

  ipcRenderer.send('create-new-task', {
    name: document.getElementById('task-name').value,
    id: ID,
    timeSpan: {
      start: Number(document.getElementById('task-start').value),
      end: Number(document.getElementById('task-end').value)
    }
  });

  // Reset all the input fields for easy creation of multiple tasks
  document.getElementById('task-name').value = '';
  document.getElementById('task-start').value = '';
  document.getElementById('task-end').value = '';

  document.getElementById('task-name').focus();
});

document.querySelector('.main > button').addEventListener('click', (event) => {
  event.preventDefault();
  window.close();
});
