import { sprintf } from 'sprintf-js';

let loglevel = 'info';

export function setlevel(level) {
    loglevel = level;
}

export function logwrap(tag) {
    const levels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];

    function log(level, msg, args) {
        if (levels.indexOf(level) <= levels.indexOf(loglevel)) {
            console.log(sprintf('[%7s] %s: ' + msg, level, tag, ...args)); //eslint-disable-line no-console
        }
    }

    return {
        silly: (msg, ...args) => log('silly', msg, args),
        debug: (msg, ...args) => log('debug', msg, args),
        verbose: (msg, ...args) => log('verbose', msg, args),
        info: (msg, ...args) => log('info', msg, args),
        warn: (msg, ...args) => log('warn', msg, args),
        error: (msg, ...args) => log('error', msg, args),
        log: (level, msg, ...args) => log(level, msg, ...args)
    };
}
