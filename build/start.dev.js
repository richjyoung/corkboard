const path = require('path');
const chalk = require('chalk');
const { spawn } = require('child_process');
const webpack = require('webpack');

const ELECTRON_PATH = '../node_modules/electron/dist/electron';

const rendererConfig = require('./webpack.renderer.config');
const mainConfig = require('./webpack.main.config');

const statConfig = {
    colors: true,
    excludeModules: /node_modules/
};

const TAG_WIDTH = 10;
const EX_SUCCESS = 0;

let electronProcess; // eslint-disable-line init-declarations
let closing = false;

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

watch(mainConfig, (err, stats) => { // eslint-disable-line max-statements
    if(electronProcess) {
        log('main', 'blue', 'Stopping existing child process...');
        closing = true;
        electronProcess.kill();
    }
    if(err) {
        log('main', 'blue', err.stack || err);
    } else if(stats.hasErrors()) {
        log('main', 'blue', stats.toString(statConfig));
    } else {
        log('main', 'blue', stats.toString(statConfig));
        electronProcess = spawn(path.resolve(__dirname, ELECTRON_PATH), [
            '--inspect=5858',
            path.join(__dirname, '..')
        ]);
        electronProcess.stdout.on('data', (data) => {
            log('electron', 'yellow', `${data}`);
        });
        electronProcess.stderr.on('data', (data) => {
            log('electron', 'red', `${data}`);
        });
        electronProcess.on('close', () => {
            if(!closing) {
                process.exit(EX_SUCCESS); // eslint-disable-line no-process-exit
            }
            closing = false;
        });
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
