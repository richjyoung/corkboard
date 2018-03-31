const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const window = require('./window');
const ipc_setup = require('./ipc');

let win;

app.on('ready', function() {
    win = window('index.html');
    win.on('closed', function() {
        console.log('Window closed');
        win = null;
    });
    ipc_setup(win);
    console.log('Application started');
});

app.on('window-all-closed', function() {
    console.log('Application windows closed');
    if(process.platform !== 'darwin') {
        console.log('Application exited');    
        app.quit();
    }
});