import { logIf, errorIf } from '../../utils/logwrap';
import {
    A_LOAD_ALL,
    A_BOARD_ADD_ITEM,
    A_BOARD_MOVE_START,
    A_BOARD_MOVE,
    A_BOARD_MOVE_FINISH,
    A_BOARD_ITEM_SET_FIELD,
    A_BOARD_ITEM_DELETE
} from '../action_types';

import {
    M_BOARD_ADD_ITEM,
    M_BOARD_START_ACTION,
    M_BOARD_FINISH_ACTION,
    M_BOARD_MOVE_ACTION_GROUP,
    M_BOARD_PROMOTE_ACTION_GROUP,
    M_BOARD_ITEM_SET_FIELD,
    M_BOARD_ITEM_DELETE
} from '../mutation_types';

import { db, combine_settings, extract_settings } from '../sqlite3db_proxy';

const DEBUG = false;

export default {
    [A_LOAD_ALL]: function(context) {
        var query = 'SELECT id, type, content, title, x, y, z, settings from corkboard;';
        db.all(query, (err, rows) => {
            errorIf(err, err);
            combine_settings(rows);
            rows.forEach((row) => { context.commit(M_BOARD_ADD_ITEM, row); });
        });
    },
    [A_BOARD_ADD_ITEM]: function(context, item) {
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
            extract_settings(item)
        ];

        db.all(query, params, (err) => {
            errorIf(err, err);
            db.all('SELECT last_insert_rowid();', (err, rows) => {
                errorIf(err, err);
                item.id = rows[0]['last_insert_rowid()'];
                logIf(DEBUG, 'Added item ' + item.id);
                context.commit(M_BOARD_ADD_ITEM, item);
            });
        });
    },
    [A_BOARD_MOVE_START]: function(context, index) {
        logIf(DEBUG, 'Starting move action...');
        context.commit(M_BOARD_START_ACTION, index);
        logIf(DEBUG, 'Bringing action group to top');
        context.commit(M_BOARD_PROMOTE_ACTION_GROUP);
        logIf(DEBUG, 'Move started');
    },
    [A_BOARD_MOVE]: function(context, payload) {
        context.commit(M_BOARD_MOVE_ACTION_GROUP, payload);
    },
    [A_BOARD_MOVE_FINISH]: function(context) {
        logIf(DEBUG, 'Finishing move action...');
        context.getters.board_action_group.forEach((item) => {
            var query = [
                'UPDATE corkboard SET',
                'type=?, content=?, title=?, x=?, y=?, z=?, settings=?',
                'WHERE id=?'
            ].join(' ');

            var params = [
                item.type,
                item.content,
                item.title,
                item.x,
                item.y,
                item.z,
                extract_settings(item),
                item.id
            ];

            db.all(query, params, (err) => {
                errorIf(err, err);
                logIf(DEBUG, 'Saved item ' + item.id);
            });
        });

        context.commit(M_BOARD_FINISH_ACTION);
        logIf(DEBUG, 'Move finished');
    },
    [A_BOARD_ITEM_SET_FIELD]: function(context, payload) {
        context.commit(M_BOARD_ITEM_SET_FIELD, payload);
        var item = context.getters.board_item_by_index(payload.index);

        var query = [
            'UPDATE corkboard SET',
            'type=?, content=?, title=?, x=?, y=?, z=?, settings=?',
            'WHERE id=?'
        ].join(' ');

        var params = [
            item.type,
            item.content,
            item.title,
            item.x,
            item.y,
            item.z,
            extract_settings(item),
            item.id
        ];

        db.all(query, params, (err) => {
            errorIf(err, err);
            logIf(DEBUG, 'Saved item ' + item.id);
        });

    },
    [A_BOARD_ITEM_DELETE]: function(context, index) {
        var id = context.getters.board_item_by_index(index).id;
        var query = [
            'DELETE FROM corkboard',
            'WHERE id=?;'
        ].join(' ');

        var params = [
            id
        ];

        db.all(query, params, (err) => {
            errorIf(err, err);
            logIf(DEBUG, 'Deleted item ' + id);
            context.commit(M_BOARD_ITEM_DELETE, index);
        });
    }
};