const path = require('path');
const chalk = require('chalk');
const { spawn } = require('child_process');
const webpack = require('webpack');

const renderer_config = require('./webpack.renderer.config');
const main_config = require('./webpack.main.config');

const stat_config = {
    colors: true,
    excludeModules: /node_modules/
};

let electron_process;

watch(main_config, (err, stats) => {
    if(electron_process) {
        log('main', 'blue', 'Stopping existing child process...');
        electron_process.kill();
    }
    if (err) {
        log('main', 'blue', err.stack || err);
    } else if (stats.hasErrors()) {
        log('main', 'blue', stats.toString(stat_config));
    } else {
        log('main', 'blue', stats.toString(stat_config));
        electron_process = spawn(path.resolve(__dirname, '../node_modules/electron/dist/electron.exe'), [
            path.join(__dirname, '..')
        ]);
        electron_process.stdout.on('data', (data) => {
            log('electron', 'yellow', `${data}`);
        });

        electron_process.stderr.on('data', (data) => {
            log('electron', 'red', `${data}`);
        });
    }
});

watch(renderer_config, (err, stats) => {
    if (err) {
        log('renderer', 'green', err.stack || err);
    } else if (stats.hasErrors()) {
        log('renderer', 'green', stats.toString(stat_config));
    } else {
        log('renderer', 'green', stats.toString(stat_config));
    }
});

function watch(config, callback) {
    config.mode = 'development';
    // var lasthash = null;
    webpack(config).watch({
        aggregateTimeout: 300,
        poll: undefined
    }, (err, stats) => {
        // if(lasthash !== stats.hash) {
        // }
        callback(err, stats);
        // lasthash = stats.hash;
    });
}

function log(tag, colour, content) {
    var prefix = chalk[colour](tag.padEnd(10)) + '| ';
    content.split('\n').forEach((line) => {
        if(line) {
            console.log(prefix + line);
        }
    });
}