'use strict';

const { ipcRenderer } = require('electron');

// window.onblur = () => {
//   window.close();
// };

ipcRenderer.on('init-question', (event, question) => {
  console.log(question);
  document.getElementById('input').setAttribute('placeholder', question)
})

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();

  const INPUT = document.getElementById('input').value

  ipcRenderer.invoke('finished', INPUT);

  window.close();
});

document.querySelector('.main > button').addEventListener('click', (event) => {
  ipcRenderer.invoke('finished', undefined);
  window.close();
});