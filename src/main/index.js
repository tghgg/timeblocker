const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const { basename, extname, join, dirname } = require('path');

const DataHandler = require('../../lib/data.js');

let MainWindow;

const MAIN_WINDOW_CONFIG = {
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#1f1f1f',
    show: false,
    webPreferences: { nodeIntegration: true },
    enableRemoteModule: false
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

});
