import { ipcRenderer } from 'electron';
import { logwrap } from './logwrap';
const logger = logwrap('RPC');

class RPCProxy {
    constructor() {
        this._id = 0;
        this._callbacks = {};
        var self = this;
        return new Proxy(this, {
            get: function (target, prop) {
                if(typeof self[prop] === 'undefined') {
                    self.attach_rpc_endpoint(prop);
                }
                return Reflect.get(...arguments);
            }
        });
    }

    get proxy() {
        return this._proxy;
    }

    next_id() {
        return this._id++;
    }

    ipc_result(method, evt, id, args) {
        var callbacks = this._callbacks[method];
        if(callbacks[id]) {
            callbacks[id](undefined, ...args);
            callbacks[id] = undefined;
            delete callbacks[id];
        }
    }

    ipc_error(method, evt, id, err) {
        var callbacks = this._callbacks[method];
        if(callbacks[id]) {
            callbacks[id](err || {});
            callbacks[id] = undefined;
            delete callbacks[id];
        }
    }

    attach_rpc_endpoint(method) {
        var self = this;
        logger.debug('Attaching RPC endpoint for method %s', method);

        this._callbacks[method] = this._callbacks[method] || {};
        var callbacks = this._callbacks[method];

        var rpc_signature = `rpc_${method}`;
        var rpc_callback = `rpc_${method}_r`;
        var rpc_error = `rpc_${method}_e`;

        // Register success handler
        this[rpc_callback] = function(evt, args) {
            logger.debug('Result: method=%s,id=%d,args=%j', method, args.id, args.args);
            self.ipc_result(method, evt, args.id, args.args);
        };
        ipcRenderer.on(rpc_callback, this[rpc_callback]);

        // Register failure handler
        this[rpc_error] = function(evt, args) {
            logger.debug('Error: method=%s,id=%d,args=%j', method, args.id, args.err);
            self.ipc_error(method, evt, args.id, args.err);
        };
        ipcRenderer.on(rpc_error, this[rpc_error]);


        // Register method proxy
        this[method] = function() {
            var args = Array.prototype.slice.call(arguments);
            var id = this.next_id();
            var callback = args[args.length - 1];
            var parcel = {
                id: id,
                args: args
            };
            if(typeof callback === 'function') {
                callbacks[id] = callback;
                parcel.args = args.slice(0, args.length - 1);
            }
            logger.debug('Transaction: method=%s,id=%d,args=%j', method, id, parcel.args);
            ipcRenderer.send(rpc_signature, parcel);
        };


    }
}

export const RPC = new RPCProxy();