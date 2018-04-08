import path from 'path';
import url from 'url';
import { BrowserWindow } from 'electron';
import { App } from './index';
import { logwrap } from './logwrap';
const logger = logwrap('Window');

export class Window {

    constructor(tag) {
        this._tag = tag;
        logger.verbose('Creating %s window instance', tag);

        this._url = url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            hash: this._tag,
            slashes: true
        });
        logger.debug('URL: %s', this._url);

        this._win = this.create_window();

        if (process.env.NODE_ENV == 'development') {
            this.toggle_dev_tools();
        }
    }

    get win() {
        return this._win;
    }

    create_window() {
        var opts = {
            show: false
        };
        Object.assign(opts, App.config.get('winBounds'));

        logger.debug('Browser window options: %j', opts);
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
        logger.info('Ready to show');
        if(App.config.get('maximised')) {
            this._win.maximize();
        }
        this._win.show();
    }

    win_close() {
        logger.verbose('Close');
        App.config.set('winBounds', this._win.getBounds());
        App.config.set('maximised', this._win.isMaximized());
    }

    win_closed() {
        logger.info('Closed');
        this._win = null;
    }

}