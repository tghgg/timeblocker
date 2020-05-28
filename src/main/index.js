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


        if (!DataHandler.existsSync(TASK_HISTORY_PATH)) {
            console.log('Initialize task history');
            DataHandler.create(TASK_HISTORY_PATH, JSON.stringify({}), (err) => {
                if (err) dialog.showErrorBox('Error', `${err}\nError intializing tasks history JSON file.`);
            });
        } else {
            console.log('Task history exists. Adding existing tasks...');
            DataHandler.read(TASK_HISTORY_PATH, (err, data) => {
                if (err) {
                    dialog.showErrorBox('Error', `${err}\nError reading existing task history.`);
                } else {

                    console.log('Send them tass');
                    MainWindow.webContents.send('create-task', JSON.parse(data));
                }
            });
        }
    });

    MainWindow.on('resize', () => {
        console.log('re');
        MainWindow.webContents.send('resize', MainWindow.getContentSize()[1]);
    });
});


// Listeners
ipcMain.on('ask-new-task', (event, data) => {
    NewTaskWindow = new BrowserWindow(NEW_TASK_WINDOW_CONFIG);
    NewTaskWindow.loadFile('./src/subwindows/new_task_window.html');
});

// Save the task to history and tell the renderer to render the new task
ipcMain.on('create-new-task', (event, data) => {
    InputWindow = undefined;

    // Go through some loops so the 'create-task' handler on the renderer side keeps being simple
    const TEMP_TASK = {};
    TEMP_TASK[data.name] = data;
    MainWindow.webContents.send('create-task', TEMP_TASK);

    DataHandler.read(TASK_HISTORY_PATH, (err, history_data) => {
        if (err) dialog.showErrorBox('Error', `${err}\nError adding the new task to history.`);
        else {
            const CURRENT_HISTORY = JSON.parse(history_data);
            CURRENT_HISTORY[data.name] = data;

            // Update history
            DataHandler.update(TASK_HISTORY_PATH, JSON.stringify(CURRENT_HISTORY), (err) => {
                if (err) dialog.showErrorBox('Error', `${err}\nError updating new task history.`);
            });
        }
    });
});
