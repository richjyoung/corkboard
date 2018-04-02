import Vue from 'vue';

import {
    M_BOARD_ADD_ITEM,
    M_BOARD_ITEM_SET_FIELD,
    M_BOARD_START_ACTION,
    M_BOARD_FINISH_ACTION,
    M_BOARD_MOVE_ACTION_GROUP,
    M_BOARD_PROMOTE_ACTION_GROUP,
    M_BOARD_ITEM_SAVE,
    M_BOARD_ITEM_DELETE
} from '../mutation_types';

import { db, DB_CORKBOARD } from '../../data/indexeddb';

export default {
    [M_BOARD_ADD_ITEM]: function(state, item) {
        state.items.push(item);
    },
    [M_BOARD_ITEM_SET_FIELD]: function(state, payload) {
        // console.log('M_BOARD_ITEM_SET_FIELD: payload=' + JSON.stringify(payload));
        Vue.set(state.items[payload.index], payload.field, payload.value);
    },
    [M_BOARD_START_ACTION]: function(state, index) {
        // Root element
        var root = state.items[index];
        state.action_group.push(root);

        // All elements below current in page, sorted in top-to-bottom order
        var possible_items = state.items.filter((x) => {
            return x.y > root.y;
        }).sort((a, b) => {
            return a.y > b.y;
        });

        // Iterate possible items
        for(var i = 0; i < possible_items.length; i++) {
            var current = possible_items[i];

            // Check if any item in the action group is a parent of this item, finding the lowest
            for(var j = state.action_group.length - 1; j >= 0; j--) {
                var parent = state.action_group[j];

                // Child on top of parent
                if(current.z <= parent.z) {
                    console.log(parent.id + ' -/-> ' + current.id);
                    continue;
                }

                // Child below parent
                if(current.y - parent.y > parent.height) {
                    console.log(parent.id + ' -/-> ' + current.id);
                    continue;
                }

                // Parent left of child
                if(parent.x < current.x) {
                    if((current.x - parent.x) > parent.width) {
                        console.log(parent.id + ' -/-> ' + current.id);
                        continue;
                    }
                }

                // Child left of parent
                if(parent.x >= current.x) {
                    if((parent.x - current.x) > current.width) {
                        console.log(parent.id + ' -/-> ' + current.id);
                        continue;
                    }
                }

                console.log(parent.id + ' ---> ' + current.id);
                state.action_group.push(current);
                break;
            }
        }
    },
    [M_BOARD_MOVE_ACTION_GROUP]: function(state, payload) {
        state.action_group.forEach((item) => {
            Vue.set(item, 'x', item.x + payload.x);
            Vue.set(item, 'y', item.y + payload.y);
        });
    },
    [M_BOARD_PROMOTE_ACTION_GROUP]: function(state) {
        var max_z = 0;
        var arr = state.items.map((item) => {
            return item.z;
        });
        if(arr.length !== 0) {
            max_z = Math.max(...arr);
        }

        state.action_group.sort((a, b) => {
            return a.z > b.z;
        }).forEach((item) => {
            Vue.set(item, 'z', ++max_z);
        });
    },
    [M_BOARD_FINISH_ACTION]: function(state) {
        state.action_group = [];
    },
    [M_BOARD_ITEM_SAVE]: function(state, index) {
        var tx = db.transaction(DB_CORKBOARD, 'readwrite');
        var store = tx.objectStore(DB_CORKBOARD);
        var req = store.put(state.items[index]);
        req.onsuccess = function() {
            console.log('Saved item ' + state.items[index].id);
        };
    },
    [M_BOARD_ITEM_DELETE]: function(state, index) {
        state.items.splice(index, 1);
    }
};