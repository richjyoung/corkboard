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

export default {
    [A_APP_TOGGLE_GODMODE]: function(context) {
        context.commit(M_APP_TOGGLE_GODMODE);
    },
    [A_APP_OBSERVE_Z]: function(context, z) {
        context.commit(M_APP_OBSERVE_Z, z);
    },
    [A_APP_ZOOM_IN]: function(context) {
        context.commit(M_APP_ZOOM_SET, context.getters.zoom_factor + 0.1);
    },
    [A_APP_ZOOM_OUT]: function(context) {
        context.commit(M_APP_ZOOM_SET, context.getters.zoom_factor - 0.1);
    },
    [A_APP_ZOOM_RESET]: function(context) {
        context.commit(M_APP_ZOOM_SET, 1);
    }
}