import Vue from 'vue';
import { db, DB_STICKIES } from '../../data/indexeddb';

import {
    M_STICKY_LOAD,
    M_STICKY_NEW,
    M_STICKY_SAVE,
    M_STICKY_EDIT_CONTENT,
    M_STICKY_DELETE,
    M_STICKY_PROMOTE,
    M_STICKY_TOGGLE_FIELD,
    M_STICKY_MOVE,
    M_STICKY_CYCLE_COLOUR
} from '../mutation_types';

export default {
    [M_STICKY_LOAD]: function(state, payload) {
        Vue.set(state.items, payload.id, payload);
    },
    [M_STICKY_SAVE]: function(state, id) {
        var tx = db.transaction(DB_STICKIES, 'readwrite');
        var store = tx.objectStore(DB_STICKIES);
        if(state.items[id]) {
            console.log('Saving sticky ' + id + '...');
            store.put(state.items[id]);
        } else {
            console.error('Unknown sticky ID: ' + id);
        }
    },
    [M_STICKY_MOVE]: function(state, payload) {
        state.items[payload.id].x += payload.x;
        state.items[payload.id].y += payload.y;
    },
    [M_STICKY_EDIT_CONTENT]: function(state, payload) {
        state.items[payload.id].content = payload.value;
    },
    [M_STICKY_PROMOTE]: function(state, payload) {
        state.items[payload.id].z = payload.z;
    },
    [M_STICKY_NEW]: function(state, payload) {
        Vue.set(state.items, payload.id, payload);
    },
    [M_STICKY_DELETE]: function(state, id) {
        Vue.delete(state.items, id);
    },
    [M_STICKY_TOGGLE_FIELD]: function(state, payload) {
        Vue.set(state.items[payload.id], payload.field, !state.items[payload.id][payload.field]);
    },
    [M_STICKY_CYCLE_COLOUR]: function(state, itemId) {
        Vue.set(state.items[itemId], 'colour', (state.items[itemId].colour + 1) % 4);
    }
}