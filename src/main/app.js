import path from 'path';
import { app, ipcMain } from 'electron';
import electron_config from 'electron-config';
import { Window } from './window';
import { Database } from './database';
import { logwrap } from './logwrap';
const logger = logwrap('App');

export class App {

    constructor() {
        logger.debug('Creating new App...');
        this._config = new electron_config();
        this._database_path = path.join(app.getPath('userData'), 'default.db');
        logger.verbose('Database path: %s', this._database_path);
        this._database = new Database(this._database_path);
        this._windows = [];
        this._env = process.env.NODE_ENV || 'production';

        // App callbacks
        app.on('ready', evt => this.app_ready(evt));
        app.on('window-all-closed', evt => this.app_window_all_closed(evt));

        // IPC Main
        ipcMain.on('toggle_fullscreen', evt => this.ipc_toggle_fullscreen(evt));
        ipcMain.on('toggle_devtools', evt => this.ipc_toggle_devtools(evt));
        logger.debug('Created new App');
    }

    get config() {
        return this._config;
    }

    app_ready() {
        var win = new Window('corkboard');
        if(this._env ==='development') {
            require('vue-devtools').install();
            win.toggle_dev_tools();
        }
        this._windows.push(win);

        console.log('Application started');
    }

    app_window_all_closed() {
        console.log('Application windows closed');
        if(process.platform !== 'darwin') {
            console.log('Application exited');
            app.quit();
        }
    }

    web_contents_window(web_contents) {
        return this._windows.filter((x) => {
            return x.win.webContents == web_contents;
        })[0];
    }

    ipc_toggle_fullscreen(event) {
        this.web_contents_window(event.sender).toggle_fullscreen();
    }

    ipc_toggle_devtools(event) {
        this.web_contents_window(event.sender).ipc_toggle_devtools();
    }
}