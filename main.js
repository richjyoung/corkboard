const { app } = require('electron');
const window = require('./app/window');
const ipc_setup = require('./app/ipc');
const database_setup = require('./app/sqlite3db');

let win;

app.on('ready', function() {
    win = window('index.html');
    win.on('closed', function() {
        console.log('Window closed');
        win = null;
    });
    ipc_setup(win);
    database_setup();
    console.log('Application started');
});

app.on('window-all-closed', function() {
    console.log('Application windows closed');
    if(process.platform !== 'darwin') {
        console.log('Application exited');
        app.quit();
    }
});