import Vue from 'vue';
import {
    M_POLAROID_EDIT_CAPTION,
    M_POLAROID_MOVE,
    M_POLAROID_NEW,
    M_POLAROID_DELETE,
    M_POLAROID_LOAD,
    M_POLAROID_SAVE,
    M_POLAROID_PROMOTE
} from '../mutation_types';

import { db, DB_POLAROIDS } from '../../data/indexeddb';

export default {
    [M_POLAROID_SAVE]: function(state, id) {
        var tx = db.transaction(DB_POLAROIDS, 'readwrite');
        var store = tx.objectStore(DB_POLAROIDS);
        if(state.items[id]) {
            console.log('Saving polaroid ' + id + '...');
            store.put(state.items[id]);
        } else {
            console.error('Unknown polaroid ID: ' + id);
        }
    },
    [M_POLAROID_LOAD]: function(state, payload) {
        Vue.set(state.items, payload.id, payload);
    },
    [M_POLAROID_EDIT_CAPTION]: function(state, payload) {
        state.items[payload.itemId].caption = payload.value;
    },
    [M_POLAROID_MOVE]: function(state, payload) {
        state.items[payload.itemId].x += payload.x;
        state.items[payload.itemId].y += payload.y;
    },
    [M_POLAROID_NEW]: function(state, payload) {
        var id = (new Date().getTime());
        var obj = {
            id: +id,
            x: +payload.x,
            y: +payload.y,
            z: 1000,
            url: payload.url,
            caption: payload.caption || ''
        }

        Vue.set(state.items, id, obj);
    },
    [M_POLAROID_DELETE]: function(state, itemId) {
        Vue.delete(state.items, itemId);
    },
    [M_POLAROID_PROMOTE]: function(state, payload) {
        state.items[payload.id].z = payload.z;
    }
};