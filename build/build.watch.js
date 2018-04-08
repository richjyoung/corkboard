const chalk = require('chalk');
const webpack = require('webpack');

const rendererConfig = require('./webpack.renderer.config');
const mainConfig = require('./webpack.main.config');

const statConfig = {
    colors: true,
    excludeModules: /node_modules/
};

const TAG_WIDTH = 10;

function watch(config, callback) {
    let lasthash = null;
    config.mode = 'development';
    webpack(config).watch({}, (err, stats) => {
        if(lasthash !== stats.hash) {
            lasthash = stats.hash;
            return callback(err, stats);
        }
        lasthash = stats.hash;
        return null;
    });
}

function log(tag, colour, content) {
    const prefix = `${chalk[colour](tag.padEnd(TAG_WIDTH))}| `;
    content.split('\n').forEach((line) => {
        if(line) {
            console.log(prefix + line); // eslint-disable-line no-console
        }
    });
}

watch(mainConfig, (err, stats) => {
    if(err) {
        log('main', 'blue', err.stack || err);
    } else if(stats.hasErrors()) {
        log('main', 'blue', stats.toString(statConfig));
    } else {
        log('main', 'blue', stats.toString(statConfig));
    }
});

watch(rendererConfig, (err, stats) => {
    if(err) {
        log('renderer', 'green', err.stack || err);
    } else if(stats.hasErrors()) {
        log('renderer', 'green', stats.toString(statConfig));
    } else {
        log('renderer', 'green', stats.toString(statConfig));
    }
});
