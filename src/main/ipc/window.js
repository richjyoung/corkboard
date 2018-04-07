import { ipcMain } from 'electron';
import { App } from '../index';
import { logwrap } from '../logwrap';
const logger = logwrap('IPC');

export default function() {

    ipcMain.on('toggle_fullscreen', (evt) => {
        logger.debug('IPC: toggle_fullscreen');
        App.web_contents_window(evt.sender).toggle_fullscreen();
    });

    ipcMain.on('toggle_devtools', (evt) => {
        logger.debug('IPC: toggle_devtools');
        App.web_contents_window(evt.sender).ipc_toggle_devtools();
    });

}