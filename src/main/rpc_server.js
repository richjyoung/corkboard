import { ipcMain } from 'electron';
import { logwrap } from './logwrap';
const logger = logwrap('RPC');

const IGNORED_METHODS = [
    'length',
    'prototype'
];

export class RPC {
    constructor(clazz) {
        this._methods = {};
        this.reflectTargetClass(clazz);
        logger.verbose('Server setup complete');
    }

    reflectTargetClass(clazz) {
        Reflect.ownKeys(clazz).forEach((method) => {
            if(IGNORED_METHODS.indexOf(method) < 0) {
                this._methods[method] = clazz[method];
                this.attachRpcEndpoint(method);
            }
        });
    }

    static ipcResult(method, evt, id, args) {
        logger.debug('Result: method=%s,id=%d,args=%j', method, id, args);
        evt.sender.send(`rpc_${method}_r`, {
            args,
            id
        });
    }

    static ipcError(method, evt, id, err) {
        logger.debug('Error: method=%s,id=%d,args=%j', method, id, err);
        evt.sender.send(`rpc_${method}_e`, {
            err,
            id
        });
    }

    ipcHandler(method, evt, args) {
        const handler = this._methods[method];
        const handlerArgs = args.args || [];

        // Invoke target method, capturing callback as necessary
        const ret = handler(evt, ...handlerArgs, (err, ...results) => {
            logger.debug('%s returned via callback', method);

            if(err) {
                RPC.ipcError(method, evt, args.id, err);
            } else {
                RPC.ipcResult(method, evt, args.id, results);
            }
        });

        logger.debug('Transaction: method=%s,id=%d,args=%j',
            method, args.id, args.args);

        // Handle return value
        if(ret instanceof Promise) {
            logger.debug('%s returned via Promise', method);

            ret.then((...rest) => {
                RPC.ipcResult(method, evt, args.id, rest);
            }).catch((...rest) => {
                RPC.ipcError(method, evt, args.id, rest);
            });
        } else if(typeof ret === 'undefined') {
            logger.debug('%s returned directly', method);

            RPC.ipcResult(method, evt, args.id, ret);
        }
    }

    attachRpcEndpoint(method) {
        logger.debug('Attaching RPC endpoint for method %s', method);

        ipcMain.on(`rpc_${method}`, (evt, args) => {
            this.ipcHandler(method, evt, args);
        });
    }
}
