import {
    A_BOARD_ADD_ITEM,
    A_BOARD_ITEM_DELETE,
    A_BOARD_ITEM_SET_FIELD,
    A_BOARD_MOVE,
    A_BOARD_MOVE_FINISH,
    A_BOARD_MOVE_START,
    A_LOAD_ALL
} from '../action_types';
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
import { RPC } from '../../rpc_client';

const logger = logwrap('board/actions');

export default {
    [A_BOARD_ADD_ITEM](context, item) {
        item.settings = item.settings || {};
        RPC.db_add_item(item, (err, id) => {
            if(err) {
                logger.error(err);
            }
            item.id = id;
            logger.debug(`Added item ${item.id}`);
            context.commit(M_BOARD_ADD_ITEM, item);
        });
    },
    [A_BOARD_ITEM_DELETE](context, index) {
        const { id } = context.getters.board_item_by_index(index);

        RPC.db_delete(id, (err) => {
            if(err) {
                logger.error(err);
            }
            logger.debug(`Deleted item ${id}`);
            context.commit(M_BOARD_ITEM_DELETE, index);
        });
    },
    [A_BOARD_ITEM_SET_FIELD](context, payload) {
        context.commit(M_BOARD_ITEM_SET_FIELD, payload);
        const item = context.getters.board_item_by_index(payload.index);

        if(payload.field.split('.')[0] === 'settings') {
            // Settings field
            const settings = Object.assign({}, item.settings);
            settings[payload.field.split('.')[1]] = payload.value;
            payload.field = 'settings';
            payload.value = settings;
        }

        RPC.db_set_field(item.id, payload.field, payload.value, (err) => {
            if(err) {
                logger.error(err);
            }
            logger.debug(`Saved item ${item.id}`);
        });
    },
    [A_BOARD_MOVE](context, payload) {
        context.commit(M_BOARD_MOVE_ACTION_GROUP, payload);
    },
    [A_BOARD_MOVE_FINISH](context) {
        logger.debug('Finishing move action...');

        const indexes = context.getters.board_action_group.map((item) => {
            return item.id;
        });

        const delta = context.getters.board_move_delta;

        RPC.db_move_finish(indexes, delta, (err) => {
            if(err) {
                logger.error(err);
            }
            logger.debug(`Saved items ${indexes}`);
        });

        context.commit(M_BOARD_FINISH_ACTION);
        logger.debug('Move finished');
    },
    [A_BOARD_MOVE_START](context, index) {
        logger.debug('Starting move action...');
        context.commit(M_BOARD_START_ACTION, index);
        logger.debug('Bringing action group to top');
        context.commit(M_BOARD_PROMOTE_ACTION_GROUP);
        logger.debug('Move started');
    },
    [A_LOAD_ALL](context) {
        RPC.db_load_all((err, rows) => {
            if(err) {
                logger.error(err);
            }
            rows.forEach((row) => { context.commit(M_BOARD_ADD_ITEM, row); });
        });
    }
};
