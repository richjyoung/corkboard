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

import { RPC } from '../../rpc_client';

const DEBUG = false;

export default {
    [A_LOAD_ALL]: function(context) {
        RPC.db_load_all((err, rows) => {
            errorIf(err, err);
            rows.forEach((row) => { context.commit(M_BOARD_ADD_ITEM, row); });
        });
    },
    [A_BOARD_ADD_ITEM]: function(context, item) {
        item.settings = item.settings || {};
        item.id = undefined;
        RPC.db_add_item(item, (err, id) => {
            errorIf(err, err);
            item.id = id;
            logIf(DEBUG, 'Added item ' + item.id);
            context.commit(M_BOARD_ADD_ITEM, item);
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

        var indexes = context.getters.board_action_group.map((x) => {
            return x.id;
        });

        var delta = context.getters.board_move_delta;

        RPC.db_move_finish(indexes, delta, (err) => {
            errorIf(err, err);
            logIf(DEBUG, 'Saved items ' + indexes);
        });

        context.commit(M_BOARD_FINISH_ACTION);
        logIf(DEBUG, 'Move finished');
    },
    [A_BOARD_ITEM_SET_FIELD]: function(context, payload) {
        context.commit(M_BOARD_ITEM_SET_FIELD, payload);
        var item = context.getters.board_item_by_index(payload.index);

        if(payload.field.split('.')[0] === 'settings') {
            // Settings field
            var settings = Object.assign({}, item.settings);
            settings[payload.field.split('.')[1]] = payload.value;
            payload.field = 'settings';
            payload.value = settings;
        }

        RPC.db_set_field(item.id, payload.field, payload.value, (err) => {
            errorIf(err, err);
            logIf(DEBUG, 'Saved item ' + item.id);
        });

    },
    [A_BOARD_ITEM_DELETE]: function(context, index) {
        var id = context.getters.board_item_by_index(index).id;

        RPC.db_delete(id, (err) => {
            errorIf(err, err);
            logIf(DEBUG, 'Deleted item ' + id);
            context.commit(M_BOARD_ITEM_DELETE, index);
        });
    }
};