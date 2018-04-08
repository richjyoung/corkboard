import { App } from './index';

export default class {

    static db_load_all(evt, callback) {
        var query = 'SELECT id, type, content, title, x, y, z, settings from corkboard;';
        App.database.connection.all(query, (err, rows) => {
            if(err) {
                callback(err);
            } else {
                rows.forEach((x) => {
                    if(x.settings) {
                        x.settings = JSON.parse(x.settings);
                    } else {
                        x.settings = {};
                    }
                });
                callback(undefined, rows);
            }
        });
    }

    static db_add_item(evt, item, callback) {
        var query = [
            'INSERT INTO corkboard (',
            'type, content, title, x, y, z, settings',
            ') VALUES (',
            '?, ?, ?, ?, ?, ?, ?',
            ');'
        ].join('');

        var params = [
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
                callback(err);
            } else {
                App.database.connection.all('SELECT last_insert_rowid();', (err, rows) => {
                    if(err) {
                        callback(err);
                    } else {
                        callback(undefined, rows[0]['last_insert_rowid()']);
                    }
                });
            }
        });
    }

    static db_move_finish(evt, indexes, delta, callback) {
        var query = [
            'UPDATE corkboard SET',
            'x = x + ?,',
            'y = y + ?',
            'WHERE id in (',
            indexes.join(','),
            ')'
        ].join(' ');

        var params = [
            delta.dx,
            delta.dy
        ];

        App.database.connection.all(query, params, callback);
    }

    static db_set_field(evt, id, field, value, callback) {
        if(typeof value === 'object') {
            value = JSON.stringify(value);
        }

        var query = [
            'UPDATE corkboard SET',
            field + '=?',
            'WHERE id=?'
        ].join(' ');

        var params = [
            value,
            id
        ];

        App.database.connection.all(query, params, callback);
    }

    static db_delete(evt, id, callback) {
        var query = [
            'DELETE FROM corkboard',
            'WHERE id=?;'
        ].join(' ');

        var params = [
            id
        ];

        App.database.connection.all(query, params, callback);
    }

    static toggle_fullscreen(evt) {
        App.web_contents_window(evt.sender).toggle_fullscreen();
    }

    static toggle_devtools(evt) {
        App.web_contents_window(evt.sender).toggle_dev_tools();
    }

}