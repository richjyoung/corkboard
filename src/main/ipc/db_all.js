import { ipcMain } from 'electron';
import { App } from '../index';
import { logwrap } from '../logwrap';
const logger = logwrap('IPC');

export default function () {

    ipcMain.on('sqlite3_db_all', (evt, arg) => {
        logger.debug('Transaction request %d', arg.id);
        App.database.connection.all(arg.query, arg.params, (err, rows) => {
            if(err) {
                logger.error(err);
            }
            logger.debug('Transaction %d complete', arg.id);
            evt.sender.send('sqlite3_db_all_callback', {
                id: arg.id,
                err: err,
                rows: rows
            });
        });
    });

}