const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const { basename, extname, join, dirname } = require('path');

const DataHandler = require('../../lib/data.js');

let mainWindow;

app.on('ready', () => {

    app.allowRendererProcessReuse = true;

    mainWindow = new BrowserWindow(
        {
            width: 800,
            height: 600,
            backgroundColor: '#1d1d1d',
            show: true,
            webPreferences: { nodeIntegration: true },
            enableRemoteModule: false
        }
    );
    mainWindow.loadFile('./src/main/index.html');

});
