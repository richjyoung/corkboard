import {
    M_BOARD_ADD_ITEM,
    M_BOARD_FINISH_ACTION,
    M_BOARD_ITEM_DELETE,
    M_BOARD_ITEM_SET_FIELD,
    M_BOARD_MOVE_ACTION_GROUP,
    M_BOARD_PROMOTE_ACTION_GROUP,
    M_BOARD_START_ACTION
} from '../mutation_types';
import { logwrap } from '../../logwrap';
import Vue from 'vue';

const logger = logwrap('board/mutations');

export default {
    [M_BOARD_ADD_ITEM](state, item) {
        state.items.push(item);
    },
    [M_BOARD_FINISH_ACTION](state) {
        state.actionGroup = [];
    },
    [M_BOARD_ITEM_DELETE](state, index) {
        state.items.splice(index, 1);
    },
    [M_BOARD_ITEM_SET_FIELD](state, payload) {
        if(payload.field.split('.')[0] === 'settings') {
            // Settings field
            Vue.set(state.items[payload.index].settings,
                payload.field.split('.')[1], payload.value);
        } else {
            Vue.set(state.items[payload.index], payload.field, payload.value);
        }
    },
    [M_BOARD_MOVE_ACTION_GROUP](state, payload) {
        state.actionGroup.forEach((item) => {
            Vue.set(item, 'x', item.x + payload.x);
            Vue.set(item, 'y', item.y + payload.y);
        });
    },
    [M_BOARD_PROMOTE_ACTION_GROUP](state) {
        let maxZ = 0;
        const arr = state.items.map((item) => {
            return item.z;
        });
        if(arr.length !== 0) {
            maxZ = Math.max(...arr);
        }

        state.actionGroup.sort((a, b) => {
            return a.z > b.z;
        }).forEach((item) => {
            Vue.set(item, 'z', ++maxZ);
        });
    },
    [M_BOARD_START_ACTION](state, index) {
        // Root element
        const root = state.items[index];
        state.actionGroup.push(root);
        state.moveAction.id = index;
        state.moveAction.x = root.x;
        state.moveAction.y = root.y;

        // All elements below current in page, sorted in top-to-bottom order
        const possibleItems = state.items.filter((item) => {
            return item.y > root.y;
        }).sort((a, b) => {
            return a.y > b.y;
        });

        // Iterate possible items
        for(let i = 0; i < possibleItems.length; i++) {
            const current = possibleItems[i];

            // Check if any item in the action group is a parent of this item,
            // finding the lowest
            for(let j = state.actionGroup.length - 1; j >= 0; j--) {
                const parent = state.actionGroup[j];

                // Child on top of parent
                if(current.z <= parent.z) {
                    logger.debug(`${parent.id} -/-> ${current.id} (z below)`);
                    continue;
                }

                // Child below parent
                if(current.y - parent.y > parent.settings.height) {
                    logger.debug(`${parent.id} -/-> ${current.id} (y below)`);
                    continue;
                }

                // Parent left of child
                if(parent.x < current.x) {
                    if(current.x - parent.x > parent.settings.width) {
                        logger.debug(
                            `${parent.id} -/-> ${current.id} (x right)`);
                        continue;
                    }
                }

                // Child left of parent
                if(parent.x >= current.x) {
                    if(parent.x - current.x > current.settings.width) {
                        logger.debug(
                            `${parent.id} -/-> ${current.id} (x left)`);
                        continue;
                    }
                }

                logger.debug(`${parent.id} ---> ${current.id}`);
                state.actionGroup.push(current);
                break;
            }
        }
    }
};
