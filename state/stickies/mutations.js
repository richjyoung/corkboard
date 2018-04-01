import Vue from 'vue';
import { db, DB_STICKIES } from '../../data/indexeddb';
import rem_to_px from '../../utils/rem_to_px';

import {
    M_STICKY_LOAD,
    M_STICKY_NEW,
    M_STICKY_SAVE,
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
        state.move_group.forEach(element => {
            state.items[element].x += payload.x;
            state.items[element].y += payload.y;
        });
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
    },
    [M_STICKY_CALCULATE_GROUP]: function(state, id) {
        // Root element
        var root = state.items[id];
        state.move_group.push(+id);

        // All elements below current in page, sorted in top-to-bottom order
        var sorted_ids = Object.keys(state.items).filter((x) => {
            return state.items[x].y >= root.y;
        }).map((x) => {
            return +x;
        }).sort((a, b) => {
            return state.items[b].y < state.items[a].y;
        });


        for(var i = 0; i < sorted_ids.length; i++) {
            var current = state.items[sorted_ids[i]];

            for(var j = 0; j < state.move_group.length; j++) {
                var parent = state.items[state.move_group[j]];
                var parent_width = parent.wide ? rem_to_px(25) : rem_to_px(15);
                var parent_height = rem_to_px(15);

                if(Math.abs(parent.x - current.x) < parent_width) {
                    if(current.y - parent.y < parent_height) {
                        if(current.z > parent.z) {
                            state.move_group.push(+current.id);
                            break;
                        }
                    }
                }
            }
        }

    },
    [M_STICKY_CLEAR_GROUP]: function(state) {
        state.move_group = [];
    }
};