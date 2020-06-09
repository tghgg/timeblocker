const { BrowserWindow, ipcMain } = require('electron');

const lib = {};

/* Does 2 things
Show the prompt window
Returns a Promise which resolves on user input */

// Let's try to this keep all contained

// Receives a listener for the prompt window's ipcRenderer to send the result to
lib.prompt = (config, question) => {
  if (typeof (config) !== 'object' || typeof (question) !== 'string') return new Error("Invalid input for Promptr")

  config.show = false
  const PromptWindow = new BrowserWindow(config);
  PromptWindow.loadFile('./lib/promptr/window.html')

  PromptWindow.on('ready-to-show', () => {
    PromptWindow.show();
    PromptWindow.webContents.send('init-question', question);
  })

  return new Promise((resolve, reject) => {
    ipcMain.handleOnce('finished', (event, userInput) => {
      console.log('helu')
      if (userInput) {
        resolve(userInput);

      }
      else {
        reject("The user cancelled the prompt");

      }
    })
  })
}

module.exports = lib;
