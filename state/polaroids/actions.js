import {
    A_LOAD_STATE,
    A_POLAROID_EDIT_CAPTION,
    A_POLAROID_MOVE,
    A_POLAROID_MOVE_FINISHED,
    A_POLAROID_NEW,
    A_POLAROID_DELETE,
    A_APP_OBSERVE_Z,
    A_POLAROID_PROMOTE
} from '../action_types';

import {
    M_POLAROID_EDIT_CAPTION,
    M_POLAROID_MOVE,
    M_POLAROID_NEW,
    M_POLAROID_DELETE,
    M_POLAROID_LOAD,
    M_POLAROID_SAVE,
    M_APP_OBSERVE_Z,
    M_POLAROID_PROMOTE
} from '../mutation_types';

import { db, DB_POLAROIDS } from '../../data/indexeddb';

export default {
    [A_LOAD_STATE]: function(context) {
        var tx = db.transaction(DB_POLAROIDS, 'readwrite');
        var store = tx.objectStore(DB_POLAROIDS);
        var req = store.getAll();

        req.onsuccess = function() {
            for(var i = 0; i < req.result.length; i++) {
                context.commit(M_POLAROID_LOAD, req.result[i]);
                context.commit(A_APP_OBSERVE_Z, req.result[i].z);
            }
        }
    },
    [A_POLAROID_PROMOTE]: function(context, id) {
        var obj = {
            id: id,
            z: context.getters.maxZ + 1
        }
        context.commit(M_POLAROID_PROMOTE, obj);
        context.commit(M_APP_OBSERVE_Z, obj.z);
        context.commit(M_POLAROID_SAVE, id);
    },
    [A_POLAROID_EDIT_CAPTION]: function(context, payload) {
        context.commit(M_POLAROID_EDIT_CAPTION, payload);
        context.commit(M_POLAROID_SAVE, payload.itemId);
    },
    [A_POLAROID_MOVE]: function(context, payload) {
        context.commit(M_POLAROID_MOVE, payload);
    },
    [A_POLAROID_MOVE_FINISHED]: function(context, id) {
        context.commit(M_POLAROID_SAVE, id);
    },
    [A_POLAROID_NEW]: function(context, payload) {
        var id = (new Date().getTime());
        var obj = {
            id: +id,
            x: +payload.x,
            y: +payload.y,
            z: context.getters.maxZ + 1,
            url: payload.url || '',
            caption: payload.caption || ''
        };

        context.commit(M_POLAROID_NEW, obj);
        context.commit(M_APP_OBSERVE_Z, obj.z);
        context.commit(M_POLAROID_SAVE, id);
    },
    [A_POLAROID_DELETE]: function(context, itemId) {
        var tx = db.transaction(DB_POLAROIDS, 'readwrite');
        var store = tx.objectStore(DB_POLAROIDS);
        var req = store.delete(+itemId);
        req.onsuccess = function() {
            context.commit(M_POLAROID_DELETE, itemId);
            console.log('Polaroid ' + itemId + ' deleted');
        }
        req.onerror = function(event) {
            console.error('Error deleting Polaroid ' + itemId);
            console.error(event);
        }
    }
};