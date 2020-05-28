'use strict';

const { ipcRenderer } = require('electron');

window.onblur = () => {
  window.close();
};

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  ipcRenderer.send('create-new-task', { name: document.getElementById('task-name').value, timeSpan: `${document.getElementById('task-start').value} > ${document.getElementById('task-end').value}`});
  window.close();
});

document.querySelector('.main > button').addEventListener('click', (event) => {
  event.preventDefault();
  window.close();
});