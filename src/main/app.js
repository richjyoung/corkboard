import path from 'path';
import { app } from 'electron';
import electron_config from 'electron-config';
import { Window } from './window';
import { Database } from './database';
import { logwrap } from './logwrap';
const logger = logwrap('App');

export class App {

    constructor() {
        this._config = new electron_config();
        logger.debug('Application config: %j', this._config.store);

        this._database_path = path.join(app.getPath('userData'), 'default.db');
        logger.debug('Database path: %s', this._database_path);

        this._database = new Database(this._database_path);
        this._windows = [];

        this._env = process.env.NODE_ENV || 'production';
        logger.debug('NODE_ENV: %s', this._env);

        // App callbacks
        app.on('ready', evt => this.app_ready(evt));
        app.on('window-all-closed', evt => this.app_window_all_closed(evt));
        app.on('quit', evt => this.app_quit(evt));
    }

    get config() {
        return this._config;
    }

    get database() {
        return this._database;
    }

    app_ready() {
        logger.info('Ready');
        var win = new Window('corkboard');
        if(this._env ==='development') {
            require('vue-devtools').install();
            win.toggle_dev_tools();
        }
        this._windows.push(win);
    }

    app_window_all_closed() {
        logger.verbose('Application windows closed');
        if(process.platform !== 'darwin') {
            logger.info('Application exited');
            app.quit();
        }
    }

    app_quit() {
        this._database.close();
        logger.info('Quit');
    }

    web_contents_window(web_contents) {
        return this._windows.filter((x) => {
            return x.win.webContents == web_contents;
        })[0];
    }
}