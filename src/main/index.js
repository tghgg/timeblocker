const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const { basename, extname, join, dirname } = require('path');

const DataHandler = require('../../lib/data.js');

const TASK_HISTORY_PATH = join(app.getPath('userData'), 'tasks-history.json');

let MainWindow, NewTaskWindow;

const MAIN_WINDOW_CONFIG = {
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#1f1f1f',
    show: false,
    autoHideMenuBar: true,
    webPreferences: { nodeIntegration: true },
    enableRemoteModule: false
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


// Intialize app
app.on('ready', () => {

    app.allowRendererProcessReuse = true;

    MainWindow = new BrowserWindow(MAIN_WINDOW_CONFIG);
    MainWindow.loadFile('./src/main/index.html');

    MainWindow.on('ready-to-show', (event) => {
        MainWindow.show();
        MainWindow.webContents.send('resize', MainWindow.getContentSize()[1]);
    });

    MainWindow.on('resize', () => {
        console.log('re');
        MainWindow.webContents.send('resize', MainWindow.getContentSize()[1]);
    });

    if (!DataHandler.existsSync(TASK_HISTORY_PATH)) {
        console.log('Initialize task history');
        DataHandler.create(TASK_HISTORY_PATH, JSON.stringify({}), (err) => {
            if (err) dialog.showErrorBox('Error', `${err}\nError intializing tasks history JSON file.`);
        });
    } else {
        console.log('Task history exists');
    }

});


// Listeners
ipcMain.on('ask-new-task', (event, data) => {
    NewTaskWindow = new BrowserWindow(NEW_TASK_WINDOW_CONFIG);
    NewTaskWindow.loadFile('./src/subwindows/new_task_window.html');
});

ipcMain.on('create-new-task', (event, data) => {
    InputWindow = undefined;
    MainWindow.webContents.send('create-task', data);
});