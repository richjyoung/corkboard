const { app } = require('electron');
const electron_config = require('electron-config');
const window = require('./window');
const ipc_setup = require('./ipc');
const database_setup = require('./sqlite3db');
const config = new electron_config();

let win;

app.on('ready', () => {
    if(process.env.NODE_ENV ==='development') {
        require('vue-devtools').install();
    }
    win = window(config);
    win.once('ready-to-show', () => {
        console.log(config.get('maximised'));
        if(config.get('maximised')) {
            win.maximize();
        }
        win.show();
    });
    win.on('close', () => {
        config.set('winBounds', win.getBounds());
        config.set('maximised', win.isMaximized());
    });
    win.on('closed', () => {
        console.log('Window closed');
        win = null;
    });
    ipc_setup(win);
    database_setup();
    console.log('Application started');
});

app.on('window-all-closed', () => {
    console.log('Application windows closed');
    if(process.platform !== 'darwin') {
        console.log('Application exited');
        app.quit();
    }
});