import { A_APP_OBSERVE_Z } from './action_types';
import { M_APP_OBSERVE_Z } from './mutation_types';

export default {
    state: {
        godmode: false,
        maxZ: 0
    },
    getters: {
        maxZ: function(state) {
            return state.maxZ;
        }
    },
    actions: {
        toggle_godmode: function(context) {
            context.commit('toggle_godmode');
        },
        [A_APP_OBSERVE_Z]: function(context, z) {
            context.commit(M_APP_OBSERVE_Z, z);
        }
    },
    mutations: {
        toggle_godmode: function(state) {
            state.godmode = !state.godmode;
        },
        [M_APP_OBSERVE_Z]: function(state, z) {
            state.maxZ = Math.max(state.maxZ, z);
        }
    }
}