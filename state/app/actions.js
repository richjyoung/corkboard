import { 
    A_APP_OBSERVE_Z,
    A_APP_TOGGLE_GODMODE
} from '../action_types';

import { 
    M_APP_OBSERVE_Z,
    M_APP_TOGGLE_GODMODE
} from '../mutation_types';

export default {
    [A_APP_TOGGLE_GODMODE]: function(context) {
        context.commit(M_APP_TOGGLE_GODMODE);
    },
    [A_APP_OBSERVE_Z]: function(context, z) {
        context.commit(M_APP_OBSERVE_Z, z);
    }
}