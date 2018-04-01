const { ipcMain } = require('electron');

module.exports = function(win) {

    ipcMain.on('toggle_fullscreen', function() {
        console.log('Event received: toggle_fullscreen');
        win.setFullScreen(!win.isFullScreen());
    });

    ipcMain.on('toggle_devtools', function() {
        console.log('Event received: toggle_devtools');
        win.toggleDevTools();
    });

};
