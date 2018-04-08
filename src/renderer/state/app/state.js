import { webFrame } from 'electron';

export const LOCALSTORAGE_ZOOM_FACTOR = 'zoomFactor';

const lastZoomFactor = Number(localStorage.getItem(LOCALSTORAGE_ZOOM_FACTOR))
    || 1;

export default {
    godmode: false,
    maxZ: 0,
    zoomFactor: lastZoomFactor
};

webFrame.setZoomFactor(lastZoomFactor);
