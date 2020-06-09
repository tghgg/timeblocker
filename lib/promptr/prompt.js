const { BrowserWindow } = require('electron');

const lib = {};

/* Does 3 things
Show the prompt window
Get user input
Pass it to the caller */

const NEW_TASK_WINDOW_CONFIG = {
  width: 300,
  height: 100,
  resizable: false,
  center: true,
  useContentSize: true,
  frame: false,
  backgroundColor: '#0f0f0f',
  show: true,
  webPreferences: { nodeIntegration: true },
  enableRemoteModule: false,
  parent: MainWindow,
  autoHideMenuBar: true,
  modal: true
};

// Receives a listener for the prompt window's ipcRenderer to send the result to
lib.prompt = (listener) => {
  const PromptWindow = new BrowserWindow(NEW_TASK_WINDOW_CONFIG);
}
