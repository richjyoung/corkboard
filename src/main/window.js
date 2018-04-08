import { App } from './index';
import { BrowserWindow } from 'electron';
import { logwrap } from './logwrap';
import path from 'path';
import url from 'url';

const logger = logwrap('Window');

export class Window {
    constructor(tag) {
        this._tag = tag;
        logger.verbose('Creating %s window instance', tag);

        this._url = url.format({
            hash: this._tag,
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        });
        logger.debug('URL: %s', this._url);

        this._win = this.createWindow();

        if(process.env.NODE_ENV === 'development') {
            this.toggleDevTools();
        }
    }

    get browserWindow() {
        return this._win;
    }

    createWindow() {
        const opts = { show: false };
        const win = new BrowserWindow(opts);

        Object.assign(opts, App.config.get('winBounds'));
        logger.debug('Browser window options: %j', opts);

        win.setMenu(null);
        win.loadURL(this._url);

        win.once('ready-to-show', () => { return this.winReadyToShow(); });
        win.on('close', () => { return this.winClose(); });
        win.on('closed', () => { return this.winClosed(); });

        return win;
    }

    toggleDevTools() {
        this._win.toggleDevTools();
    }

    toggleFullscreen() {
        this._win.setFullScreen(!this._win.isFullScreen());
    }

    winReadyToShow() {
        logger.info('Ready to show');
        if(App.config.get('maximised')) {
            this._win.maximize();
        }
        this._win.show();
    }

    winClose() {
        logger.verbose('Close');
        App.config.set('winBounds', this._win.getBounds());
        App.config.set('maximised', this._win.isMaximized());
    }

    winClosed() {
        logger.info('Closed');
        this._win = null;
    }
}
