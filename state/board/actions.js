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
    M_BOARD_ITEM_SAVE,
    M_BOARD_ITEM_DELETE
} from '../mutation_types';

import { db, DB_CORKBOARD } from '../../data/indexeddb';

export default {
    [A_LOAD_ALL]: function(context) {
        var tx = db.transaction(DB_CORKBOARD, 'readwrite');
        var store = tx.objectStore(DB_CORKBOARD);
        var req = store.getAll();

        req.onsuccess = function() {
            for(var i = 0; i < req.result.length; i++) {
                context.commit(M_BOARD_ADD_ITEM, req.result[i]);
            }
        };
    },
    [A_BOARD_ADD_ITEM]: function(context, item) {
        item.id = item.id || (new Date().getTime());
        var tx = db.transaction(DB_CORKBOARD, 'readwrite');
        var store = tx.objectStore(DB_CORKBOARD);
        var req = store.put(item);

        req.onsuccess = function() {
            context.commit(M_BOARD_ADD_ITEM, item);
        };
    },
    [A_BOARD_MOVE_START]: function(context, index) {
        context.commit(M_BOARD_START_ACTION, index);
        context.commit(M_BOARD_PROMOTE_ACTION_GROUP);
    },
    [A_BOARD_MOVE]: function(context, payload) {
        context.commit(M_BOARD_MOVE_ACTION_GROUP, payload);
    },
    [A_BOARD_MOVE_FINISH]: function(context) {
        var tx = db.transaction(DB_CORKBOARD, 'readwrite');
        var store = tx.objectStore(DB_CORKBOARD);
        context.getters.board_action_group.forEach((item) => {
            var req = store.put(item);
            req.onsuccess = function() {
                console.log('Saved item ' + item.id);
            };
        });

        context.commit(M_BOARD_FINISH_ACTION);
    },
    [A_BOARD_ITEM_SET_FIELD]: function(context, payload) {
        context.commit(M_BOARD_ITEM_SET_FIELD, payload);
        context.commit(M_BOARD_ITEM_SAVE, payload.index);
    },
    [A_BOARD_ITEM_DELETE]: function(context, index) {
        var id = context.getters.board_item_by_index(index).id;
        var tx = db.transaction(DB_CORKBOARD, 'readwrite');
        var store = tx.objectStore(DB_CORKBOARD);
        var req = store.delete(id);
        req.onsuccess = function() {
            context.commit(M_BOARD_ITEM_DELETE, index);
            console.log('Sticky ' + id + ' deleted');
        };
        req.onerror = function(event) {
            console.error('Error deleting Sticky ' + id);
            console.error(event);
        };
    }
};