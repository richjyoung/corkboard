const { webFrame } = require('electron');

var f = +localStorage.getItem('zoom_factor') || 1;
webFrame.setZoomFactor(f);

export default {
    godmode: false,
    maxZ: 0,
    zoom_factor: f
};