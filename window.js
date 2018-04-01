const { BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');


module.exports = function(index) {

    var win = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Corkboard'
    });

    if (process.env.NODE_ENV == 'development') {
        require('vue-devtools').install();
        win.toggleDevTools();
    }

    win.setMenu(null);

    win.loadURL(url.format({
        pathname: path.join(__dirname, index),
        protocol: 'file:',
        slashes: true
    }));

    return win;
};