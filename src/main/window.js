import path from 'path';
import url from 'url';
import { BrowserWindow } from 'electron';
import { App } from './index';
import { logwrap } from './logwrap';
const logger = logwrap('App');

export class Window {

    constructor(tag) {
        logger.info('Creating window instance...');
        this._tag = tag;
        this._url = url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        });
        this._win = this.create_window();

        if (process.env.NODE_ENV == 'development') {
            this.toggle_dev_tools();
        }
        logger.info('Created window instance');
    }

    get win() {
        return this._win;
    }

    create_window() {
        var opts = {
            show: false
        };
        Object.assign(opts, App.config.get('winBounds'));

        var win = new BrowserWindow(opts);

        win.setMenu(null);
        win.loadURL(this._url);

        win.once('ready-to-show', () => this.win_ready_to_show());
        win.on('close', () => this.win_close());
        win.on('closed', () => this.win_closed());

        return win;
    }

    toggle_dev_tools() {
        this._win.toggleDevTools();
    }

    toggle_fullscreen() {
        this._win.setFullScreen(!this._win.isFullScreen());
    }

    win_ready_to_show() {
        if(App.config.get('maximised')) {
            this._win.maximize();
        }
        this._win.show();
    }

    win_close() {
        App.config.set('winBounds', this._win.getBounds());
        App.config.set('maximised', this._win.isMaximized());
    }

    win_closed() {
        logger.info('Window closed');
        this._win = null;
    }

}