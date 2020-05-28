const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const { basename, extname, join, dirname } = require('path');

const DataHandler = require('../../lib/data.js');

let MainWindow;

const MAIN_WINDOW_CONFIG = {
    width: 800,
    height: 600,
    show: true,
    webPreferences: { nodeIntegration: true },
    enableRemoteModule: false
};

// Intialize app
app.on('ready', () => {

    app.allowRendererProcessReuse = true;

    MainWindow = new BrowserWindow(MAIN_WINDOW_CONFIG);
    MainWindow.loadFile('./src/main/index.html');
    MainWindow.webContents.send('resize', MainWindow.getContentBounds());


    MainWindow.on('resize', () => {
        MainWindow.webContents.send('resize', MainWindow.getContentBounds());
    });

});
