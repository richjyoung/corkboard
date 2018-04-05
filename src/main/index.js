const { app } = require('electron');
const window = require('./window');
const ipc_setup = require('./ipc');
const database_setup = require('./sqlite3db');

let win;

app.on('ready', function() {
    if(process.env.NODE_ENV ==='development') {
        require('vue-devtools').install();
    }
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