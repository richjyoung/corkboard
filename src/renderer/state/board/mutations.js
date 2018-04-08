import Vue from 'vue';
import { logIf } from '../../utils/logwrap';
import {
    M_BOARD_ADD_ITEM,
    M_BOARD_ITEM_SET_FIELD,
    M_BOARD_START_ACTION,
    M_BOARD_FINISH_ACTION,
    M_BOARD_MOVE_ACTION_GROUP,
    M_BOARD_PROMOTE_ACTION_GROUP,
    M_BOARD_ITEM_DELETE
} from '../mutation_types';

const DEBUG = true;

export default {
    [M_BOARD_ADD_ITEM]: function(state, item) {
        state.items.push(item);
    },
    [M_BOARD_ITEM_SET_FIELD]: function(state, payload) {
        if(payload.field.split('.')[0] === 'settings') {
            // Settings field
            Vue.set(state.items[payload.index].settings, payload.field.split('.')[1], payload.value);
        } else {
            Vue.set(state.items[payload.index], payload.field, payload.value);
        }
    },
    [M_BOARD_START_ACTION]: function(state, index) {
        // Root element
        var root = state.items[index];
        state.action_group.push(root);
        state.move_action.id = index;
        state.move_action.x = root.x;
        state.move_action.y = root.y;

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
                    logIf(DEBUG, parent.id + ' -/-> ' + current.id + ' (z below)');
                    continue;
                }

                // Child below parent
                if(current.y - parent.y > parent.settings.height) {
                    logIf(DEBUG, parent.id + ' -/-> ' + current.id + ' (y below)');
                    continue;
                }

                // Parent left of child
                if(parent.x < current.x) {
                    if((current.x - parent.x) > parent.settings.width) {
                        logIf(DEBUG, parent.id + ' -/-> ' + current.id + ' (x right)');
                        continue;
                    }
                }

                // Child left of parent
                if(parent.x >= current.x) {
                    if((parent.x - current.x) > current.settings.width) {
                        logIf(DEBUG, parent.id + ' -/-> ' + current.id + ' (x left)');
                        continue;
                    }
                }

                logIf(DEBUG, parent.id + ' ---> ' + current.id);
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
    [M_BOARD_ITEM_DELETE]: function(state, index) {
        state.items.splice(index, 1);
    }
};