const { BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');


module.exports = function(config) {

    var opts = {
        title: 'Corkboard',
        show: false
    };
    Object.assign(opts, config.get('winBounds'));

    var win = new BrowserWindow(opts);

    if (process.env.NODE_ENV == 'development') {
        require('vue-devtools').install();
        win.toggleDevTools();
    }

    win.setMenu(null);

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    return win;
};