import { ipcRenderer } from 'electron';
import { logIf } from '../utils/logwrap';

const DEBUG = false;

const callbacks = {};
let transaction_id = 0;

ipcRenderer.on('sqlite3_db_all_callback', (event, arg) => {
    logIf(DEBUG, 'Received db transaction request ' + arg.id);
    if(callbacks[arg.id]) {
        callbacks[arg.id](arg.err, arg.rows);
        delete callbacks[arg.id];
    }
});

export const extract_settings = function(item) {
    var settings = Object.assign({}, item);
    ['id', 'type', 'content', 'title', 'x', 'y', 'z'].forEach((val) => {
        delete settings[val];
    });
    return JSON.stringify(settings);
};

export const combine_settings = function(item) {
    if(Array.isArray(item)) {
        item.forEach((item) => { combine_settings(item); });
    } else {
        var settings = JSON.parse(item.settings);
        Object.assign(item, settings);
        delete item.settings;
    }
};

export const db = {
    all: function(query, params, callback) {
        var parcel = {
            id: transaction_id++,
            query: query
        };

        switch(arguments.length) {
        case 2:
            callbacks[parcel.id] = params;
            break;
        case 3:
            parcel.params = params;
            callbacks[parcel.id] = callback;
            break;
        }

        ipcRenderer.send('sqlite3_db_all', parcel);
        logIf(DEBUG, 'Sent db transaction request ' + parcel.id);
    }
};