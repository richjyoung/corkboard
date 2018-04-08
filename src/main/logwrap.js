import { sprintf } from 'sprintf-js';

const LEVELS = [
    'error',
    'warn',
    'info',
    'verbose',
    'debug',
    'silly'
];

let loglevel = 'info';

export function setlevel(level) {
    loglevel = level;
}

export function logwrap(tag) {
    function log(level, msg, args) {
        if(LEVELS.indexOf(level) <= LEVELS.indexOf(loglevel)) {
            console.log(sprintf(`[%7s] %s: ${msg}`, level, tag, ...args)); // eslint-disable-line no-console
        }
    }

    return {
        silly: (msg, ...args) => { return log('silly', msg, args); },
        debug: (msg, ...args) => { return log('debug', msg, args); }, // eslint-disable-line sort-keys
        verbose: (msg, ...args) => { return log('verbose', msg, args); },
        info: (msg, ...args) => { return log('info', msg, args); }, // eslint-disable-line sort-keys
        warn: (msg, ...args) => { return log('warn', msg, args); },
        error: (msg, ...args) => { return log('error', msg, args); }, // eslint-disable-line sort-keys
        log: (level, msg, ...args) => { return log(level, msg, ...args); }
    };
}
