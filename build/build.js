const del = require('del');
const spinner = require('multispinner');
const webpack = require('webpack');

const renderer_config = require('./webpack.renderer.config');
const main_config = require('./webpack.main.config');

const m = new spinner({
    del: 'Cleaning output directory',
    renderer: 'Building renderer process',
    main: 'Building main process',
}, {
    interval: 50
});

del(['../dist/electron/*'], { force: true }).then(() => {
    m.success('del');
    return Promise.all([pack(renderer_config, 'renderer'), pack(main_config, 'main')]);
}).then((results) => {
    console.log('\n===== Renderer =====');
    console.log(results[0]);
    console.log('\n===== Main =====');
    console.log(results[1]);
    process.exit(0);
}).catch((err) => {
    m.success('package');
    console.log(err);
    process.exit(1);
});

function pack(config, tag) {
    config.mode = process.env.NODE_ENV || 'production';
    const stat_config = {
        colors: true,
        excludeModules: /node_modules/
    };
    return new Promise((resolve, reject) => {
        webpack(config, (err, stats) => {
            if (err) {
                m.error(tag);
                reject(err.stack || err);
            } else if (stats.hasErrors()) {
                m.error(tag);
                reject(stats.toString(stat_config));
            } else {
                m.success(tag);
                resolve(stats.toString(stat_config));
            }
        });

    });
}