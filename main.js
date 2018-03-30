const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const window = require('./window');
const ipc_setup = require('./ipc');

let win;

app.on('ready', function() {
    win = window('index.html');
    ipc_setup(win);
});