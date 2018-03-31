var { webFrame } = require('electron');

import { 
    M_APP_OBSERVE_Z,
    M_APP_TOGGLE_GODMODE,
    M_APP_ZOOM_SET
} from '../mutation_types';

export default {
    [M_APP_TOGGLE_GODMODE]: function(state) {
        state.godmode = !state.godmode;
    },
    [M_APP_OBSERVE_Z]: function(state, z) {
        state.maxZ = Math.max(state.maxZ, z);
    },
    [M_APP_ZOOM_SET]: function(state, f) {
        f = Math.min(f, 2);
        f = Math.max(f, 0.5);
        state.zoom_factor = f;
        webFrame.setZoomFactor(f);
        localStorage.setItem('zoom_factor', f);
    }
}