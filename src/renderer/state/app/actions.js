import {
    A_APP_OBSERVE_Z,
    A_APP_TOGGLE_GODMODE,
    A_APP_ZOOM_IN,
    A_APP_ZOOM_OUT,
    A_APP_ZOOM_RESET
} from '../action_types';

import {
    M_APP_OBSERVE_Z,
    M_APP_TOGGLE_GODMODE,
    M_APP_ZOOM_SET
} from '../mutation_types';

const ZOOM_INCREMENT = 0.1;

export default {
    [A_APP_OBSERVE_Z](context, zIndex) {
        context.commit(M_APP_OBSERVE_Z, zIndex);
    },
    [A_APP_TOGGLE_GODMODE](context) {
        context.commit(M_APP_TOGGLE_GODMODE);
    },
    [A_APP_ZOOM_IN](context) {
        context.commit(M_APP_ZOOM_SET,
            context.getters.zoom_factor + ZOOM_INCREMENT);
    },
    [A_APP_ZOOM_OUT](context) {
        context.commit(M_APP_ZOOM_SET,
            context.getters.zoom_factor - ZOOM_INCREMENT);
    },
    [A_APP_ZOOM_RESET](context) {
        context.commit(M_APP_ZOOM_SET, 1);
    }
};
