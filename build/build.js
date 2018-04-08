const del = require('del');
const Spinner = require('multispinner');
const webpack = require('webpack');

const rendererConfig = require('./webpack.renderer.config');
const mainConfig = require('./webpack.main.config');

const EX_SUCCESS = 0;
const EX_FATAL = 1;
const SPINNER_INTERVAL = 50;

const spinner = new Spinner({
    del: 'Cleaning output directory',
    main: 'Building main process',
    renderer: 'Building renderer process'
}, { interval: SPINNER_INTERVAL });

function pack(config, tag) {
    config.mode = process.env.NODE_ENV || 'production';
    const statConfig = {
        colors: true,
        excludeModules: /node_modules/
    };
    return new Promise((resolve, reject) => {
        webpack(config, (err, stats) => {
            if(err) {
                spinner.error(tag);
                reject(err.stack || err);
            } else if(stats.hasErrors()) {
                spinner.error(tag);
                reject(stats.toString(statConfig));
            } else {
                spinner.success(tag);
                resolve(stats.toString(statConfig));
            }
        });
    });
}

del([
    '../dist/electron/*'
], { force: true }).then(() => {
    spinner.success('del');
    return Promise.all([
        pack(rendererConfig, 'renderer'),
        pack(mainConfig, 'main')
    ]);
})
    .then((results) => {
        console.log('\n===== Renderer ====='); // eslint-disable-line no-console
        console.log(results[0]); // eslint-disable-line no-console
        console.log('\n===== Main ====='); // eslint-disable-line no-console
        console.log(results[1]); // eslint-disable-line no-console
        process.exit(EX_SUCCESS); // eslint-disable-line no-process-exit
    })
    .catch((err) => {
        console.log(err); // eslint-disable-line no-console
        process.exit(EX_FATAL); // eslint-disable-line no-process-exit
    });
