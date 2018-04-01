import { db, DB_STICKIES } from '../../data/indexeddb';

import {
    A_APP_OBSERVE_Z,
    A_LOAD_STATE,
    A_STICKY_EDIT_CONTENT,
    A_STICKY_NEW,
    A_STICKY_DELETE,
    A_STICKY_PROMOTE,
    A_STICKY_TOGGLE_FIELD,
    A_STICKY_MOVE_STARTED,
    A_STICKY_MOVE,
    A_STICKY_MOVE_FINISHED,
    A_STICKY_CYCLE_COLOUR
} from '../action_types';

import {
    M_APP_OBSERVE_Z,
    M_STICKY_LOAD,
    M_STICKY_SAVE,
    M_STICKY_NEW,
    M_STICKY_EDIT_CONTENT,
    M_STICKY_DELETE,
    M_STICKY_PROMOTE,
    M_STICKY_TOGGLE_FIELD,
    M_STICKY_MOVE,
    M_STICKY_CYCLE_COLOUR,
    M_STICKY_CALCULATE_GROUP,
    M_STICKY_CLEAR_GROUP
} from '../mutation_types';

export default {
    [A_LOAD_STATE]: function(context) {
        var tx = db.transaction(DB_STICKIES, 'readwrite');
        var store = tx.objectStore(DB_STICKIES);
        var req = store.getAll();
        req.onsuccess = function() {
            for(var i = 0; i < req.result.length; i++) {
                context.commit(M_STICKY_LOAD, req.result[i]);
                context.commit(A_APP_OBSERVE_Z, req.result[i].z);
            }
        };
    },
    [A_STICKY_EDIT_CONTENT]: function(context, payload) {
        context.commit(M_STICKY_EDIT_CONTENT, payload);
        context.commit(M_STICKY_SAVE, payload.id);
    },
    [A_STICKY_NEW]: function(context, payload){
        var id = (new Date().getTime());
        var obj = {
            id: id,
            content: payload.content || '',
            x: payload.x,
            y: payload.y,
            z: context.getters.maxZ + 1,
            colour: 0,
            bold: false,
            wide: false,
            centre: false
        };

        context.commit(M_STICKY_NEW, obj);
        context.commit(M_APP_OBSERVE_Z, obj.z);
        context.commit(M_STICKY_SAVE, id);
    },
    [A_STICKY_DELETE]: function(context, id) {
        var tx = db.transaction(DB_STICKIES, 'readwrite');
        var store = tx.objectStore(DB_STICKIES);
        var req = store.delete(+id);
        req.onsuccess = function() {
            context.commit(M_STICKY_DELETE, id);
            console.log('Sticky ' + id + ' deleted');
        };
        req.onerror = function(event) {
            console.error('Error deleting Sticky ' + id);
            console.error(event);
        };
    },
    [A_STICKY_PROMOTE]: function(context, id) {
        var obj = {
            id: id,
            z: context.getters.maxZ + 1
        };
        context.commit(M_STICKY_PROMOTE, obj);
        context.commit(M_APP_OBSERVE_Z, obj.z);
        context.commit(M_STICKY_SAVE, id);
    },
    [A_STICKY_TOGGLE_FIELD]: function(context, payload) {
        context.commit(M_STICKY_TOGGLE_FIELD, payload);
        context.commit(M_STICKY_SAVE, payload.id);
    },
    [A_STICKY_MOVE_STARTED]: function(context, id) {
        context.commit(M_STICKY_CALCULATE_GROUP, id);
        for(var i = 0; i < context.getters.sticky_move_group.length; i++) {
            var obj = {
                id: context.getters.sticky_move_group[i],
                z: context.getters.maxZ + 1
            };
            context.commit(M_STICKY_PROMOTE, obj);
            context.commit(M_APP_OBSERVE_Z, obj.z);
        }
    },
    [A_STICKY_MOVE]: function(context, payload) {
        context.commit(M_STICKY_MOVE, payload);
    },
    [A_STICKY_MOVE_FINISHED]: function(context) {
        for(var i = 0; i < context.getters.sticky_move_group.length; i++) {
            context.commit(M_STICKY_SAVE, context.getters.sticky_move_group[i]);
        }
        context.commit(M_STICKY_CLEAR_GROUP);
    },
    [A_STICKY_CYCLE_COLOUR]: function(context, itemId) {
        context.commit(M_STICKY_CYCLE_COLOUR, itemId);
        context.commit(M_STICKY_SAVE, itemId);
    }
};