const { ipcMain } = require('electron');
const fs = require('fs');

module.exports = function(win) {

    ipcMain.on('toggle_fullscreen', function(event, arg) {
        console.log('toggle_fullscreen');
        win.setFullScreen(!win.isFullScreen());
    });

}
