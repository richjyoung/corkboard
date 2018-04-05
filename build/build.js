const webpack = require('webpack');

const renderer_config = require('./webpack.renderer.config');
const main_config = require('./webpack.main.config');

Promise.all([pack(renderer_config), pack(main_config)]).then((results) =>{
    console.log('===== Renderer =====');
    console.log(results[0]);
    console.log('\n===== Main =====');
    console.log(results[1]);
    process.exit(0);
}).catch((err) => {
    console.log(err);
    process.exit(1);
});

function pack(config) {
    config.mode = process.env.NODE_ENV || 'production';
    return new Promise((resolve, reject) => {
        webpack(config, (err, stats) => {
            if (err) {reject(err.stack || err);}

            else if (stats.hasErrors()) {
                let err = '';

                stats.toString({
                    chunks: false,
                    colors: true
                })
                    .split(/\r?\n/)
                    .forEach(line => {
                        err += `    ${line}\n`;
                    });

                reject(err);
            } else {
                resolve(stats.toString({
                    chunks: false,
                    colors: true
                }));
            }
        });

    });
}