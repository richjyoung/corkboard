import { 
    M_APP_OBSERVE_Z,
    M_APP_TOGGLE_GODMODE
} from '../mutation_types';

export default {
    [M_APP_TOGGLE_GODMODE]: function(state) {
        state.godmode = !state.godmode;
    },
    [M_APP_OBSERVE_Z]: function(state, z) {
        state.maxZ = Math.max(state.maxZ, z);
    }
}