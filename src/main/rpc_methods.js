import { App } from './index';

const QUERY_LAST_ROW = 'SELECT last_insert_rowid();';

export default class {
    static db_load_all(evt, callback) {
        const query = [
            'SELECT id, type, content, title, x, y, z, settings',
            'FROM corkboard;'
        ].join(' ');

        App.database.connection.all(query, (err, rows) => {
            if(err) {
                return callback(err);
            }
            rows.forEach((row) => {
                if(row.settings) {
                    row.settings = JSON.parse(row.settings);
                } else {
                    row.settings = {};
                }
            });
            return callback(null, rows);
        });
    }

    static db_add_item(evt, item, callback) {
        const query = [
            'INSERT INTO corkboard (',
            'type, content, title, x, y, z, settings',
            ') VALUES (',
            '?, ?, ?, ?, ?, ?, ?',
            ');'
        ].join('');

        const params = [
            item.type,
            item.content,
            item.title,
            item.x,
            item.y,
            item.z,
            item.settings ? JSON.stringify(item.settings) : '{}'
        ];

        App.database.connection.all(query, params, (err) => {
            if(err) {
                return callback(err);
            }
            App.database.connection.all(QUERY_LAST_ROW, (err2, rows) => {
                if(err2) {
                    return callback(err2);
                }
                return callback(null, rows[0]['last_insert_rowid()']);
            });
            return null;
        });
    }

    static db_move_finish(evt, indexes, delta, callback) {
        const query = [
            'UPDATE corkboard SET',
            'x = x + ?,',
            'y = y + ?',
            'WHERE id in (',
            indexes.join(','),
            ')'
        ].join(' ');

        const params = [
            delta.dx,
            delta.dy
        ];

        App.database.connection.all(query, params, callback);
    }

    static db_set_field(evt, id, field, value, callback) {
        const query = [
            'UPDATE corkboard SET',
            `${field}=?`,
            'WHERE id=?'
        ].join(' ');

        const params = [
            value,
            id
        ].map((param) => {
            if(typeof param === 'object') {
                return JSON.stringify(param);
            }
            return param;
        });

        App.database.connection.all(query, params, callback);
    }

    static db_delete(evt, id, callback) {
        const query = [
            'DELETE FROM corkboard',
            'WHERE id=?;'
        ].join(' ');

        const params = [
            id
        ];

        App.database.connection.all(query, params, callback);
    }

    static toggle_fullscreen(evt) {
        App.webContentsWindow(evt.sender).toggle_fullscreen();
    }

    static toggle_devtools(evt) {
        App.webContentsWindow(evt.sender).toggle_dev_tools();
    }
}
