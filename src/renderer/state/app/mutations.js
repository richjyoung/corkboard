import {
    M_APP_OBSERVE_Z,
    M_APP_TOGGLE_GODMODE,
    M_APP_ZOOM_SET
} from '../mutation_types';
import { LOCALSTORAGE_ZOOM_FACTOR } from './state';
import { webFrame } from 'electron';

const MAX_ZOOM_FACTOR = 2;
const MIN_ZOOM_FACTOR = 0.5;

export default {
    [M_APP_OBSERVE_Z](state, zIndex) {
        state.maxZ = Math.max(state.maxZ, zIndex);
    },
    [M_APP_TOGGLE_GODMODE](state) {
        state.godmode = !state.godmode;
    },
    [M_APP_ZOOM_SET](state, zoomFactor) {
        let clippedZoomFactor = Math.min(zoomFactor, MAX_ZOOM_FACTOR);
        clippedZoomFactor = Math.max(clippedZoomFactor, MIN_ZOOM_FACTOR);
        state.zoomFactor = clippedZoomFactor;
        webFrame.setZoomFactor(clippedZoomFactor);
        localStorage.setItem(LOCALSTORAGE_ZOOM_FACTOR, clippedZoomFactor);
    }
};
