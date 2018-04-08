import { sprintf } from 'sprintf-js';

let loglevel = 'info';

export function setlevel(level) {
    loglevel = level;
}

export function logwrap(tag) {
    const levels = [
        'error',
        'warn',
        'info',
        'verbose',
        'debug',
        'silly'
    ];

    function log(level, msg, args) {
        if(levels.indexOf(level) <= levels.indexOf(loglevel)) {
            console.log(sprintf(`[%7s] %s: ${msg}`, level, tag, ...args)); // eslint-disable-line no-console
        }
    }

    return {
        silly: (msg, ...args) => { return log('silly', msg, args); },
        debug: (msg, ...args) => { return log('debug', msg, args); },
        verbose: (msg, ...args) => { return log('verbose', msg, args); },
        info: (msg, ...args) => { return log('info', msg, args); },
        warn: (msg, ...args) => { return log('warn', msg, args); },
        error: (msg, ...args) => { return log('error', msg, args); },
        log: (level, msg, ...args) => { return log(level, msg, ...args); }
    };
}
