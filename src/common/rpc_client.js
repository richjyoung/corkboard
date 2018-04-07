import { ipcRenderer } from 'electron';


class RPCProxy {
    constructor() {
        this._id = 0;
        this._callbacks = {};
        var self = this;
        return new Proxy(this, {
            get: function (target, prop) {
                if(typeof self[prop] === 'undefined') {
                    console.log('RPC method ' + prop + ' does not exist');
                    self.register_rpc_method(prop);
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

    register_rpc_method(method) {
        console.log('RPC Intercept: ' + method);

        var rpc_signature = `rpc_${method}`;
        var rpc_callback = `rpc_${method}_r`;
        var rpc_error = `rpc_${method}_e`;
        var cbs = {};
        this._callbacks[rpc_signature] = cbs;

        // Register success handler
        this[rpc_callback] = function(evt, args) {
            console.log('RPC response ' + rpc_callback + JSON.stringify(args));
            if(cbs[args.id]) {
                if(typeof args.args === 'object') {
                    cbs[args.id](undefined, ...args.args);
                } else {
                    cbs[args.id](undefined, args.args);
                }

                delete cbs[args.id];
            }
        };
        ipcRenderer.on(rpc_callback, this[rpc_callback]);

        // Register failure handler
        this[rpc_error] = function(evt, args) {
            console.log('RPC response ' + rpc_error + JSON.stringify(args));
            if(cbs[args.id]) {
                if(typeof args.err === 'object') {
                    cbs[args.id](undefined, ...args.err);
                } else {
                    cbs[args.id](undefined, args.err);
                }
                delete cbs[args.id];
            }
        };
        ipcRenderer.on(rpc_error, this[rpc_error]);

        // Register method proxy
        this[method] = function() {
            var args = Array.prototype.slice.call(arguments);
            var id = this.next_id();
            var callback = args[args.length - 1];
            console.log('RPC Transaction: method=' + method + ',id=' + id);
            if(typeof callback === 'function') {
                console.log('RPC response requested via callback');
                cbs[id] = callback;
                ipcRenderer.send(rpc_signature, {
                    id: id,
                    args: args.slice(0, args.length)
                });
            } else {
                console.log('RPC response not required');
                ipcRenderer.send(rpc_signature, {
                    id: id,
                    args: args.slice(0, args.length)
                });
            }
        };


    }
}

export const RPC = new RPCProxy();