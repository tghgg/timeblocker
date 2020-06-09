const { BrowserWindow, ipcMain } = require('electron');

const lib = {};

/* Does 2 things
Show the prompt window
Returns a Promise which resolves on user input */

// Let's try to this keep all contained

// Receives a listener for the prompt window's ipcRenderer to send the result to
lib.prompt = (config, question) => {
  config.show = false
  const PromptWindow = new BrowserWindow(config);
  PromptWindow.loadFile('./lib/promptr/window.html')
  
  PromptWindow.on('ready-to-show', () => {
    PromptWindow.show();
    console.log(question)
    PromptWindow.webContents.send('init-question', question);
    
    ipcMain.handleOnce('finished', (event, userInput) => {
      console.log('data' + userInput);
      return userInput;
    })
  })
}

module.exports = lib;
