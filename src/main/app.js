import { app } from 'electron';
import { Database } from './database';
import ElectronConfig from 'electron-config';
import { logwrap } from './logwrap';
import path from 'path';
import { Window } from './window';

const logger = logwrap('App');

export class App {
    constructor() {
        this._config = new ElectronConfig();
        logger.debug('Application config: %j', this._config.store);

        this._databasePath = path.join(app.getPath('userData'), 'default.db');
        logger.debug('Database path: %s', this._databasePath);

        this._database = new Database(this._databasePath);
        this._windows = [];

        this._env = process.env.NODE_ENV || 'production';
        logger.debug('NODE_ENV: %s', this._env);

        // App callbacks
        app.on('ready', (evt) => { return this.appReady(evt); });
        app.on('window-all-closed', (evt) => {
            return App.appWindowAllClosed(evt);
        });
        app.on('quit', (evt) => { return this.appQuit(evt); });
    }

    get config() {
        return this._config;
    }

    get database() {
        return this._database;
    }

    appReady() {
        const win = new Window('corkboard');
        logger.info('Ready');
        if(this._env === 'development') {
            require('vue-devtools').install(); // eslint-disable-line global-require
            win.toggleDevTools();
        }
        this._windows.push(win);
    }

    static appWindowAllClosed() {
        logger.verbose('Application windows closed');
        if(process.platform !== 'darwin') {
            logger.info('Application exited');
            app.quit();
        }
    }

    appQuit() {
        this._database.close();
        logger.info('Quit');
    }

    webContentsWindow(webContents) {
        return this._windows.filter((window) => {
            return window.win.webContents === webContents;
        })[0];
    }
}
