'use strict';

const { ipcRenderer } = require('electron');

window.onblur = () => {
  window.close();
};

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  console.log("input");
});

document.querySelector('.main > button').addEventListener('click', (event) => {
  window.close();
});
