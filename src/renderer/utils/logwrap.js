export const log = console.log;
export const warn = console.warn;
export const error = console.error;

export const logIf = function() {
    if(arguments[0]) {
        log.apply(null, Array.prototype.slice.call(arguments, 1));
    }
};

export const warnIf = function() {
    if(arguments[0]) {
        warn.apply(null, Array.prototype.slice.call(arguments, 1));
    }
};

export const errorIf = function() {
    if(arguments[0]) {
        error.apply(null, Array.prototype.slice.call(arguments, 1));
    }
};