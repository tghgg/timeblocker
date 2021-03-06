const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { join } = require('path');

// My own libraries
const DataHandler = require('../../lib/data.js');
const Promptr = require('../../lib/promptr/prompt.js');

const TASK_HISTORY_PATH = join(app.getPath('userData'), 'tasks-history.json');

let MainWindow, NewTaskWindow;

const MAIN_WINDOW_CONFIG = {
  minWidth: 800,
  minHeight: 600,
  backgroundColor: '#1f1f1f',
  show: false,
  autoHideMenuBar: true,
  webPreferences: { nodeIntegration: true },
  enableRemoteModule: false,
  icon: './assets/512x512.png'
};

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

// Helpers
function getCurrentTaskHistory () {
  return JSON.parse(DataHandler.readSync(TASK_HISTORY_PATH));
}
function updateTaskHistory (newTaskHistory, errProcess = 'Something has gone wrong!') {
  if (typeof (newTaskHistory) !== 'object') return new Error('New task history is of invalid type.');
  DataHandler.update(TASK_HISTORY_PATH, JSON.stringify(newTaskHistory), (err) => {
    if (err) dialog.showErrorBox('Error', `${err}\n${errProcess}`);
  });
}

// Intialize app
app.on('ready', () => {
  app.allowRendererProcessReuse = true;

  MainWindow = new BrowserWindow(MAIN_WINDOW_CONFIG);
  MainWindow.loadFile('./src/main/index.html');

  MainWindow.on('ready-to-show', (event) => {
    MainWindow.show();
    MainWindow.webContents.send('resize', MainWindow.getContentSize()[1]);

    if (!DataHandler.existsSync(TASK_HISTORY_PATH)) {
      console.log('Initialize task history');
      DataHandler.create(TASK_HISTORY_PATH, JSON.stringify({}), (err) => {
        if (err) dialog.showErrorBox('Error', `${err}\nError intializing tasks history JSON file.`);
      });
    } else {
      console.log('Task history exists. Adding existing tasks...');
      DataHandler.read(TASK_HISTORY_PATH, (err, data) => {
        err ? dialog.showErrorBox('Error', `${err}\nError reading existing task history.`) : MainWindow.webContents.send('create-task', JSON.parse(data));
      });
    }
  });
  MainWindow.on('resize', () => MainWindow.webContents.send('resize', MainWindow.getContentSize()[1]));
});

// LISTENERS

ipcMain.on('ask-new-task', (event, data) => {
  NewTaskWindow = new BrowserWindow(NEW_TASK_WINDOW_CONFIG);
  NewTaskWindow.loadFile('./src/subwindows/create_new_task/new_task_window.html');
});

// Save the task to history and tell the renderer to render the new task
ipcMain.on('create-new-task', (event, data) => {
  NewTaskWindow = undefined;

  // Go through some loops so the 'create-task' handler on the renderer side keeps being simple
  const TEMP_TASK = {};
  TEMP_TASK[data.id] = data;
  MainWindow.webContents.send('create-task', TEMP_TASK);

  DataHandler.read(TASK_HISTORY_PATH, (err, historyData) => {
    if (err) dialog.showErrorBox('Error', `${err}\nError adding the new task to history.`);
    else {
      const CURRENT_HISTORY = JSON.parse(historyData);
      CURRENT_HISTORY[data.id] = data;

      // Update history
      DataHandler.update(TASK_HISTORY_PATH, JSON.stringify(CURRENT_HISTORY), (err) => {
        if (err) dialog.showErrorBox('Error', `${err}\nError updating new task history.`);
      });
    }
  });
});

// Remove a completed task from history
ipcMain.on('complete-task', (event, data) => {
  DataHandler.read(TASK_HISTORY_PATH, (err, historyData) => {
    if (err) dialog.showErrorBox('Error', `${err}\nError removing completed task from history.`);
    else {
      console.log('Removing ' + data);
      const CURRENT_HISTORY = JSON.parse(historyData);

      delete CURRENT_HISTORY[data];

      // Update history
      DataHandler.update(TASK_HISTORY_PATH, JSON.stringify(CURRENT_HISTORY), (err) => {
        if (err) dialog.showErrorBox('Error', `${err}\nError updating new task history.`);
      });
    }
  });
});

// Remove task from task history
ipcMain.on('ask-remove-task', (event, data) => {
  dialog.showMessageBox(MainWindow, {
    title: 'Confirmation',
    type: 'question',
    buttons: ['Remove', 'Cancel'],
    defaultId: 1,
    message: `Remove ${data.name}?`
  }).then((result) => {
    if (result.response === 0) {
      console.log('Remove task');
      // Delete from history
      const CURRENT_HISTORY = getCurrentTaskHistory();
      delete CURRENT_HISTORY[data.id];
      DataHandler.update(TASK_HISTORY_PATH, JSON.stringify(CURRENT_HISTORY), (err) => {
        if (err) dialog.showErrorBox('Error', `${err}\nFailed to remove task from task history.`);
      });
      // Remove from the renderer
      MainWindow.webContents.send('remove-task', data.id);
    }
  }, (err) => {
    if (err) dialog.showErrorBox('Error', `${err}\nError removing task.`);
  });
});

// Prompt for the new name
ipcMain.handle('edit-task-name', async (event, taskInfo) => {
  return await Promptr.prompt(NEW_TASK_WINDOW_CONFIG, taskInfo.name).then((newName) => {
    // Update database
    const CURRENT_HISTORY = getCurrentTaskHistory();

    // Create a new key identical to the old task, just with a different name
    const renamedTask = {};
    // renamedTask[newName] = {};
    Object.assign(renamedTask, CURRENT_HISTORY[taskInfo.id]);
    renamedTask.name = newName;

    // Modify the task history
    CURRENT_HISTORY[taskInfo.id] = renamedTask;

    // Update
    updateTaskHistory(CURRENT_HISTORY, 'Could not rename a task in the task history.');

    // Return the name to the Task component
    return newName;
  });
});

// MENU BAR LISTENERS

ipcMain.on('quit', event => app.quit());

ipcMain.on('about', event =>
  dialog.showMessageBox(MainWindow, {
    title: 'About',
    type: 'info',
    icon: './assets/fsnowdin.png',
    message: 'Timeblocker by Falling Snowdin.\nNode.js version: ' + process.versions.node + '; ' + 'Electron version: ' + process.versions.electron + '.\nRepository: https://github.com/tghgg/Tracker',
    buttons: ['Close']
  })
);
